#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Determine target version from args
const args = process.argv.slice(2);
const TARGET = args[0]; // 'latest' or 'main'
const IS_AUTO_MERGE = args.includes('--auto-merge'); // Flag to skip branch check if called from merge script

if (!TARGET || !['latest', 'main'].includes(TARGET)) {
  console.error('Usage: node scripts/switch-version.js <latest|main> [--auto-merge]');
  process.exit(1);
}

const ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src');
const TEST_DIR = path.join(ROOT, 'test'); // Add test directory
const TSCONFIG_PATH = path.join(ROOT, 'tsconfig.json');
const PACKAGE_JSON_PATH = path.join(ROOT, 'package.json');

// Configuration
const CONFIG = {
  latest: {
    name: 'latest (Submodule)',
    fromPattern: /@skrteeeeee\/profile-domain/g,
    toPath: 'src/domain',
    tsconfigPaths: {
      "src/domain/entities/*": ["src/domain/src/entities/*"],
      "src/domain/flows/*": ["src/domain/src/flows/*"],
      "src/domain/entities": ["src/domain/src/entities"],
      "src/domain/flows": ["src/domain/src/flows"],
      "src/domain": ["src/domain/src/index"]
    }
  },
  main: {
    name: 'main (Package)',
    fromPattern: /src\/domain(\/[a-zA-Z0-9_\-\/]+)?/g,
    toPath: '@skrteeeeee/profile-domain',
    tsconfigPaths: {} // Intentionally empty to remove domain paths
  }
};

const activeConfig = CONFIG[TARGET];

// Helper: Get current branch
function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8', cwd: ROOT }).trim();
  } catch (e) {
    return 'unknown';
  }
}

// Helper: Find TS files recursively
function findTsFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;

  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      // FIX: Only ignore 'src/domain' specifically, not any folder named 'domain'
      // We check if the full path matches the submodule location
      if (filePath === path.join(ROOT, 'src', 'domain')) {
        return; // Skip submodule
      }

      if (!['node_modules', 'dist', '.git'].includes(file)) {
        findTsFiles(filePath, fileList);
      }
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Helper: JSON with comments parser/stringifier (basic)
function readJson(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Simple strip comments for parsing
  const clean = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  return JSON.parse(clean);
}

console.log(`\n🚀 Switching to: ${activeConfig.name}`);

// 1. Verify Branch (Skip if auto-merge)
if (!IS_AUTO_MERGE) {
  const branch = getCurrentBranch();
  console.log(`\n📍 [1/8] Branch Check: ${branch}`);
  if (branch !== TARGET) {
    console.error(`❌ Mismatch! You are configuring for '${TARGET}' but on branch '${branch}'.`);
    console.error(`   Use 'git checkout ${TARGET}' first.`);
    process.exit(1);
  }
} else {
  console.log(`\n📍 [1/8] Branch Check: Skipped (Auto-merge mode)`);
}

// 2. Replace Imports
console.log(`\n🔄 [2/8] Updating imports...`);
// Search in both SRC_DIR and TEST_DIR
const files = [...findTsFiles(SRC_DIR), ...findTsFiles(TEST_DIR)];
let changedCount = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(activeConfig.fromPattern, activeConfig.toPath);

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedCount++;
    console.log(`  ✓ Modified: ${path.relative(ROOT, file)}`);
  }
});
console.log(`✅ Updated ${changedCount} files.`);

// 3. Validate package.json
console.log(`\n📦 [3/8] Validating package.json...`);
try {
  const pkg = readJson(PACKAGE_JSON_PATH);
  if (TARGET === 'main') {
    if (!pkg.dependencies || !pkg.dependencies['@skrteeeeee/profile-domain']) {
      console.warn(`⚠️ Warning: '@skrteeeeee/profile-domain' missing in package.json dependencies.`);
      // We don't fail here because 'npm install' step might fix it or we expect it to be there.
      // But user said "Valida/Mantiene".
    } else {
      console.log(`✅ Package dependency present.`);
    }
  }
} catch (e) {
  console.error(`❌ Could not read package.json`);
}

// 4. Update tsconfig.json
console.log(`\n🔧 [4/8] Updating tsconfig.json...`);
try {
  const tsconfig = readJson(TSCONFIG_PATH);

  // Preserve existing paths, remove old domain paths
  const currentPaths = tsconfig.compilerOptions.paths || {};
  const cleanPaths = {};

  // Copy all non-domain paths
  Object.keys(currentPaths).forEach(key => {
    if (!key.startsWith('src/domain')) {
      cleanPaths[key] = currentPaths[key];
    }
  });

  // Add new paths if any (only for 'latest')
  Object.assign(cleanPaths, activeConfig.tsconfigPaths);

  // Sort paths for consistency (optional)
  const sortedPaths = Object.keys(cleanPaths).sort().reduce((acc, key) => {
    acc[key] = cleanPaths[key];
    return acc;
  }, {});

  tsconfig.compilerOptions.paths = sortedPaths;

  fs.writeFileSync(TSCONFIG_PATH, JSON.stringify(tsconfig, null, 2) + '\n', 'utf8');
  console.log(`✅ tsconfig.json updated.`);
} catch (error) {
  console.error(`❌ Failed to update tsconfig.json:`, error.message);
  process.exit(1);
}

// 5. Clean (dist + node_modules)
console.log(`\n🧹 [5/8] Cleaning (dist, node_modules)...`);
try {
  if (fs.existsSync(path.join(ROOT, 'dist'))) {
    fs.rmSync(path.join(ROOT, 'dist'), { recursive: true, force: true });
  }
  if (fs.existsSync(path.join(ROOT, 'node_modules'))) {
    fs.rmSync(path.join(ROOT, 'node_modules'), { recursive: true, force: true });
  }
  console.log(`✅ Cleaned.`);
} catch (e) {
  console.error(`❌ Failed to clean: ${e.message}`);
  // Don't exit, try to continue
}

// 6. Load Environment (NPM_TOKEN)
console.log(`\n🔑 [6/8] Loading environment variables...`);
const ENV_PATH = path.join(ROOT, '.env');
if (fs.existsSync(ENV_PATH)) {
  const envConfig = fs.readFileSync(ENV_PATH, 'utf8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^['"]|['"]$/g, ''); // Remove quotes
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
  if (process.env.NPM_TOKEN) {
    console.log('   ✅ NPM_TOKEN loaded from .env');
  } else {
    console.log('   ⚠️ NPM_TOKEN not found in .env (if needed)');
  }
} else {
  console.log('   ℹ️ No .env file found.');
}

// 7. Install Dependencies
console.log(`\n📥 [7/8] Installing dependencies...`);
try {
  // If main, make sure we install the package. If latest, we might just npm install.
  if (TARGET === 'main') {
    console.log('   Installing @skrteeeeee/profile-domain@latest and deps...');
    // install package explicitly to ensure it's in package.json if missing/outdated
    execSync('npm install @skrteeeeee/profile-domain@latest', { stdio: 'inherit', cwd: ROOT });
    // then install others (though npm install pkg installs others usually, but let's be sure)
    execSync('npm install', { stdio: 'inherit', cwd: ROOT });
  } else {
    console.log('   Running npm install...');
    execSync('npm install', { stdio: 'inherit', cwd: ROOT });
  }
  console.log('✅ Dependencies installed.');
} catch (e) {
  console.error(`❌ Failed to install dependencies.`);
  process.exit(1);
}

// 8. Validate Types
console.log(`\n🔎 [8/8] Strict type check (tsc --noEmit)...`);
try {
  execSync('npx -p typescript tsc --noEmit', { stdio: 'inherit', cwd: ROOT });
  console.log(`✅ Type check passed.`);
} catch (error) {
  console.error(`❌ Type check failed.`);
  process.exit(1);
}

console.log(`\n✨ Successfully switched to ${TARGET} version!\n`);
