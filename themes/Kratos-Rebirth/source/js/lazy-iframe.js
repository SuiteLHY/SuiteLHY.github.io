// iframe懶加載組件
class LazyIframe extends HTMLElement {
  constructor() {
    super();
  }

  removeBackgroundImage() {
	this.style.backgroundImage = '';
  }

  connectedCallback() {
    const src = this.getAttribute('src');
    const placeholder = this.getAttribute('placeholder') || '▶️';
    const background = this.style.backgroundImage || '';

    this.innerHTML = `<div class="lazy-iframe-container" loading="lazy" style="${background ? '' : 'display: flex; align-items: center; justify-content: center;'}">
  ${background ? '<div class="lazy-iframe-bg" style="position:absolute; top:0; left:0; width:100%; height:100%;"></div>' : ''}
  <div class="lazy-iframe-icon">${placeholder}</div>
</div>`;

    const container = this.querySelector('.lazy-iframe-container');
    const bg = this.querySelector('.lazy-iframe-bg');
    if (bg && background) {
      bg.style.backgroundImage = background;
    }

    container.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
	  const containerStyle = window.getComputedStyle(container);
	  const containerHeight = containerStyle.height;
	  const actualWidth = container.getBoundingClientRect().width;
	  const actualHeight = container.getBoundingClientRect().height;
      iframe.src = src;
      iframe.frameBorder = 0;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.style.width = '100%';
      iframe.style.height = (containerHeight !== '0px') ? containerHeight : '100%';
	  iframe.style.minWidth = actualWidth;
	  iframe.style.minHeight = actualHeight;
      this.innerHTML = '';
      this.appendChild(iframe);
	  
	  this.removeBackgroundImage();
    });
  }
}

customElements.define('lazy-iframe', LazyIframe);
