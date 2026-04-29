// lazy-hls-player組件
class LazyHlsPlayer extends HTMLElement {
  constructor() {
    super();
  }

  async _ensureHlsLoaded() {
    // 若已有 Hls，就不需再載入
    if (window.Hls) return true;

    // 動態載入 Hls.js
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "/lib/hls.min.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }

  async _clickEvent(container, src) {
    const video = document.createElement('video');
    video.setAttribute('controls', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('loading', 'lazy');
    video.style.width = '100%';
    video.style.height = '100%';
    const actualWidth = container.getBoundingClientRect().width;
    const actualHeight = container.getBoundingClientRect().height;
    video.style.minWidth = actualWidth + 'px';
    video.style.minHeight = actualHeight + 'px';
    
	const hlsLoaded = await this._ensureHlsLoaded();
    if (hlsLoaded && Hls && Hls.isSupported()) {
	  const hls = new Hls();
	  hls.on(Hls.Events.ERROR, (event, data) => {
		console.error('HLS Error:', data);
	  });
	  hls.loadSource(src);
	  hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
	  video.src = src;
	  video.addEventListener("error", () => {
        container.innerHTML = `<p style="color:red">無法播放（Hls.js 加載失敗且瀏覽器不支援原生 HLS）</p>`;
      });
    }
    this.innerHTML = '';
    this.appendChild(video);
    this._removeBackgroundImage();
  }

  _removeBackgroundImage() {
	this.style.backgroundImage = '';
  }

  connectedCallback() {
	const src = this.getAttribute('src');
	const poster = this.getAttribute('poster');
    const placeholder = this.getAttribute('placeholder') || '▶️';
    this.innerHTML = `<div class="lazy-hls-player-container" loading="lazy" style="${poster ? '' : 'display: flex; align-items: center; justify-content: center;'}">
  ${poster ? `<div class="lazy-hls-player-bg" style="position:absolute; top:0; left:0; width:100%; height:100%; background-image:url('${poster}');"></div>` : ''}
  <div class="lazy-hls-player-icon">${placeholder}</div>
</div>`;
    
	const container = this.querySelector('.lazy-hls-player-container');
    this._clickHandler = () => {
      this._clickEvent(container, src);
      this.removeEventListener('click', this._clickHandler);
    };
    this.addEventListener('click', this._clickHandler);
  }
}

customElements.define('lazy-hls-player', LazyHlsPlayer);
