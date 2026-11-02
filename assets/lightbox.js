/* Click-to-enlarge for the screenshot rail on the game detail pages.
   Each .rail thumbnail is a normal <a href="full-size image">, so without JS (or without
   <dialog>) it simply opens the image. Markup is built here so pages stay short. */
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.rail a'));
  if (!links.length || typeof HTMLDialogElement === 'undefined') return;

  var dlg = document.createElement('dialog');
  dlg.className = 'lb';
  dlg.setAttribute('aria-label', 'Screenshot viewer');
  dlg.innerHTML =
    '<button class="lb-btn lb-close" type="button" aria-label="Close">&times;</button>' +
    '<button class="lb-btn lb-prev" type="button" aria-label="Previous screenshot">&#8249;</button>' +
    '<figure class="lb-fig"><img class="lb-img" alt=""><figcaption class="lb-cap"></figcaption></figure>' +
    '<button class="lb-btn lb-next" type="button" aria-label="Next screenshot">&#8250;</button>';
  document.body.appendChild(dlg);

  var img = dlg.querySelector('.lb-img');
  var cap = dlg.querySelector('.lb-cap');
  var current = 0;

  function show(i) {
    current = (i + links.length) % links.length;
    var a = links[current];
    var thumb = a.querySelector('img');
    img.src = a.href;
    img.alt = thumb ? thumb.alt : '';
    var fc = a.parentNode.querySelector('figcaption');
    cap.textContent = (fc ? fc.textContent + '  ·  ' : '') + (current + 1) + ' / ' + links.length;
    // warm the neighbours so arrows feel instant
    [current - 1, current + 1].forEach(function (n) {
      var p = new Image();
      p.src = links[(n + links.length) % links.length].href;
    });
  }

  links.forEach(function (a, i) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      show(i);
      dlg.showModal();
      document.documentElement.style.overflow = 'hidden';
    });
  });

  dlg.querySelector('.lb-close').addEventListener('click', function () { dlg.close(); });
  dlg.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
  dlg.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
  dlg.addEventListener('close', function () { document.documentElement.style.overflow = ''; });

  // The dialog fills the viewport, so a click on empty space targets the dialog itself.
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
  });

  var x0 = null;
  dlg.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();
