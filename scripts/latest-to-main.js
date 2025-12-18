#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// Helper: Execute command with proper error handling
function exec(command, options = {}) {
  try {
    return execSync(command, {
      encoding: 'utf8',
      cwd: ROOT,
      ...options
    });
  } catch (error) {
    if (options.ignoreError) {
      return null;
    }
    throw error;
  }
}

// 1. Pre-checks (Security: Must be on latest)
console.log('\n🚀 Merging latest → main with automatic import conversion...\n');

const currentBranch = exec('git rev-parse --abbrev-ref HEAD').trim();
console.log(`📍 Current branch: ${currentBranch}`);

if (currentBranch !== 'latest') {
  console.error('❌ Security Check Failed: This script must be run from the \'latest\' branch.');
  console.error('   Please checkout latest: git checkout latest');
  process.exit(1);
}

const status = exec('git status --porcelain');
if (status.trim()) {
  console.error('❌ You have uncommitted changes. Please commit or stash them first.');
  process.exit(1);
}
console.log('✅ Working tree is clean');

// 2. Checkout main
console.log(`\n🔄 Switching to 'main' branch...`);
try {
  exec('git checkout main', { stdio: 'inherit' });
  console.log('✅ Switched to main branch');
} catch (error) {
  console.error('❌ Failed to checkout main.');
  process.exit(1);
}

// 3. Merge 'latest'
console.log('\n📦 Merging latest branch (using theirs strategy for conflicts)...');
try {
  // Use --no-commit to allow us to modify files before committing
  // Use -X theirs to accept incoming changes from latest for basic conflicts
  exec('git merge latest --strategy-option=theirs --no-commit', { stdio: 'inherit' });
  console.log('✅ Merge completed (not committed yet)');
} catch (error) {
  console.log('⚠️ Merge encountered conflicts. Attempting auto-resolution...');

  // Check if src/domain conflict exists (common when switching structure)
  try {
    const status = exec('git status --porcelain');
    if (status.includes('src/domain')) {
      console.log('   Detected src/domain conflict. Resolving by removing local folder (keeping package structure)...');
      exec('git rm -rf src/domain', { stdio: 'inherit' });
    } else {
      throw error; // Unknown conflict
    }
  } catch (resolutionError) {
    console.error('❌ Merge failed with unresolved conflicts.');
    console.error('   Please resolve manually, run "npm run switch:main", and commit.');
    process.exit(1);
  }
}

// 4. Apply 'main' configuration (via switch-version.js)
console.log('\n🔄 Applying main configuration (imports & tsconfig)...');
try {
  // run switch-version.js with main target and auto-merge flag (skips branch check since we are on main)
  // Use npx -p typescript tsc for safe execution
  exec('node scripts/switch-version.js main --auto-merge', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Configuration switch failed. Aborting.');
  exec('git merge --abort', { ignoreError: true }); // Attempt to abort merge
  process.exit(1);
}

// 5. Commit results
console.log('\n📝 Staging and Committing...');
exec('git add .');

try {
  exec('git commit -m "chore: merge latest to main with package domain"', { stdio: 'inherit' });
  console.log('✅ Merge committed successfully');
} catch (error) {
  console.error('❌ Commit failed (maybe nothing to commit?)');
  process.exit(1);
}

console.log('\n✨ Successfully merged latest → main!');
console.log('\nNext steps:');
console.log('  1. Remove submodule (if present): git rm -r src/domain');
console.log('  2. Install package: npm install @skrteeeeee/profile-domain@latest');
console.log('  3. Push when ready: git push origin main');
