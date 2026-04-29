/*!
  标签小组件文件
  Created by [Candinya](https://candinya.com)
  Updated by [Suite](https://github.com/SuiteLHY)
  Created for [Kratos-Rebirth](https://github.com/Candinya/Kratos-Rebirth)
*/

const { decode } = require('html-entities');

function safeDecode(text) {
    if (!text) return '';
    return decode(decode(text));
}

// 提示横幅
hexo.extend.tag.register('alertbox', function(args){
    const icon = {
        'primary': 'refresh',
        'success': 'check',
        'danger': 'exclamation',
        'info': 'info',
        'warning': 'warning',
    };
	var content = safeDecode(args.slice(1).join(' '));
    return `<div class="alert alert-${args[0]}">` +
    `<div class="icon"><i class="fa fa-${icon[args[0]]}"></i></div>` +
    `<div class="text">${hexo.render.renderSync({text: content, engine: 'markdown'})}</div>` +
    `</div>`;
});

// 折叠内容
hexo.extend.tag.register('collapse', function(args, content){
    content = hexo.render.renderSync({text: content, engine: 'markdown'});

    return `<div class="xControl${args[1] === 'open' ? ' active' : ''}">
    <div class="xHeading"><div class="xIcon"><i class="fa fa-plus"></i></div><span>${args[0]}</span></div>
    <div class="xContent${args[1] === 'open' ? ' pre-open' : ''}"><div class="inner">
        ${content} 
    </div></div>
    </div>`;
}, {ends: true});

// 提示面板
hexo.extend.tag.register('colorpanel', function(args, content){
    content = hexo.render.renderSync({text: content, engine: 'markdown'});
    var title = safeDecode(args.slice(1).join(' '));

    return `<div class="panel panel-${args[0]}">
    <div class="panel-title">${title}</div>
    <div class="panel-body">
        ${content}
    </div>
    </div>`;
}, {ends: true});

// 模糊隐藏
hexo.extend.tag.register('blur', function(args) {
	var content = safeDecode(args.slice(0).join(' '));
    return `<span class="blur">${content}</span>`;
})
