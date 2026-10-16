const Hexo = require('hexo');

const hexo = new Hexo(process.cwd(), {});

// hexo-filter-plantuml 直接使用全域 hexo
global.hexo = hexo;

console.log('=== Before loading plugin ===');
console.log('plantuml config:', hexo.config.plantuml);

require('hexo-filter-plantuml');

console.log('\n=== After loading plugin ===');
console.log('plantuml config:', hexo.config.plantuml);

console.log('\n=== Tag env ===');
console.log(hexo.extend.tag.env);

console.log('\n=== Filter store ===');
console.log(hexo.extend.filter.store);