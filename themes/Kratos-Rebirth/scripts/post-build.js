const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const yaml = require('js-yaml');

// --- 取得 Hexo 專案根目錄 ---
const ROOT = process.cwd(); // Hexo 執行時總是在根目錄執行
const CONFIG_PATH = path.join(ROOT, '_config.yml');

/** 讀取 Hexo 主配置文件 */
function loadHexoConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error('[post-build] ❌ 找不到 _config.yml，請確認腳本在 Hexo 專案根目錄中運行。');
    process.exit(1);
  }
  try {
    const content = fs.readFileSync(CONFIG_PATH, 'utf8');
    return yaml.load(content) || {};
  } catch (err) {
    console.error('[post-build] ❌ 無法解析 _config.yml：', err);
    process.exit(1);
  }
}

/** 複製靜態資源資料夾 */
function copyStaticFolders(config) {
  const folders = config.static_folders || ['static'];
  const publicDir = path.resolve(ROOT, config.public_dir || 'public');

  if (!folders.length) {
    console.log('[post-build] ⚠️ 未在 _config.yml 中定義 static_folders，跳過複製。');
    return;
  }

  // 確保 public 目錄存在
  fse.ensureDirSync(publicDir);

  for (const folder of folders) {
    const src = path.resolve(ROOT, folder);
    const dest = path.resolve(publicDir, folder);

    if (!fs.existsSync(src)) {
      console.warn(`[post-build] ⚠️ 資料夾不存在：${src}`);
      continue;
    }

    try {
      fse.copySync(src, dest, { overwrite: true });
      console.log(`[post-build] ✅ 已複製 ${folder} → ${path.relative(ROOT, dest)}`);
    } catch (err) {
      console.error(`[post-build] ❌ 複製 ${folder} 時發生錯誤：`, err);
    }
  }
}

/** 主程序入口 */
function main() {
  console.log('🚀 [post-build] 開始同步靜態資源...');
  const config = loadHexoConfig();
  copyStaticFolders(config);
  console.log('🏁 [post-build] 所有靜態資源已同步完成。');
}

const args = process.argv.slice(2).map(a => a.toLowerCase());
const commands = ['g', 'generate', 'build'];
if (args.includes('clean')) {
  // --- 如果是 clean 階段就直接跳過 ---
  console.log('[post-build] 🧹 檢測到 hexo clean，跳過靜態資源同步。');
} else if (!args.some(arg => commands.includes(arg))) {
  // --- 檢查當前命令，只在主生成階段執行 ---
  console.log('[post-build] ⚙️ 當前非生成階段，跳過靜態資源同步。');
} else {
  main();
}
