#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TARGET = process.argv[2]; // 'latest' or 'main'

if (!TARGET || !['latest', 'main'].includes(TARGET)) {
  console.error('Usage: node scripts/switch-version.js <latest|main>');
  process.exit(1);
}

const ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src');
const TSCONFIG_PATH = path.join(ROOT, 'tsconfig.json');

// Pattern configurations
const PATTERNS = {
  latest: {
    from: /@skrteeeeee\/profile-domain/g,
    to: 'src/domain',
    tsconfigPaths: {
      "src/domain/entities/*": ["src/domain/src/entities/*"],
      "src/domain/flows/*": ["src/domain/src/flows/*"],
      "src/domain/entities": ["src/domain/src/entities"],
      "src/domain/flows": ["src/domain/src/flows"],
      "src/domain": ["src/domain/src/index"]
    }
  },
  main: {
    from: /src\/domain/g,
    to: '@skrteeeeee/profile-domain',
    tsconfigPaths: {}
  }
};

const config = PATTERNS[TARGET];

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

// Replace imports in files
function replaceImports() {
  console.log(`\n🔄 Replacing imports for ${TARGET}...`);
  const files = findTsFiles(SRC_DIR);
  let changedFiles = 0;
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const newContent = content.replace(config.from, config.to);
    
    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      changedFiles++;
      console.log(`  ✓ ${path.relative(ROOT, file)}`);
    }
  });
  
  console.log(`\n✅ Updated ${changedFiles} file(s)`);
}

// Parse JSON with comments
function parseJsonWithComments(content) {
  return JSON.parse(content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, ''));
}

// Update tsconfig.json
function updateTsconfig() {
  console.log(`\n🔧 Updating tsconfig.json...`);
  const tsconfigContent = fs.readFileSync(TSCONFIG_PATH, 'utf8');
  const tsconfig = parseJsonWithComments(tsconfigContent);
  
  // Update paths
  const currentPaths = tsconfig.compilerOptions.paths || {};
  const newPaths = {
    "src/*": currentPaths["src/*"] || ["src/*"]
  };
  
  // Add domain paths only for 'latest'
  if (TARGET === 'latest') {
    Object.assign(newPaths, config.tsconfigPaths);
  }
  
  tsconfig.compilerOptions.paths = newPaths;
  
  fs.writeFileSync(TSCONFIG_PATH, JSON.stringify(tsconfig, null, 2) + '\n', 'utf8');
  console.log('✅ tsconfig.json updated');
}

// Verify domain tag (only for main)
function verifyDomainTag() {
  if (TARGET !== 'main') return;
  
  console.log('\n🏷️  Verifying domain tag...');
  try {
    const tag = execSync('git -C src/domain describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
    console.log(`✅ Domain tag found: ${tag}`);
  } catch (error) {
    console.error('❌ No domain tag found. Please create a tag in the domain submodule before switching to main.');
    process.exit(1);
  }
}

// Checkout branch
function checkoutBranch() {
  console.log(`\n📌 Checking out ${TARGET} branch...`);
  try {
    execSync(`git checkout ${TARGET}`, { stdio: 'inherit', cwd: ROOT });
    console.log(`✅ Switched to ${TARGET} branch`);
  } catch (error) {
    console.error(`❌ Failed to checkout ${TARGET} branch`);
    process.exit(1);
  }
}

// Validate tsconfig paths and types
function validateTsconfig() {
  console.log(`\n🔍 Validating tsconfig.json...`);
  const tsconfigContent = fs.readFileSync(TSCONFIG_PATH, 'utf8');
  const tsconfig = parseJsonWithComments(tsconfigContent);
  const paths = tsconfig.compilerOptions.paths || {};
  
  if (TARGET === 'latest') {
    if (!paths['src/domain']) {
      console.error('❌ Missing src/domain paths in tsconfig.json');
      process.exit(1);
    }
  } else if (TARGET === 'main') {
    if (paths['src/domain/entities/*'] || paths['src/domain/flows/*']) {
      console.error('❌ Found domain submodule paths in tsconfig.json for main branch');
      process.exit(1);
    }
  }
  
  console.log('✅ tsconfig.json paths validated');
}

// Run TypeScript type check
function runTypeCheck() {
  console.log(`\n🔎 Running TypeScript type check...`);
  try {
    execSync('npx tsc --noEmit', { stdio: 'inherit', cwd: ROOT });
    console.log('✅ TypeScript type check passed');
  } catch (error) {
    console.error('❌ TypeScript type check failed');
    process.exit(1);
  }
}

// Main execution
console.log(`\n🚀 Switching to ${TARGET.toUpperCase()} version...\n`);

checkoutBranch();
verifyDomainTag();
replaceImports();
updateTsconfig();
validateTsconfig();
runTypeCheck();

console.log(`\n✨ Successfully switched to ${TARGET} version!`);
console.log(`\nNext steps:`);
if (TARGET === 'main') {
  console.log(`  1. Install package: npm install @skrteeeeee/profile-domain@latest`);
  console.log(`  2. Commit changes: git add . && git commit -m "chore: switch to main (package)"`);
} else {
  console.log(`  1. Init submodule: git submodule update --init --recursive`);
  console.log(`  2. Commit changes: git add . && git commit -m "chore: switch to latest (submodule)"`);
}
