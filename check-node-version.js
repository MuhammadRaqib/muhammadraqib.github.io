#!/usr/bin/env node

// Node.js version checker for EcoTrack
const requiredVersion = 20;
const currentVersion = parseInt(process.version.slice(1).split('.')[0]);

console.log(`🔍 Checking Node.js version...`);
console.log(`Current version: ${process.version}`);
console.log(`Required version: ${requiredVersion}+`);

if (currentVersion < requiredVersion) {
  console.log(`❌ Node.js version ${requiredVersion}+ is required!`);
  console.log(`📝 Please upgrade Node.js:`);
  console.log(`   - Visit: https://nodejs.org/`);
  console.log(`   - Or use nvm: nvm install ${requiredVersion} && nvm use ${requiredVersion}`);
  process.exit(1);
} else {
  console.log(`✅ Node.js version check passed!`);
  process.exit(0);
}
