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
const TSCONFIG_PATH = path.join(ROOT, 'tsconfig.json');

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
    fromPattern: /src\/domain/g,
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
      if (!['node_modules', 'dist', 'domain', '.git'].includes(file)) {
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

// 1. Verify Branch (Skip if auto-merge)
if (!IS_AUTO_MERGE) {
  const branch = getCurrentBranch();
  console.log(`\n📍 Current branch: ${branch}`);
  if (branch !== TARGET) {
    console.error(`❌ Mismatch! You are configuring for '${TARGET}' but on branch '${branch}'.`);
    console.error(`   Use 'git checkout ${TARGET}' first.`);
    process.exit(1);
  }
} else {
  console.log(`\n📍 Skipping branch check (Auto-merge mode)`);
}

console.log(`\n🚀 Switching to: ${activeConfig.name}`);

// 2. Replace Imports
console.log(`\n🔄 Updating imports...`);
const files = findTsFiles(SRC_DIR);
let changedCount = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(activeConfig.fromPattern, activeConfig.toPath);

  // Extra safety: Fix any double replacements or path issues if needed
  // e.g., src/domain/src/index -> src/domain if going to package? usually regex covers it.

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedCount++;
    console.log(`  ✓ Modified: ${path.relative(ROOT, file)}`);
  }
});
console.log(`✅ Updated ${changedCount} files.`);

// 3. Update tsconfig.json
console.log(`\n🔧 Updating tsconfig.json...`);
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

// 4. Validate Types
console.log(`\n🔎 strict type check (tsc --noEmit)...`);
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit', cwd: ROOT });
  console.log(`✅ Type check passed.`);
} catch (error) {
  console.error(`❌ Type check failed. Please check errors above.`);
  process.exit(1);
}

console.log(`\n✨ Successfully switched to ${TARGET} version!\n`);

