/* ===== Session timeout (3 min inactivity) ===== */
var _timeoutId;
var TIMEOUT_MS = 3 * 60 * 1000; /* 3 minutes */

function resetInactivityTimer() {
  clearTimeout(_timeoutId);
  _timeoutId = setTimeout(function () {
    sessionStorage.removeItem('lottg_auth');
    showTimeoutOverlay();
  }, TIMEOUT_MS);
}

function showTimeoutOverlay() {
  var existing = document.getElementById('timeout-overlay');
  if (existing) return;
  var overlay = document.createElement('div');
  overlay.id = 'timeout-overlay';
  overlay.className = 'login-overlay';
  overlay.innerHTML =
    '<div class="login-box">' +
      '<div class="login-title">Still there?</div>' +
      '<div class="login-tagline" style="color:var(--text-muted)">You were inactive for 3 minutes.<br>Enter the passphrase to continue.</div>' +
      '<input class="login-input" id="timeout-inp" type="text" placeholder="Type the passphrase…" autocomplete="off" spellcheck="false">' +
      '<div class="login-err" id="timeout-err"></div>' +
      '<button class="login-submit" id="timeout-submit">Continue →</button>' +
    '</div>';
  document.body.appendChild(overlay);

  var inp = overlay.querySelector('#timeout-inp');
  var err = overlay.querySelector('#timeout-err');
  var btn = overlay.querySelector('#timeout-submit');
  setTimeout(function () { inp.focus(); }, 60);

  function tryResume() {
    var typed = inp.value.trim().toLowerCase();
    if (PASSPHRASES.some(function (p) { return typed === p.toLowerCase(); })) {
      sessionStorage.setItem('lottg_auth', '1');
      overlay.style.transition = 'opacity 0.25s';
      overlay.style.opacity = '0';
      setTimeout(function () { overlay.remove(); resetInactivityTimer(); }, 260);
    } else {
      inp.classList.remove('shake');
      void inp.offsetWidth;
      inp.classList.add('shake');
      err.textContent = 'Not quite — try again.';
      inp.select();
    }
  }
  btn.addEventListener('click', tryResume);
  inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryResume(); });
}

function startInactivityWatch() {
  ['mousemove','mousedown','keydown','touchstart','scroll','click'].forEach(function (ev) {
    document.addEventListener(ev, resetInactivityTimer, { passive: true });
  });
  resetInactivityTimer();
}

/* ===== Passphrases — add or remove entries freely, any will be accepted ===== */
var PASSPHRASES = [
  'Napster you are the best'
];

/* ===== Login ===== */
function initLogin(onSuccess) {
  if (sessionStorage.getItem('lottg_auth') === '1') { startInactivityWatch(); onSuccess && onSuccess(); return; }

  var overlay = document.createElement('div');
  overlay.className = 'login-overlay';
  overlay.innerHTML =
    '<div class="login-box">' +
      '<div class="login-title">Welcome</div>' +
      '<div class="login-tagline" id="login-tagline">' + PASSPHRASES[0] + '</div>' +
      '<input class="login-input" id="login-inp" type="text" placeholder="Type the passphrase…" autocomplete="off" spellcheck="false">' +
      '<div class="login-err" id="login-err"></div>' +
      '<button class="login-submit" id="login-submit">Continue →</button>' +
    '</div>';
  document.body.appendChild(overlay);

  var inp     = overlay.querySelector('#login-inp');
  var err     = overlay.querySelector('#login-err');
  var btn     = overlay.querySelector('#login-submit');
  var tagline = overlay.querySelector('#login-tagline');

  /* cycle passphrases on display */
  var phraseIdx = 0;
  var cycleTimer = PASSPHRASES.length > 1 ? setInterval(function () {
    tagline.classList.add('fade-out');
    setTimeout(function () {
      phraseIdx = (phraseIdx + 1) % PASSPHRASES.length;
      tagline.textContent = PASSPHRASES[phraseIdx];
      tagline.classList.remove('fade-out');
    }, 400);
  }, 2800) : null;

  setTimeout(function () { inp.focus(); }, 60);

  function cleanup() { if (cycleTimer) clearInterval(cycleTimer); }

  function tryLogin() {
    var typed = inp.value.trim().toLowerCase();
    var match = PASSPHRASES.some(function (p) { return typed === p.toLowerCase(); });
    if (match) {
      cleanup();
      sessionStorage.setItem('lottg_auth', '1');
      overlay.style.transition = 'opacity 0.25s';
      overlay.style.opacity = '0';
      setTimeout(function () { overlay.remove(); startInactivityWatch(); onSuccess && onSuccess(); }, 260);
    } else {
      inp.classList.remove('shake');
      void inp.offsetWidth;
      inp.classList.add('shake');
      err.textContent = 'Not quite — try again.';
      inp.select();
    }
  }

  btn.addEventListener('click', tryLogin);
  inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryLogin(); });
}

/* ===== Theme (runs immediately on parse to avoid flash) ===== */
(function () {
  var t = localStorage.getItem('lottg_theme') || 'light';
  document.documentElement.setAttribute('data-theme', t);
})();

function toggleTheme() {
  var cur = document.documentElement.getAttribute('data-theme');
  var next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('lottg_theme', next);
  var btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = next === 'dark' ? '☀' : '☾';
}

/* ===== Toast ===== */
var _toastTimer;
function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2000);
}

/* ===== Helpers ===== */
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateStr, n) {
  var d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ===== localStorage helpers ===== */
function loadKnown(deckId) {
  try { return new Set(JSON.parse(localStorage.getItem('lottg_known_' + deckId)) || []); }
  catch (e) { return new Set(); }
}
function saveKnown(deckId, set) {
  localStorage.setItem('lottg_known_' + deckId, JSON.stringify(Array.from(set)));
}

function loadSR(deckId) {
  try { return JSON.parse(localStorage.getItem('lottg_sr_' + deckId)) || {}; }
  catch (e) { return {}; }
}
function saveSR(deckId, data) {
  localStorage.setItem('lottg_sr_' + deckId, JSON.stringify(data));
}

/* ===== Due-today count ===== */
function dueTodayCount(deckId, totalCards) {
  var sr = loadSR(deckId);
  var known = loadKnown(deckId);
  var td = todayStr();
  var count = 0;
  for (var i = 0; i < totalCards; i++) {
    if (known.has(i)) continue;
    var entry = sr[i];
    if (!entry || entry.dueDate <= td) count++;
  }
  return count;
}

/* ===== Export / Import ===== */
function exportProgress() {
  var data = {};
  for (var i = 0; i < localStorage.length; i++) {
    var k = localStorage.key(i);
    if (k && k.startsWith('lottg_')) data[k] = localStorage.getItem(k);
  }
  var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'lottg-progress-' + todayStr() + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
  showToast('Progress exported!');
}

function importProgress(file) {
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function (e) {
    try {
      var data = JSON.parse(e.target.result);
      var count = 0;
      Object.keys(data).forEach(function (k) {
        if (k.startsWith('lottg_')) { localStorage.setItem(k, data[k]); count++; }
      });
      showToast('Imported ' + count + ' entries!');
      setTimeout(function () { location.reload(); }, 900);
    } catch (err) {
      showToast('Import failed — invalid file.');
    }
  };
  reader.readAsText(file);
}

/* ===== Home page ===== */
function initHome() {
  /* theme button */
  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀' : '☾';
    themeBtn.addEventListener('click', toggleTheme);
  }

  /* export / import */
  var exportBtn = document.getElementById('export-btn');
  if (exportBtn) exportBtn.addEventListener('click', exportProgress);
  var importInput = document.getElementById('import-input');
  if (importInput) importInput.addEventListener('change', function (e) { importProgress(e.target.files[0]); });

  /* due-today badges + card counts via SEARCH_INDEX */
  if (typeof SEARCH_INDEX !== 'undefined') {
    SEARCH_INDEX.forEach(function (deck) {
      var metaEl = document.getElementById('meta-' + deck.deckId);
      if (metaEl) metaEl.textContent = deck.cards.length + ' cards';

      var badge = document.getElementById('due-' + deck.deckId);
      if (!badge) return;
      var n = dueTodayCount(deck.deckId, deck.cards.length);
      if (n > 0) { badge.textContent = '⏰ ' + n + ' due'; badge.style.display = 'inline-flex'; }
    });
  }

  /* cross-deck search */
  var searchInput = document.getElementById('home-search');
  var searchResults = document.getElementById('search-results');
  if (searchInput && searchResults && typeof SEARCH_INDEX !== 'undefined') {
    searchInput.addEventListener('input', function () {
      var q = searchInput.value.trim().toLowerCase();
      if (!q) { searchResults.classList.remove('visible'); searchResults.innerHTML = ''; return; }

      var hits = [];
      SEARCH_INDEX.forEach(function (deck) {
        deck.cards.forEach(function (card) {
          if (card.q.toLowerCase().includes(q) || card.a.toLowerCase().includes(q)) {
            hits.push({ deck: deck, card: card });
          }
        });
      });

      if (!hits.length) {
        searchResults.innerHTML = '<div class="search-no-results">No cards matched.</div>';
      } else {
        searchResults.innerHTML = hits.slice(0, 30).map(function (h) {
          return '<div class="search-result-item" onclick="location.href=\'' + h.deck.deckId + '.html\'">'
            + '<div class="search-result-deck">' + esc(h.deck.deckTitle) + '</div>'
            + '<div class="search-result-q">' + esc(h.card.q) + '</div>'
            + '<div class="search-result-a">' + esc(h.card.a) + '</div>'
            + '</div>';
        }).join('');
      }
      searchResults.classList.add('visible');
    });

    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { searchInput.value = ''; searchResults.classList.remove('visible'); searchResults.innerHTML = ''; }
    });

    /* hide results on outside click */
    document.addEventListener('click', function (e) {
      if (!searchResults.contains(e.target) && e.target !== searchInput) {
        searchResults.classList.remove('visible');
      }
    });
  }
}

/* ===== Deck page ===== */
function initDeck(deckId, cards) {
  var currentPos = 0;    /* position within activeCards() */
  var isFlipped = false;
  var filterQuery = '';
  var known = loadKnown(deckId);
  var sr = loadSR(deckId);

  /* theme button */
  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀' : '☾';
    themeBtn.addEventListener('click', toggleTheme);
  }

  /* DOM refs */
  var cardInner  = document.getElementById('card-inner');
  var cardQ      = document.getElementById('card-q');
  var cardA      = document.getElementById('card-a');
  var cardPos    = document.getElementById('card-pos');
  var progFill   = document.getElementById('progress-fill');
  var progText   = document.getElementById('progress-text');
  var srControls = document.getElementById('sr-controls');
  var srKnownBtn = document.getElementById('sr-known');
  var searchInp  = document.getElementById('deck-search');
  var searchMsg  = document.getElementById('search-matches');
  var statKnown  = document.getElementById('stat-known');
  var statDue    = document.getElementById('stat-due');
  var statTotal  = document.getElementById('stat-total');

  /* filtered + visible indices */
  var filteredIdx = cards.map(function (_, i) { return i; });

  function getActiveIdx() {
    if (filterQuery) return filteredIdx; /* search: show even known */
    return filteredIdx.filter(function (i) { return !known.has(i); });
  }

  /* ---- render ---- */
  function showCard(pos) {
    var active = getActiveIdx();
    if (!active.length) {
      if (cardQ) cardQ.textContent = filterQuery ? 'No cards matched.' : 'All cards marked as known!';
      if (cardA) cardA.textContent = '';
      updateHUD(0, 0);
      setSRVisible(false);
      return;
    }
    currentPos = Math.max(0, Math.min(pos, active.length - 1));
    var idx = active[currentPos];
    isFlipped = false;
    if (cardInner) cardInner.classList.remove('flipped');
    if (cardQ) cardQ.textContent = cards[idx].q;
    if (cardA) cardA.textContent = cards[idx].a;
    setSRVisible(false);
    updateKnownBtn(idx);
    updateHUD(currentPos + 1, active.length);
  }

  function updateHUD(pos, total) {
    var td = todayStr();
    var dueCount = 0;
    for (var i = 0; i < cards.length; i++) {
      if (known.has(i)) continue;
      var e = sr[i];
      if (!e || e.dueDate <= td) dueCount++;
    }
    if (cardPos) cardPos.textContent = total ? 'Card ' + pos + ' of ' + total : 'No cards';
    var pct = total > 1 ? Math.round((pos - 1) / (total) * 100) : (pos > 0 ? 100 : 0);
    if (progFill) progFill.style.width = pct + '%';
    if (progText) progText.textContent = (pos - 1) + ' / ' + total;
    if (statKnown) statKnown.textContent = known.size;
    if (statDue) statDue.textContent = dueCount;
    if (statTotal) statTotal.textContent = cards.length;
  }

  function updateKnownBtn(idx) {
    if (!srKnownBtn) return;
    if (known.has(idx)) {
      srKnownBtn.textContent = '✓ Known';
      srKnownBtn.classList.add('is-known');
    } else {
      srKnownBtn.textContent = 'Mark Known';
      srKnownBtn.classList.remove('is-known');
    }
  }

  function setSRVisible(show) {
    if (!srControls) return;
    srControls.classList.toggle('hidden', !show);
  }

  /* ---- actions ---- */
  function flip() {
    isFlipped = !isFlipped;
    if (cardInner) cardInner.classList.toggle('flipped', isFlipped);
    setSRVisible(isFlipped);
  }

  function next() {
    var active = getActiveIdx();
    if (currentPos < active.length - 1) showCard(currentPos + 1);
  }

  function prev() {
    if (currentPos > 0) showCard(currentPos - 1);
  }

  function shuffle() {
    for (var i = filteredIdx.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = filteredIdx[i]; filteredIdx[i] = filteredIdx[j]; filteredIdx[j] = tmp;
    }
    showCard(0);
    showToast('Deck shuffled!');
  }

  function applyFilter(q) {
    filterQuery = q.toLowerCase().trim();
    if (!filterQuery) {
      filteredIdx = cards.map(function (_, i) { return i; });
      if (searchMsg) searchMsg.textContent = '';
    } else {
      filteredIdx = cards.reduce(function (acc, c, i) {
        if (c.q.toLowerCase().includes(filterQuery) || c.a.toLowerCase().includes(filterQuery)) acc.push(i);
        return acc;
      }, []);
      if (searchMsg) searchMsg.textContent = filteredIdx.length
        ? filteredIdx.length + ' card' + (filteredIdx.length !== 1 ? 's' : '') + ' matched'
        : 'No cards matched';
    }
    showCard(0);
  }

  /* SM-2 lite: rate the current card */
  function rateSR(rating) {
    var active = getActiveIdx();
    if (!active.length) return;
    var idx = active[currentPos];
    var entry = sr[idx] || { interval: 0, ease: 2.5 };

    var interval;
    if (rating === 'again') {
      interval = 0;
      entry.ease = Math.max(1.3, entry.ease - 0.2);
    } else if (rating === 'good') {
      interval = Math.max(1, Math.round((entry.interval || 1) * entry.ease));
      /* ease stays */
    } else { /* easy */
      interval = Math.max(4, Math.round((entry.interval || 1) * entry.ease * 1.3));
      entry.ease = Math.min(4, entry.ease + 0.1);
    }
    entry.interval = interval;
    entry.dueDate  = interval === 0 ? todayStr() : addDays(todayStr(), interval);
    sr[idx] = entry;
    saveSR(deckId, sr);

    if (rating === 'again') {
      showToast('See again soon');
    } else {
      showToast('+' + interval + 'd' + (rating === 'easy' ? ' (easy!)' : ''));
      next();
    }
    updateHUD(currentPos + 1, getActiveIdx().length);
  }

  function toggleKnown() {
    var active = getActiveIdx();
    if (!active.length) return;
    var idx = active[currentPos];
    if (known.has(idx)) {
      known.delete(idx);
      showToast('Removed from known');
    } else {
      known.add(idx);
      showToast('Marked as known ✓');
    }
    saveKnown(deckId, known);
    updateKnownBtn(idx);
    var newActive = getActiveIdx();
    showCard(Math.min(currentPos, Math.max(0, newActive.length - 1)));
  }

  /* ---- wire DOM ---- */
  if (cardInner) cardInner.addEventListener('click', flip);

  var prevBtn = document.getElementById('prev-btn');
  var nextBtn = document.getElementById('next-btn');
  var flipBtn = document.getElementById('flip-btn');
  var shuffleBtn = document.getElementById('shuffle-btn');
  var srAgain = document.getElementById('sr-again');
  var srGood  = document.getElementById('sr-good');
  var srEasy  = document.getElementById('sr-easy');

  if (prevBtn) prevBtn.addEventListener('click', function (e) { e.stopPropagation(); prev(); });
  if (nextBtn) nextBtn.addEventListener('click', function (e) { e.stopPropagation(); next(); });
  if (flipBtn) flipBtn.addEventListener('click', function (e) { e.stopPropagation(); flip(); });
  if (shuffleBtn) shuffleBtn.addEventListener('click', shuffle);
  if (srAgain) srAgain.addEventListener('click', function () { rateSR('again'); });
  if (srGood)  srGood.addEventListener('click',  function () { rateSR('good'); });
  if (srEasy)  srEasy.addEventListener('click',  function () { rateSR('easy'); });
  if (srKnownBtn) srKnownBtn.addEventListener('click', toggleKnown);

  if (searchInp) {
    searchInp.addEventListener('input', function () { applyFilter(searchInp.value); });
    searchInp.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { searchInp.value = ''; applyFilter(''); }
    });
  }

  /* keyboard shortcuts */
  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' || e.key === 'l') next();
    else if (e.key === 'ArrowLeft' || e.key === 'h') prev();
    else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); flip(); }
    else if (e.key === 's') shuffle();
    else if (e.key === 'k') toggleKnown();
    else if (e.key === '1') rateSR('again');
    else if (e.key === '2') rateSR('good');
    else if (e.key === '3') rateSR('easy');
  });

  /* initial render */
  showCard(0);
}
