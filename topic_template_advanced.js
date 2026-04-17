// Advanced template engine for pattern-based topic pages (Array Patterns, String Patterns)
// Extends the basic template with category grouping support
// Each topic page defines: TOPIC_KEY, QUESTIONS[], MUST_DO[], MISTAKES[], KEY_PATTERNS[]
// QUESTIONS have an additional 'category' field for sub-pattern grouping

function renderAdvancedTopicPage() {
  const saved = JSON.parse(localStorage.getItem('logic50_' + TOPIC_KEY) || '{}');

  // Stats
  function updateStats() {
    const s = JSON.parse(localStorage.getItem('logic50_' + TOPIC_KEY) || '{}');
    const done = Object.values(s).filter(v => v === true).length;
    document.getElementById('doneCount').textContent = done;
    document.getElementById('pctCount').textContent = Math.round((done / QUESTIONS.length) * 100) + '%';
    document.getElementById('progressFill').style.width = Math.round((done / QUESTIONS.length) * 100) + '%';
    document.getElementById('totalCount').textContent = QUESTIONS.length;
  }

  // Render questions with category dividers
  const qContainer = document.getElementById('questionsContainer');
  let html = '';
  let lastCategory = '';
  QUESTIONS.forEach((q, i) => {
    const num = i + 1;
    const checked = saved[num] === true;
    const diffClass = q.difficulty === 'Easy' ? 'easy' : q.difficulty === 'Medium' ? 'moderate' : q.difficulty === 'Hard' ? 'hard' : 'easy';

    // Category divider
    if (q.category && q.category !== lastCategory) {
      lastCategory = q.category;
      html += `<div class="category-divider">
        <div class="cat-icon">${q.catIcon || '🔹'}</div>
        <div class="cat-info">
          <div class="cat-name">${q.category}</div>
          ${q.catDesc ? `<div class="cat-desc">${q.catDesc}</div>` : ''}
        </div>
      </div>`;
    }

    html += `
    <div class="q-card ${checked ? 'done' : ''}" id="qcard-${num}" data-cat="${q.category || ''}">
      <div class="q-header" onclick="toggleExpand(${num})">
        <div class="q-left">
          <label class="cb-wrap" onclick="event.stopPropagation()">
            <input type="checkbox" ${checked ? 'checked' : ''} onchange="toggleDone(${num}, this.checked)">
            <span class="cb-custom"></span>
          </label>
          <span class="q-num">#${num}</span>
          <span class="q-title">${q.title}</span>
        </div>
        <div class="q-right">
          ${q.leetcode ? `<a href="${q.leetcode}" target="_blank" class="lc-badge" onclick="event.stopPropagation()" title="View on LeetCode">LC</a>` : ''}
          <span class="diff ${diffClass}">${q.difficulty}</span>
          <span class="expand-icon" id="icon-${num}">▾</span>
        </div>
      </div>
      <div class="q-body" id="body-${num}">
        <div class="q-section">
          <div class="q-label">📋 Problem Statement</div>
          <div class="q-text">${q.problem}</div>
        </div>
        <div class="q-row">
          <div class="q-section q-half">
            <div class="q-label">📥 Example Input</div>
            <pre class="q-code">${q.inputEx}</pre>
          </div>
          <div class="q-section q-half">
            <div class="q-label">📤 Example Output</div>
            <pre class="q-code">${q.outputEx}</pre>
          </div>
        </div>
        <div class="q-section">
          <div class="q-label">📏 Constraints</div>
          <div class="q-text constraint">${q.constraints}</div>
        </div>
        <div class="q-section">
          <div class="q-label">🏷️ Pattern</div>
          <div class="q-text pattern-tag">${q.category || 'General'}</div>
        </div>
        <div class="q-section hint-section">
          <div class="q-label" onclick="toggleHint(${num})" style="cursor:pointer">💡 Hint <span class="reveal-tag" id="htag-${num}">Click to reveal</span></div>
          <div class="q-text hint-text" id="hint-${num}" style="display:none">${q.hint}</div>
        </div>
        <div class="q-section approach-section">
          <div class="q-label" onclick="toggleApproach(${num})" style="cursor:pointer">🧠 Approach <span class="reveal-tag" id="atag-${num}">Click to reveal</span></div>
          <div class="q-text approach-text" id="approach-${num}" style="display:none">${q.approach}</div>
        </div>
      </div>
    </div>`;
  });
  qContainer.innerHTML = html;

  // Must-Do
  const mdContainer = document.getElementById('mustDoList');
  let mdHtml = '';
  MUST_DO.forEach((m, i) => {
    mdHtml += `<div class="md-item"><span class="md-num">${i + 1}</span><span class="md-text">${m}</span></div>`;
  });
  mdContainer.innerHTML = mdHtml;

  // Mistakes
  const mkContainer = document.getElementById('mistakesList');
  let mkHtml = '';
  MISTAKES.forEach(m => {
    mkHtml += `<div class="mk-item"><span class="mk-icon">⚠️</span><span class="mk-text">${m}</span></div>`;
  });
  mkContainer.innerHTML = mkHtml;

  // Patterns
  const ptContainer = document.getElementById('patternsList');
  let ptHtml = '';
  KEY_PATTERNS.forEach(p => {
    ptHtml += `<div class="pt-item"><span class="pt-icon">🔑</span><span class="pt-text">${p}</span></div>`;
  });
  ptContainer.innerHTML = ptHtml;

  updateStats();

  // Search
  document.getElementById('searchBox').addEventListener('input', function() {
    const val = this.value.toLowerCase();
    QUESTIONS.forEach((q, i) => {
      const card = document.getElementById('qcard-' + (i + 1));
      if (!card) return;
      const match = q.title.toLowerCase().includes(val) || q.problem.toLowerCase().includes(val) || (q.category || '').toLowerCase().includes(val);
      card.style.display = match ? '' : 'none';
    });
    // Hide/show category dividers based on whether any cards in that category are visible
    document.querySelectorAll('.category-divider').forEach(div => {
      let next = div.nextElementSibling;
      let hasVisible = false;
      while (next && !next.classList.contains('category-divider')) {
        if (next.classList.contains('q-card') && next.style.display !== 'none') hasVisible = true;
        next = next.nextElementSibling;
      }
      div.style.display = hasVisible ? '' : 'none';
    });
  });

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.filter;
      const s = JSON.parse(localStorage.getItem('logic50_' + TOPIC_KEY) || '{}');
      QUESTIONS.forEach((q, i) => {
        const card = document.getElementById('qcard-' + (i + 1));
        if (!card) return;
        if (filter === 'all') { card.style.display = ''; return; }
        if (filter === 'done') { card.style.display = s[i + 1] ? '' : 'none'; return; }
        if (filter === 'todo') { card.style.display = !s[i + 1] ? '' : 'none'; return; }
        // Category filters
        if (card.dataset.cat && card.dataset.cat.toLowerCase().includes(filter.toLowerCase())) {
          card.style.display = '';
        } else if (filter !== 'all' && filter !== 'done' && filter !== 'todo') {
          card.style.display = 'none';
        }
      });
      // Update category divider visibility
      document.querySelectorAll('.category-divider').forEach(div => {
        let next = div.nextElementSibling;
        let hasVisible = false;
        while (next && !next.classList.contains('category-divider')) {
          if (next.classList.contains('q-card') && next.style.display !== 'none') hasVisible = true;
          next = next.nextElementSibling;
        }
        div.style.display = hasVisible ? '' : 'none';
      });
    });
  });

  window.updateStats = updateStats;
}

function toggleDone(num, checked) {
  const saved = JSON.parse(localStorage.getItem('logic50_' + TOPIC_KEY) || '{}');
  if (checked) saved[num] = true; else delete saved[num];
  localStorage.setItem('logic50_' + TOPIC_KEY, JSON.stringify(saved));
  const card = document.getElementById('qcard-' + num);
  if (card) card.classList.toggle('done', checked);
  window.updateStats();
}

function toggleExpand(num) {
  const body = document.getElementById('body-' + num);
  const icon = document.getElementById('icon-' + num);
  if (body.classList.contains('open')) {
    body.classList.remove('open');
    icon.textContent = '▾';
  } else {
    body.classList.add('open');
    icon.textContent = '▴';
  }
}

function toggleHint(num) {
  const el = document.getElementById('hint-' + num);
  const tag = document.getElementById('htag-' + num);
  if (el.style.display === 'none') { el.style.display = 'block'; tag.textContent = '▲ Hide'; }
  else { el.style.display = 'none'; tag.textContent = 'Click to reveal'; }
}

function toggleApproach(num) {
  const el = document.getElementById('approach-' + num);
  const tag = document.getElementById('atag-' + num);
  if (el.style.display === 'none') { el.style.display = 'block'; tag.textContent = '▲ Hide'; }
  else { el.style.display = 'none'; tag.textContent = 'Click to reveal'; }
}

document.addEventListener('DOMContentLoaded', renderAdvancedTopicPage);
