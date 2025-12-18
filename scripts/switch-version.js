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
    // Replace package with src/domain path
    // We want to replace '@skrteeeeee/profile-domain' with 'src/domain'
    // This allows sub-paths like '@skrteeeeee/profile-domain/entities/user' -> 'src/domain/entities/user'
    // BUT user said: "el cambio ha de substituir la ruta entera ... -> SI '@skrteeeeee/profile-domain'" when going to main.
    // So for latest, we reverse it: '@skrteeeeee/profile-domain' -> 'src/domain' (preserving subpaths?)
    // Actually, if main uses flat package, we need to map flat package to deep src/domain?
    // Let's assume standard behavior based on user feedback:
    // main: src/domain/entities/x -> @skrteeeeee/profile-domain
    // latest: @skrteeeeee/profile-domain -> src/domain/entities/x ?? -> THIS IS HARD if purely regex.
    // CHECK USER REQUEST AGAIN: "from 'src/domain/entities/pre-tech' -> ... -> SI '@skrteeeeee/profile-domain'"
    // This implies the package exports everything flat. 
    // IF we are going back to latest, we need to know WHERE it came from. 
    // This is tricky without AST. 
    // However, if we assume the user maintains the code in 'latest' and only pushes to 'main' for release,
    // then 'switch:latest' is less critical to get perfectly right IF we assume 'latest' is the source of truth forever.
    // But 'switch:latest' allows moving back.
    // Let's stick to the user's specific request for MAIN first: replace ANY src/domain/... path with JUST @skrteeeeee/profile-domain

    fromPattern: /@skrteeeeee\/profile-domain/g,
    toPath: 'src/domain',
    // ^ This revert is imperfect if main collapsed paths. But let's keep it simple for now or usage will break.
    // If main collapses 'src/domain/entities/user' to '@pkg', then '@pkg' -> 'src/domain' is 'src/domain' (missing /entities/user).
    // The user might rely on auto-import to fix this in IDE, but script might break it.
    // For now, let's focus on latest->main correctness.

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
    // Regex to match 'src/domain' followed by anything or nothing, and replace with package
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
  console.log(`\n📍 [1/7] Branch Check: ${branch}`);
  if (branch !== TARGET) {
    console.error(`❌ Mismatch! You are configuring for '${TARGET}' but on branch '${branch}'.`);
    console.error(`   Use 'git checkout ${TARGET}' first.`);
    process.exit(1);
  }
} else {
  console.log(`\n📍 [1/7] Branch Check: Skipped (Auto-merge mode)`);
}

// 2. Replace Imports
console.log(`\n🔄 [2/7] Updating imports...`);
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
console.log(`\n📦 [3/7] Validating package.json...`);
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
console.log(`\n🔧 [4/7] Updating tsconfig.json...`);
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
console.log(`\n🧹 [5/7] Cleaning (dist, node_modules)...`);
try {
  execSync('rm -rf dist node_modules', { stdio: 'inherit', cwd: ROOT });
  console.log(`✅ Cleaned.`);
} catch (e) {
  // Use rm -rf equivalent for Windows if needed, but 'rm -rf' usually works in git bash/powershell if available,
  // or use fs.rmSync in node > 14
  try {
    fs.rmSync(path.join(ROOT, 'dist'), { recursive: true, force: true });
    fs.rmSync(path.join(ROOT, 'node_modules'), { recursive: true, force: true });
    console.log(`✅ Cleaned (fs).`);
  } catch (fsErr) {
    console.error(`❌ Failed to clean: ${fsErr.message}`);
  }
}

// 6. Install Dependencies
console.log(`\n📥 [6/7] Installing dependencies...`);
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

// 7. Validate Types
console.log(`\n🔎 [7/7] Strict type check (tsc --noEmit)...`);
try {
  // Use -p tsconfig.build.json to ignore tests during this check if desired
  // But user complained about tests NOT being updated, implying they SHOULD be checked or at least consistent.
  // Assuming we fixed the imports in tests, we SHOULD be able to check everything? 
  // User pointed out: "No se estan aplicando los cambios en los archivos de test".
  // If we fix that, `tsc` (standard) should pass if types are correct.
  // HOWEVER, missing types for 'jest', 'expect' etc suggest env issues in 'main'. 
  // Let's stick to standard `tsc` now that we fixed specific file inclusions. If it fails on 'expect', it's a separate config issue.
  // But to be safe and ensure CI passes build, let's check build config at least.

  execSync('npx -p typescript tsc --noEmit', { stdio: 'inherit', cwd: ROOT });
  console.log(`✅ Type check passed.`);
} catch (error) {
  console.error(`❌ Type check failed.`);
  console.log('   (Note: If errors are only in filtered tests, you might want to adjust tsconfig or switch logic)');
  process.exit(1);
}

console.log(`\n✨ Successfully switched to ${TARGET} version!\n`);
