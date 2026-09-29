/*!
 * GroundTruth Tariff Calculator — embeddable widget loader
 * Usage:
 *   <div id="gt-tariff-widget"></div>
 *   <script src="https://contentforge-press.github.io/groundtruth-calculator/widget.js" async></script>
 * Free to embed with the visible attribution kept intact.
 */
(function () {
  'use strict';
  var me = document.currentScript;
  if (!me) return;

  // derive base dir from this script's own URL
  var src = me.src;
  var dir = src.slice(0, src.lastIndexOf('/') + 1);
  var origin = new URL(dir).origin;

  var API_HOME = 'https://dytsk9wrfv.page.coze.site/groundtruth.html';

  // choose mount point
  var mount = document.getElementById('gt-tariff-widget');
  var inserted = false;
  if (!mount) {
    mount = document.createElement('div');
    mount.id = 'gt-tariff-widget';
    me.parentNode.insertBefore(mount, me.nextSibling);
    inserted = true;
  }

  var width = me.getAttribute('data-width') || '100%';

  var frame = document.createElement('iframe');
  frame.setAttribute('src', dir + 'embed-calc.html');
  frame.setAttribute('title', 'US Import Tariff Calculator by GroundTruth');
  frame.style.width = width;
  frame.style.maxWidth = '100%';
  frame.style.border = '0';
  frame.style.overflow = 'hidden';
  frame.style.minHeight = '360px';
  frame.setAttribute('loading', 'lazy');

  // Visible, dofollow attribution rendered on the HOST page (carries SEO value,
  // unlike a link inside the iframe). Keep this when embedding.
  var attr = document.createElement('p');
  attr.className = 'gt-tariff-attribution';
  attr.style.cssText = 'margin:6px 0 0;font:12px/1.4 -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#64748b;text-align:center';
  var link = document.createElement('a');
  link.setAttribute('href', API_HOME);
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener');
  link.textContent = 'US import duty calculator by GroundTruth';
  link.style.cssText = 'color:#0d9488;text-decoration:none;font-weight:600';
  attr.appendChild(link);

  mount.appendChild(frame);
  mount.appendChild(attr);

  // auto-height, only accepting messages from our own widget origin
  window.addEventListener('message', function (e) {
    if (e.origin !== origin) return;
    if (!e.data || e.data.type !== 'gt-resize') return;
    var h = parseInt(e.data.height, 10);
    if (h > 0) frame.style.height = h + 'px';
  });
})();
