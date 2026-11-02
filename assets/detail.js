/* Small behaviours shared by the game detail pages. */
(function () {
  // "← Molfar Digital": when the visitor came from the homepage, go Back so the browser
  // restores the exact scroll position. The link's own href (/#<game>) is the fallback and
  // lands on that game's chapter when the page was opened directly.
  var back = document.querySelector('.top a[href]');
  if (back) {
    back.addEventListener('click', function (e) {
      try {
        var ref = document.referrer ? new URL(document.referrer) : null;
        var fromHome = ref && ref.origin === location.origin && (ref.pathname === '/' || ref.pathname === '/index.html');
        if (fromHome && history.length > 1) {
          e.preventDefault();
          history.back();
        }
      } catch (err) { /* fall through to the normal link */ }
    });
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
