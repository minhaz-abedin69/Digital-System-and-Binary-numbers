/**
 * quiz.js
 * Renders the full "Practice / Quiz" page: topic filter -> question flow -> score screen.
 * Fully self-contained; App.render() calls Quiz.render(containerEl) for the #/quiz route.
 */
window.Quiz = (function () {
  'use strict';

  let mode = 'intro';       // 'intro' | 'active' | 'finished'
  let selectedTopics = new Set(['all']);
  let questions = [];
  let qIndex = 0;
  let answers = [];          // { id, topicId, selectedIndex, correct }
  let answeredCurrent = false;
  let containerRef = null;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function topicShortTitle(topicId) {
    const t = COURSE_DATA.topics.find(x => x.id === topicId);
    return t ? t.shortTitle : topicId;
  }

  function renderIntro() {
    const chips = ['all', ...COURSE_DATA.topics.map(t => t.id)].map(id => {
      const label = id === 'all' ? 'All topics' : topicShortTitle(id);
      const active = selectedTopics.has(id);
      return `<button class="chip-toggle-btn${active ? ' is-active' : ''}" data-topic-chip="${id}" style="padding:.35rem .75rem;border-radius:999px;font-size:.78rem;font-weight:600;border:1px solid var(--ink-150);color:${active ? 'var(--accent-strong)' : 'var(--ink-700)'};background:${active ? 'var(--accent-tint)' : 'var(--surface)'};">${DLUtils.escapeHtml(label)}</button>`;
    }).join('');
    containerRef.innerHTML = `
      ${App.formatInline ? '' : ''}
      <nav class="breadcrumb"><a href="#/">Home</a><span class="breadcrumb__sep">/</span><span class="breadcrumb__current">Practice / Quiz</span></nav>
      <div class="topic-header"><div>${ICONS.quiz}</div><div><h1>Practice / Quiz</h1></div></div>
      <p class="topic-dek">${QUIZ_DATA.length} multiple-choice questions covering every topic in the chapter. Pick a scope, then work through the questions one at a time with instant feedback.</p>
      <div class="quiz-intro">
        <div class="quiz-intro__icon">${ICONS.quiz}</div>
        <h2>Ready when you are</h2>
        <p>Choose which topics to be quizzed on, or leave "All topics" selected for the full chapter review.</p>
        <div class="quiz-filter" id="quiz-filter-chips">${chips}</div>
        <button class="btn btn--primary" id="quiz-start-btn">${ICONS.arrowRight} Start Quiz</button>
      </div>`;

    containerRef.querySelectorAll('[data-topic-chip]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-topic-chip');
        if (id === 'all') { selectedTopics = new Set(['all']); }
        else {
          selectedTopics.delete('all');
          if (selectedTopics.has(id)) selectedTopics.delete(id); else selectedTopics.add(id);
          if (selectedTopics.size === 0) selectedTopics = new Set(['all']);
        }
        renderIntro();
      });
    });
    containerRef.querySelector('#quiz-start-btn').addEventListener('click', startQuiz);
  }

  function startQuiz() {
    const pool = selectedTopics.has('all') ? QUIZ_DATA : QUIZ_DATA.filter(q => selectedTopics.has(q.topicId));
    questions = shuffle(pool.length ? pool : QUIZ_DATA);
    qIndex = 0; answers = []; answeredCurrent = false; mode = 'active';
    renderActive();
  }

  function renderActive() {
    const q = questions[qIndex];
    const pct = Math.round((qIndex / questions.length) * 100);
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    containerRef.innerHTML = `
      <nav class="breadcrumb"><a href="#/">Home</a><span class="breadcrumb__sep">/</span><span class="breadcrumb__current">Practice / Quiz</span></nav>
      <div class="quiz-progress-row">
        <div class="quiz-progress-row__label">Question ${qIndex + 1} / ${questions.length}</div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
        <button class="btn btn--ghost btn--sm" id="quiz-quit-btn">${ICONS.x} Exit</button>
      </div>
      <div class="quiz-card">
        <div class="quiz-card__topic">${DLUtils.escapeHtml(topicShortTitle(q.topicId))}</div>
        <div class="quiz-card__question">${App.formatInline(q.question)}</div>
        <div class="quiz-options" id="quiz-options">
          ${q.options.map((opt, i) => `<button class="quiz-option" data-idx="${i}"><span class="quiz-option__letter">${letters[i]}</span><span>${App.formatInline(opt)}</span></button>`).join('')}
        </div>
        <div id="quiz-explanation-slot"></div>
        <div class="quiz-footer">
          <span class="tool-note" style="margin:0;">${answeredCurrent ? '' : 'Select an answer to see the explanation.'}</span>
          <button class="btn btn--primary" id="quiz-next-btn" style="display:none;">${qIndex === questions.length - 1 ? 'See score' : 'Next question'} ${ICONS.arrowRight}</button>
        </div>
      </div>`;

    containerRef.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => selectAnswer(parseInt(btn.getAttribute('data-idx'), 10)));
    });
    containerRef.querySelector('#quiz-next-btn').addEventListener('click', nextQuestion);
    containerRef.querySelector('#quiz-quit-btn').addEventListener('click', () => { mode = 'intro'; renderIntro(); });
  }

  function selectAnswer(idx) {
    if (answeredCurrent) return;
    answeredCurrent = true;
    const q = questions[qIndex];
    const correct = idx === q.correctIndex;
    answers.push({ id: q.id, topicId: q.topicId, selectedIndex: idx, correct });

    containerRef.querySelectorAll('.quiz-option').forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.correctIndex) btn.classList.add('is-correct');
      else if (i === idx) btn.classList.add('is-incorrect');
    });

    const slot = containerRef.querySelector('#quiz-explanation-slot');
    slot.innerHTML = `<div class="quiz-explanation">
      <div class="quiz-explanation__verdict ${correct ? 'quiz-explanation__verdict--correct' : 'quiz-explanation__verdict--incorrect'}">${correct ? 'Correct!' : 'Not quite.'}</div>
      <div>${App.formatInline(q.explanation)}</div>
    </div>`;
    containerRef.querySelector('.quiz-footer .tool-note').textContent = '';
    containerRef.querySelector('#quiz-next-btn').style.display = 'inline-flex';
  }

  function nextQuestion() {
    if (qIndex < questions.length - 1) { qIndex++; answeredCurrent = false; renderActive(); }
    else { mode = 'finished'; renderScore(); }
  }

  function renderScore() {
    const total = answers.length;
    const correctCount = answers.filter(a => a.correct).length;
    const pct = total ? Math.round((correctCount / total) * 100) : 0;
    const circumference = 2 * Math.PI * 54;
    const dash = circumference * (pct / 100);

    const byTopic = {};
    answers.forEach(a => {
      byTopic[a.topicId] = byTopic[a.topicId] || { correct: 0, total: 0 };
      byTopic[a.topicId].total++;
      if (a.correct) byTopic[a.topicId].correct++;
    });
    const breakdown = Object.keys(byTopic).map(topicId => {
      const b = byTopic[topicId];
      const p = Math.round((b.correct / b.total) * 100);
      return `<div class="quiz-topic-breakdown__row"><span>${DLUtils.escapeHtml(topicShortTitle(topicId))}</span><div class="progress-bar"><div class="progress-fill" style="width:${p}%"></div></div><span>${b.correct}/${b.total}</span></div>`;
    }).join('');

    let verdict = 'Nice review!';
    if (pct === 100) verdict = 'Perfect score!';
    else if (pct >= 80) verdict = 'Great work!';
    else if (pct < 50) verdict = 'Worth another pass.';

    containerRef.innerHTML = `
      <nav class="breadcrumb"><a href="#/">Home</a><span class="breadcrumb__sep">/</span><span class="breadcrumb__current">Practice / Quiz</span></nav>
      <div class="quiz-score-screen">
        <div class="quiz-score-screen__ring">
          <svg width="130" height="130" viewBox="0 0 130 130">
            <circle cx="65" cy="65" r="54" fill="none" stroke="var(--ink-100)" stroke-width="10"/>
            <circle cx="65" cy="65" r="54" fill="none" stroke="var(--accent)" stroke-width="10" stroke-linecap="round"
              stroke-dasharray="${circumference}" stroke-dashoffset="${circumference - dash}" transform="rotate(-90 65 65)"/>
          </svg>
          <div class="quiz-score-screen__value">${pct}%</div>
        </div>
        <h2>${verdict}</h2>
        <p>You got ${correctCount} out of ${total} questions right.</p>
        <div class="quiz-score-actions">
          <button class="btn btn--primary" id="quiz-retry-btn">${ICONS.refresh} Retake Quiz</button>
          <a href="#/" class="btn btn--secondary">${ICONS.home} Back to Home</a>
        </div>
        ${breakdown ? `<div class="quiz-topic-breakdown">${breakdown}</div>` : ''}
      </div>`;

    containerRef.querySelector('#quiz-retry-btn').addEventListener('click', () => { mode = 'intro'; renderIntro(); });
  }

  function render(container) {
    containerRef = container;
    mode = 'intro';
    renderIntro();
  }

  return { render };
})();
