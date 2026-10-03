window.ICONS = {
  terminal: '<img src="assets/terminal.svg" alt="" draggable="false">',
  quiz: '<img src="assets/app.svg" alt="" draggable="false">',
  image: '<img src="assets/image-x-generic.svg" alt="" draggable="false">',
  volume: '<img src="assets/audio.svg" alt="" draggable="false">',
  mute: '<span class="mute-icon"><img src="assets/audio.svg" alt="" draggable="false"></span>',
  brightness: '<span class="symbol-icon brightness-icon" aria-hidden="true">☼</span>',
  wifi: '<img src="assets/network-wireless-on.svg" alt="" draggable="false">',
  chevron: '<span class="symbol-icon" aria-hidden="true">⌃</span>'
};
window.loadIcons = (root = document) =>
  root.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = ICONS[el.dataset.icon] || ''; });
