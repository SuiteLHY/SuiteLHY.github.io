hexo.extend.helper.register('static_post', function(filename) {
  if (!filename) return '';
  const postName = this.page.source.split('/').pop().replace(/\.md$/, '');
  return `/static/${postName}/${filename}`;
});
