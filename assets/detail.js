/* Small behaviours shared by the game detail pages. */
(function () {
  // The first top link ("← Molfar Digital" on a Details page, "← <game>" on a legal page):
  // when the visitor came from the page it points to, go Back so the browser restores the
  // exact scroll position. Otherwise the link's own href is the fallback (e.g. /#<game>
  // lands on that game's chapter when the page was opened directly).
  var back = document.querySelector('.top a[href]');
  if (back) {
    back.addEventListener('click', function (e) {
      try {
        var ref = document.referrer ? new URL(document.referrer) : null;
        var target = new URL(back.href, location.href).pathname;
        var fromTarget = ref && ref.origin === location.origin &&
          (ref.pathname === target || (target === '/' && ref.pathname === '/index.html'));
        if (fromTarget && history.length > 1) {
          e.preventDefault();
          history.back();
        }
      } catch (err) { /* fall through to the normal link */ }
    });
  }

  // "Copy address" button in the Let's talk block (hidden when the clipboard API is missing).
  var copyBtn = document.querySelector('.copy');
  if (copyBtn) {
    if (!(navigator.clipboard && navigator.clipboard.writeText)) {
      copyBtn.hidden = true;
    } else {
      copyBtn.addEventListener('click', function () {
        navigator.clipboard.writeText(copyBtn.getAttribute('data-mail')).then(function () {
          copyBtn.textContent = 'Copied ✓';
          copyBtn.classList.add('done');
          setTimeout(function () { copyBtn.textContent = 'Copy address'; copyBtn.classList.remove('done'); }, 1800);
        });
      });
    }
  }

  // In-page links (Support) must not add history entries, or Back would stop at this page.
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = document.getElementById(a.getAttribute('href').slice(1));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + t.id);
    });
  });
})();
