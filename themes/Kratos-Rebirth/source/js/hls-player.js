// hls播放器元件
document.addEventListener("DOMContentLoaded", function () {
  const players = document.querySelectorAll(".hls-player");
  if (players.length > 0 && Hls.isSupported()) {
    players.forEach(video => {
      const hls = new Hls();
      hls.loadSource(video.querySelector("source").src);
      hls.attachMedia(video);
    });
  }
});
