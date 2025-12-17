#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src');
const TSCONFIG_PATH = path.join(ROOT, 'tsconfig.json');

// Execute command with proper error handling
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

// Get current branch
function getCurrentBranch() {
  return exec('git rev-parse --abbrev-ref HEAD').trim();
}

// Check for uncommitted changes
function checkCleanWorkingTree() {
  const status = exec('git status --porcelain');
  if (status.trim()) {
    console.error('❌ You have uncommitted changes. Please commit or stash them first.');
    console.log('\nUncommitted files:');
    console.log(status);
    process.exit(1);
  }
}

// Parse JSON with comments
function parseJsonWithComments(content) {
  return JSON.parse(content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, ''));
}

// Find all TypeScript files
function findTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules' && file !== 'dist' && file !== 'domain') {
      findTsFiles(filePath, fileList);
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Replace imports
function replaceImports() {
  console.log('\n🔄 Converting imports to package format...');
  const files = findTsFiles(SRC_DIR);
  let changedFiles = 0;
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const newContent = content.replace(/src\/domain/g, '@skrteeeeee/profile-domain');
    
    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      changedFiles++;
      console.log(`  ✓ ${path.relative(ROOT, file)}`);
    }
  });
  
  console.log(`\n✅ Updated ${changedFiles} file(s)`);
}

// Update tsconfig.json
function updateTsconfig() {
  console.log('\n🔧 Updating tsconfig.json...');
  const tsconfigContent = fs.readFileSync(TSCONFIG_PATH, 'utf8');
  const tsconfig = parseJsonWithComments(tsconfigContent);
  
  // Remove domain paths for main branch
  const currentPaths = tsconfig.compilerOptions.paths || {};
  const newPaths = {
    "src/*": currentPaths["src/*"] || ["src/*"]
  };
  
  tsconfig.compilerOptions.paths = newPaths;
  
  fs.writeFileSync(TSCONFIG_PATH, JSON.stringify(tsconfig, null, 2) + '\n', 'utf8');
  console.log('✅ tsconfig.json updated');
}

// Run TypeScript type check
function runTypeCheck() {
  console.log('\n🔎 Running TypeScript type check...');
  try {
    exec('npx tsc --noEmit', { stdio: 'inherit' });
    console.log('✅ TypeScript type check passed');
  } catch (error) {
    console.error('❌ TypeScript type check failed');
    console.error('Please fix the errors before proceeding.');
    process.exit(1);
  }
}

// Main execution
console.log('\n🚀 Merging latest → main with automatic import conversion...\n');

const currentBranch = getCurrentBranch();
console.log(`📍 Current branch: ${currentBranch}`);

if (currentBranch !== 'main') {
  console.error('❌ You must be on the main branch to run this script.');
  console.error('   Run: git checkout main');
  process.exit(1);
}

console.log('✅ On main branch');

checkCleanWorkingTree();
console.log('✅ Working tree is clean');

// Perform the merge using theirs strategy to avoid conflicts
console.log('\n📦 Merging latest branch (using theirs strategy for conflicts)...');
try {
  exec('git merge latest --strategy-option=theirs --no-commit', { stdio: 'inherit' });
  console.log('✅ Merge completed (not committed yet)');
} catch (error) {
  console.error('❌ Merge failed. Please resolve conflicts manually.');
  process.exit(1);
}

// Convert imports and tsconfig
replaceImports();
updateTsconfig();

// Stage all changes
console.log('\n📝 Staging changes...');
exec('git add .');
console.log('✅ Changes staged');

// Type check before committing
runTypeCheck();

// Commit the merge
console.log('\n💾 Committing merge...');
try {
  exec('git commit -m "chore: merge latest to main with package domain"', { stdio: 'inherit' });
  console.log('✅ Merge committed');
} catch (error) {
  console.error('❌ Commit failed');
  process.exit(1);
}

console.log('\n✨ Successfully merged latest → main!');
console.log('\nNext steps:');
console.log('  1. Remove submodule: git rm -r src/domain');
console.log('  2. Install package: npm install @skrteeeeee/profile-domain@latest');
console.log('  3. Test your application');
console.log('  4. Push when ready: git push origin main');
