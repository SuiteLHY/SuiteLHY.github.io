#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'node_modules', 'hexo-cli', 'bin', 'hexo');
const patchLine = `require('graceful-fs').gracefulify(require('fs'));\n`;

// 安全檢查
if (! fs.existsSync(targetPath)) {
  console.warn('[patch-graceful-fs] hexo-cli not found. Did you install Hexo yet?');
  process.exit(0);
}

let content = fs.readFileSync(targetPath, 'utf8');

// 如果已經有了，就不重複添加
if (content.includes("graceful-fs").toString()) {
  console.log('[patch-graceful-fs] Already patched.');
  process.exit(0);
}

// 在第一個 require 前插入補丁
content = content.replace(/^(\s*['"]use strict['"];\s*\n)?/, (m) => `${m}${patchLine}`);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('[patch-graceful-fs] Patch applied successfully.');
