hexo.extend.filter.register('after_render:html', function (str) {
  if (!str) return str;
  
  // 正則匹配被包裹在 <p> 內的 <lazy-iframe>，並移除 <p> 包裹
  // 正則匹配被包裹在 <p> 內的 <lazy-hls-player>，並移除 <p> 包裹
  return str.replace(/<p>\s*(<lazy-iframe[\s\S]*?<\/lazy-iframe>)\s*<\/p>/g, '$1')
    .replace(/<p>\s*(<lazy-hls-player[\s\S]*?<\/lazy-hls-player>)\s*<\/p>/g, '$1');
});
