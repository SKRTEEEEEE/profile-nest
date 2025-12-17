#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const TSCONFIG_PATH = path.join(ROOT, 'tsconfig.json');

// Parse JSON with comments
function parseJsonWithComments(content) {
  return JSON.parse(content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, ''));
}

function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { 
      encoding: 'utf8',
      cwd: ROOT
    }).trim();
  } catch (error) {
    console.error('❌ Failed to get current branch');
    process.exit(1);
  }
}

function checkImports() {
  const SRC_DIR = path.join(ROOT, 'src');
  const branch = getCurrentBranch();
  
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
  
  const files = findTsFiles(SRC_DIR);
  const issues = [];
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(ROOT, file);
    
    if (branch === 'latest') {
      if (content.includes('@skrteeeeee/profile-domain')) {
        issues.push(`${relativePath}: Found package import in 'latest' branch`);
      }
    } else if (branch === 'main') {
      if (content.match(/from ['"]src\/domain/)) {
        issues.push(`${relativePath}: Found submodule import in 'main' branch`);
      }
    }
  });
  
  return issues;
}

function checkTsconfig() {
  const branch = getCurrentBranch();
  const tsconfigContent = fs.readFileSync(TSCONFIG_PATH, 'utf8');
  const tsconfig = parseJsonWithComments(tsconfigContent);
  const paths = tsconfig.compilerOptions.paths || {};
  const issues = [];
  
  if (branch === 'latest') {
    if (!paths['src/domain']) {
      issues.push('tsconfig.json: Missing domain paths for latest branch');
    }
  } else if (branch === 'main') {
    if (paths['src/domain']) {
      issues.push('tsconfig.json: Should not have domain paths in main branch');
    }
  }
  
  return issues;
}

// Main execution
console.log('🔍 Checking branch configuration...\n');

const branch = getCurrentBranch();
console.log(`Current branch: ${branch}\n`);

const importIssues = checkImports();
const tsconfigIssues = checkTsconfig();
const allIssues = [...importIssues, ...tsconfigIssues];

if (allIssues.length === 0) {
  console.log('✅ All checks passed! Configuration matches branch.');
  process.exit(0);
} else {
  console.log('❌ Configuration issues found:\n');
  allIssues.forEach(issue => console.log(`  - ${issue}`));
  console.log(`\n💡 Run: npm run switch:${branch} to fix these issues.`);
  process.exit(1);
}
