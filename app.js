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
      '<input class="login-input" id="timeout-inp" type="text" placeholder="Type any of the passphrase from above…" autocomplete="off" spellcheck="false">' +
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
  'Napster you are the best',
  'Keep Learning',
  'Stay Motivated',
  'AI is my friend',
  'Thank you master'
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
      '<input class="login-input" id="login-inp" type="text" placeholder="Type any of the passphrase from above…" autocomplete="off" spellcheck="false">' +
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

/* ===== MCQ page ===== */
function initMCQ(deckId, cards) {
  var currentPos = 0;
  var activeDomain = null;
  var answered = false;
  var filteredIdx = [];
  var perf = loadPerf(deckId);

  var DOMAIN_LABELS = { D1:'Agentic Architecture', D2:'Tool Design & MCP', D3:'Claude Code Config', D4:'Prompt Engineering', D5:'Context & Reliability' };

  function rebuildIdx() {
    filteredIdx = cards.reduce(function(acc, c, i) {
      if (activeDomain && c.domain !== activeDomain) return acc;
      acc.push(i);
      return acc;
    }, []);
  }

  window.lottgDeck = {
    setDomain: function(domain) {
      activeDomain = domain || null;
      document.querySelectorAll('.domain-btn').forEach(function(b) {
        b.classList.toggle('active', b.getAttribute('data-domain') === (domain || 'all'));
      });
      rebuildIdx();
      updateMCQDomainStats();
      currentPos = 0;
      answered = false;
      showQuestion(0);
    }
  };

  /* DOM refs */
  var qnumEl    = document.getElementById('mcq-qnum');
  var dtagEl    = document.getElementById('mcq-domain-tag');
  var questionEl = document.getElementById('mcq-question');
  var optionsEl  = document.getElementById('mcq-options');
  var feedbackEl = document.getElementById('mcq-feedback');
  var resultEl   = document.getElementById('mcq-result');
  var nextBtn    = document.getElementById('mcq-next');
  var progFill   = document.getElementById('progress-fill');
  var progText   = document.getElementById('progress-text');

  function showQuestion(pos) {
    if (!filteredIdx.length) {
      if (questionEl) questionEl.textContent = 'No questions in this domain.';
      if (optionsEl) optionsEl.innerHTML = '';
      if (feedbackEl) feedbackEl.classList.add('hidden');
      if (nextBtn) nextBtn.classList.add('hidden');
      return;
    }
    currentPos = Math.max(0, Math.min(pos, filteredIdx.length - 1));
    var idx = filteredIdx[currentPos];
    var card = cards[idx];
    answered = false;

    if (feedbackEl) feedbackEl.classList.add('hidden');
    if (nextBtn) nextBtn.classList.add('hidden');

    if (qnumEl) qnumEl.textContent = 'Question ' + (currentPos + 1) + ' of ' + filteredIdx.length;
    if (dtagEl) dtagEl.textContent = card.domain + ' · ' + (DOMAIN_LABELS[card.domain] || card.domain);
    if (questionEl) questionEl.textContent = card.q;

    var letters = ['A', 'B', 'C', 'D'];
    if (optionsEl) {
      optionsEl.innerHTML = card.options.map(function(opt, i) {
        return '<button class="mcq-option" data-idx="' + i + '">'
          + '<span class="mcq-option-letter">' + letters[i] + '</span>'
          + '<span class="mcq-option-text">' + esc(opt) + '</span>'
          + '</button>';
      }).join('');
      optionsEl.querySelectorAll('.mcq-option').forEach(function(btn) {
        btn.addEventListener('click', function() {
          if (answered) return;
          selectOption(parseInt(btn.getAttribute('data-idx')));
        });
      });
    }
    updateMCQProgress();
  }

  function selectOption(selectedIdx) {
    answered = true;
    var idx = filteredIdx[currentPos];
    var card = cards[idx];
    var isCorrect = selectedIdx === card.correct;

    var p = perf[idx] || { correct: 0, total: 0 };
    p.total++;
    if (isCorrect) p.correct++;
    perf[idx] = p;
    savePerf(deckId, perf);

    var btns = optionsEl ? optionsEl.querySelectorAll('.mcq-option') : [];
    btns.forEach(function(btn, i) {
      btn.disabled = true;
      if (i === card.correct) btn.classList.add('correct');
      else if (i === selectedIdx && !isCorrect) btn.classList.add('wrong');
    });

    if (feedbackEl) feedbackEl.classList.remove('hidden');
    if (resultEl) {
      resultEl.textContent = isCorrect ? '✓ Correct!' : '✗ Incorrect — the correct answer is highlighted.';
      resultEl.className = 'mcq-result ' + (isCorrect ? 'correct' : 'wrong');
    }
    if (nextBtn) nextBtn.classList.remove('hidden');

    updateMCQDomainStats();
    updateMCQProgress();
  }

  function updateMCQProgress() {
    var total = filteredIdx.length;
    var pct = total > 0 ? Math.round(currentPos / total * 100) : 0;
    if (progFill) progFill.style.width = pct + '%';
    if (progText) progText.textContent = currentPos + ' / ' + total + ' done';
  }

  function updateMCQDomainStats() {
    var el = document.getElementById('domain-stats');
    if (!el) return;
    var domains = [];
    cards.forEach(function(c) { if (c.domain && domains.indexOf(c.domain) < 0) domains.push(c.domain); });
    domains.sort();
    el.innerHTML = domains.map(function(d) {
      var domIdx = cards.reduce(function(acc, c, i) { if (c.domain === d) acc.push(i); return acc; }, []);
      var totAtt = 0, totCorr = 0;
      domIdx.forEach(function(i) { if (perf[i]) { totAtt += perf[i].total; totCorr += perf[i].correct; } });
      var acc = totAtt ? Math.round(totCorr / totAtt * 100) : null;
      var pct = totAtt ? Math.min(100, Math.round(totAtt / domIdx.length * 100)) : 0;
      var barColor = acc === null ? 'var(--border)'
        : acc >= 80 ? 'linear-gradient(90deg,#43e97b,#38f9d7)'
        : acc >= 60 ? 'linear-gradient(90deg,#f7971e,#ffd200)'
        : 'linear-gradient(90deg,#f5576c,#f093fb)';
      return '<div class="domain-stat-item' + (activeDomain === d ? ' active-domain' : '') + '" onclick="window.lottgDeck.setDomain(\'' + d + '\')" style="cursor:pointer">'
        + '<span class="domain-stat-label">' + d + '</span>'
        + '<div class="domain-stat-bar-wrap"><div class="domain-stat-bar" style="width:' + pct + '%;background:' + barColor + '"></div></div>'
        + '<span class="domain-stat-nums">'
          + (acc !== null ? '<b style="color:' + (acc >= 80 ? 'var(--success)' : acc >= 60 ? 'var(--warning)' : 'var(--danger)') + '">' + acc + '%</b> · ' : '')
          + totAtt + '/' + domIdx.length + ' attempted'
        + '</span></div>';
    }).join('');
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      if (currentPos < filteredIdx.length - 1) {
        showQuestion(currentPos + 1);
      } else {
        /* session complete */
        var totAtt = filteredIdx.length;
        var totCorr = filteredIdx.reduce(function(s, i) { return s + (perf[i] && perf[i].total > 0 && perf[i].correct / perf[i].total >= 0.5 ? 1 : 0); }, 0);
        if (questionEl) questionEl.textContent = 'Session complete! You got ' + totCorr + ' of ' + totAtt + ' correct.';
        if (optionsEl) optionsEl.innerHTML = '';
        if (feedbackEl) feedbackEl.classList.add('hidden');
        if (nextBtn) nextBtn.classList.add('hidden');
        if (progFill) progFill.style.width = '100%';
        if (progText) progText.textContent = totAtt + ' / ' + totAtt + ' done';
        var restart = document.createElement('button');
        restart.className = 'mcq-restart';
        restart.textContent = '↺ Restart';
        restart.onclick = function() { window.lottgDeck.setDomain(activeDomain); };
        if (optionsEl) optionsEl.appendChild(restart);
      }
    });
  }

  /* keyboard: A/B/C/D to select, N / Enter for next */
  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    var map = { 'a':0,'b':1,'c':2,'d':3 };
    var key = e.key.toLowerCase();
    if (!answered && map[key] !== undefined) {
      selectOption(map[key]);
    } else if (answered && (e.key === 'n' || e.key === 'Enter' || e.key === 'ArrowRight')) {
      if (nextBtn && !nextBtn.classList.contains('hidden')) nextBtn.click();
    }
  });

  /* theme button */
  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀' : '☾';
    themeBtn.addEventListener('click', toggleTheme);
  }

  rebuildIdx();
  updateMCQDomainStats();
  showQuestion(0);
}

/* ===== Performance tracking ===== */
function loadPerf(deckId) {
  try { return JSON.parse(localStorage.getItem('lottg_perf_' + deckId)) || {}; }
  catch (e) { return {}; }
}
function savePerf(deckId, data) {
  localStorage.setItem('lottg_perf_' + deckId, JSON.stringify(data));
}

/* ===== Deck page ===== */
function initDeck(deckId, cards) {
  var currentPos = 0;
  var isFlipped = false;
  var filterQuery = '';
  var activeDomain = null; /* null = all domains */
  var known = loadKnown(deckId);
  var sr = loadSR(deckId);
  var perf = loadPerf(deckId);

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

  function rebuildFilteredIdx() {
    filteredIdx = cards.reduce(function (acc, c, i) {
      if (activeDomain && c.domain !== activeDomain) return acc;
      if (filterQuery && !c.q.toLowerCase().includes(filterQuery) && !c.a.toLowerCase().includes(filterQuery)) return acc;
      acc.push(i);
      return acc;
    }, []);
  }

  function getActiveIdx() {
    if (filterQuery) return filteredIdx; /* search: show even known */
    return filteredIdx.filter(function (i) { return !known.has(i); });
  }

  /* expose domain API for deck page */
  window.lottgDeck = {
    setDomain: function (domain) {
      activeDomain = domain || null;
      var btns = document.querySelectorAll('.domain-btn');
      btns.forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-domain') === (domain || 'all'));
      });
      rebuildFilteredIdx();
      updateDomainStats();
      showCard(0);
    }
  };

  function updateDomainStats() {
    var domainStatEl = document.getElementById('domain-stats');
    if (!domainStatEl) return;
    var td = todayStr();
    var domains = [];
    cards.forEach(function (c) { if (c.domain && domains.indexOf(c.domain) === -1) domains.push(c.domain); });
    domains.sort();
    if (!domains.length) { domainStatEl.innerHTML = ''; return; }
    var html = domains.map(function (d) {
      var domCards = cards.reduce(function (acc, c, i) { if (c.domain === d) acc.push(i); return acc; }, []);
      var knownCount = domCards.filter(function (i) { return known.has(i); }).length;
      var dueCount = domCards.filter(function (i) {
        if (known.has(i)) return false;
        var e = sr[i]; return !e || e.dueDate <= td;
      }).length;
      /* performance: correct / attempted */
      var totAttempted = 0, totCorrect = 0;
      domCards.forEach(function (i) {
        if (perf[i]) { totAttempted += perf[i].total; totCorrect += perf[i].correct; }
      });
      var accuracyPct = totAttempted ? Math.round(totCorrect / totAttempted * 100) : null;
      var progressPct = domCards.length ? Math.round(knownCount / domCards.length * 100) : 0;
      var barColor = accuracyPct === null ? 'var(--grad-progress)'
        : accuracyPct >= 80 ? 'linear-gradient(90deg,#43e97b,#38f9d7)'
        : accuracyPct >= 60 ? 'linear-gradient(90deg,#f7971e,#ffd200)'
        : 'linear-gradient(90deg,#f5576c,#f093fb)';
      var displayPct = accuracyPct !== null ? accuracyPct : progressPct;
      return '<div class="domain-stat-item' + (activeDomain === d ? ' active-domain' : '') + '" onclick="window.lottgDeck.setDomain(\'' + d + '\')" style="cursor:pointer">'
        + '<span class="domain-stat-label">' + d + '</span>'
        + '<div class="domain-stat-bar-wrap"><div class="domain-stat-bar" style="width:' + displayPct + '%;background:' + barColor + '"></div></div>'
        + '<span class="domain-stat-nums">'
          + (accuracyPct !== null
              ? '<b style="color:' + (accuracyPct >= 80 ? 'var(--success)' : accuracyPct >= 60 ? 'var(--warning)' : 'var(--danger)') + '">' + accuracyPct + '%</b> accuracy · '
              : '')
          + knownCount + '/' + domCards.length + ' known'
          + (dueCount ? ' · <b>' + dueCount + ' due</b>' : '')
        + '</span>'
        + '</div>';
    }).join('');
    domainStatEl.innerHTML = html;
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
    rebuildFilteredIdx();
    if (searchMsg) {
      if (!filterQuery) {
        searchMsg.textContent = '';
      } else {
        searchMsg.textContent = filteredIdx.length
          ? filteredIdx.length + ' card' + (filteredIdx.length !== 1 ? 's' : '') + ' matched'
          : 'No cards matched';
      }
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

    /* record performance for domain stats */
    var p = perf[idx] || { correct: 0, total: 0 };
    p.total++;
    if (rating !== 'again') p.correct++;
    perf[idx] = p;
    savePerf(deckId, perf);

    if (rating === 'again') {
      showToast('See again soon');
    } else {
      showToast('+' + interval + 'd' + (rating === 'easy' ? ' (easy!)' : ''));
      next();
    }
    updateHUD(currentPos + 1, getActiveIdx().length);
    updateDomainStats();
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
    updateDomainStats();
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
  rebuildFilteredIdx();
  updateDomainStats();
  showCard(0);
}
