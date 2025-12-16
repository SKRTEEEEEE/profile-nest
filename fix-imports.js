const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all files with src/domain imports
const files = execSync('git grep -l "from [\'\\"]src/domain" src/', { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .filter(Boolean);

console.log(`Found ${files.length} files to fix`);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Replace src/domain/entities/* with @skrteeeeee/profile-domain/dist/entities/*
  content = content.replace(
    /from ['"]src\/domain\/entities\/([^'"]+)['"]/g,
    "from '@skrteeeeee/profile-domain/dist/entities/$1'"
  );
  
  // Replace src/domain/flows/* with @skrteeeeee/profile-domain/dist/flows/*
  content = content.replace(
    /from ['"]src\/domain\/flows\/([^'"]+)['"]/g,
    "from '@skrteeeeee/profile-domain/dist/flows/$1'"
  );
  
  // Replace src/domain (barrel) with @skrteeeeee/profile-domain
  content = content.replace(
    /from ['"]src\/domain['"]/g,
    "from '@skrteeeeee/profile-domain'"
  );
  
  fs.writeFileSync(file, content, 'utf-8');
  console.log(`✅ Fixed: ${file}`);
});

console.log(`\n✅ Fixed ${files.length} files!`);
