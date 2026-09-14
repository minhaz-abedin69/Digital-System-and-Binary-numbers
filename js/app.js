/**
 * app.js
 * Router, shell, and content-block renderer for the course site.
 * Depends on: utils.js, data.js, quizData.js, progress.js, search.js, quiz.js, js/tools/*.js
 */

const ICONS = {
  chip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="7" width="10" height="10" rx="1.5"/><line x1="9" y1="2" x2="9" y2="7"/><line x1="15" y1="2" x2="15" y2="7"/><line x1="9" y1="17" x2="9" y2="22"/><line x1="15" y1="17" x2="15" y2="22"/><line x1="2" y1="9" x2="7" y2="9"/><line x1="2" y1="15" x2="7" y2="15"/><line x1="17" y1="9" x2="22" y2="9"/><line x1="17" y1="15" x2="22" y2="15"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>',
  swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h14l-3.5-3.5"/><path d="M20 16H6l3.5 3.5"/></svg>',
  flip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 21l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
  plusMinus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="11" y2="12"/><line x1="8" y1="9" x2="8" y2="15"/><line x1="15" y1="12" x2="21" y2="12"/></svg>',
  hash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="9" x2="21" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="7" y2="21"/><line x1="17" y1="3" x2="14" y2="21"/></svg>',
  text: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z"/></svg>',
  shieldCheck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z"/><polyline points="9 12 11 14 15 9.5"/></svg>',
  gray: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>',
  toggle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="5"/><circle cx="8" cy="12" r="3.2"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.3" y2="16.3"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4.2"/><line x1="12" y1="19.8" x2="12" y2="22"/><line x1="2" y1="12" x2="4.2" y2="12"/><line x1="19.8" y1="12" x2="22" y2="12"/><line x1="4.8" y1="4.8" x2="6.3" y2="6.3"/><line x1="17.7" y1="17.7" x2="19.2" y2="19.2"/><line x1="4.8" y1="19.2" x2="6.3" y2="17.7"/><line x1="17.7" y1="6.3" x2="19.2" y2="4.8"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9.5 20v-6h5v6"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/></svg>',
  wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 1 0-5.4 5.4l-6.6 6.6 2.7 2.7 6.6-6.6a4 4 0 0 0 5.4-5.4l-3 3-2.7-2.7z"/></svg>',
  quiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="12" height="17" rx="1.5"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><polyline points="9 13 11 15 15 10.5"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 12 9 17 20 6"/></svg>',
  checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="8 12.5 11 15.5 16 9"/></svg>',
  chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14 5 8 12 14 19"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="10 5 16 12 10 19"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16.5"/><circle cx="12" cy="7.6" r="0.9" fill="currentColor" stroke="none"/></svg>',
  lightbulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a6 6 0 0 0-4 10.5c.7.7 1 1.2 1 2.5h6c0-1.3.3-1.8 1-2.5A6 6 0 0 0 12 2z"/></svg>',
  warningTriangle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l10 18H2z"/><line x1="12" y1="9.5" x2="12" y2="14"/><circle cx="12" cy="17.2" r="0.9" fill="currentColor" stroke="none"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8v6a4 4 0 0 1-8 0V3z"/><path d="M8 5H4a3 3 0 0 0 4 4"/><path d="M16 5h4a3 3 0 0 1-4 4"/><line x1="12" y1="13" x2="12" y2="17"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 15l6-6"/><path d="M11 5l1.5-1.5a3.5 3.5 0 0 1 5 5L16 10"/><path d="M13 19l-1.5 1.5a3.5 3.5 0 0 1-5-5L8 14"/></svg>',
  flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3v18"/><path d="M5 4h13l-3 4 3 4H5"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 5a2 2 0 1 1-4-.02 2 2 0 0 1 4 .02zM7 8.48H3.02V21H7zM13.32 8.48H9.53V21h3.79v-6.57c0-1.74.33-3.42 2.48-3.42 2.12 0 2.15 1.98 2.15 3.53V21H21.7v-7.18c0-3.6-.78-6.37-4.98-6.37-2.02 0-3.38 1.11-3.94 2.16h-.05V8.48z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.5-7 8-7s8 3 8 7"/></svg>',
  clipboardQ: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="12" height="17" rx="1.5"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><path d="M10.5 11.2a1.5 1.5 0 1 1 2.1 1.4c-.7.35-1.1.7-1.1 1.4"/><circle cx="12" cy="16.6" r="0.15" fill="currentColor" stroke-width="2.4"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>'
};

const App = (function () {
  'use strict';

  let state = { route: { page: 'home' } };

  /* ---------- text helpers ---------- */
  function formatInline(text) {
    if (text === undefined || text === null) return '';
    let out = DLUtils.escapeHtml(String(text));
    out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
    return out;
  }
  function slugify(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  /* ---------- block renderers ---------- */
  function renderTable(block) {
    const cells = block.rows.flat();
    const avg = cells.reduce((s, c) => s + String(c).length, 0) / (cells.length || 1);
    const max = cells.reduce((m, c) => Math.max(m, String(c).length), 0);
    const dense = avg <= 9 && max <= 14;
    const headerRow = block.headers.map(h => `<th>${formatInline(h)}</th>`).join('');
    const bodyRows = block.rows.map(row => `<tr>${row.map(cell => `<td>${formatInline(cell)}</td>`).join('')}</tr>`).join('');
    return `<div class="block">
      ${block.caption ? `<div class="table-caption">${formatInline(block.caption)}</div>` : ''}
      <div class="table-wrap"><table class="data-table${dense ? ' data-table--dense' : ''}"><thead><tr>${headerRow}</tr></thead><tbody>${bodyRows}</tbody></table></div>
    </div>`;
  }

  function renderExample(block) {
    const steps = (block.steps || []).map((s, i) => `
      <div class="example-step">
        <div class="example-step__num">${i + 1}</div>
        <div><div class="example-step__label">${formatInline(s.label)}</div><div class="example-step__detail">${formatInline(s.detail)}</div></div>
      </div>`).join('');
    return `<div class="block example-box">
      <div class="example-box__header"><span class="example-box__label">Worked Example</span><span class="example-box__title">${formatInline(block.title)}</span></div>
      ${block.given ? `<div class="example-box__given">${formatInline(block.given)}</div>` : ''}
      <div class="example-box__steps">${steps}</div>
      ${block.answer ? `<div class="example-box__answer">${formatInline(block.answer)}</div>` : ''}
      ${block.note ? `<div class="example-box__note">${formatInline(block.note)}</div>` : ''}
    </div>`;
  }

  function renderPractice(block, ctx) {
    const items = block.items.map((it, i) => {
      const uid = `${ctx.topicId}-practice-${ctx.blockIndex}-${i}`;
      return `<div class="practice-item">
        <div class="practice-item__q">${i + 1}. ${formatInline(it.q)}</div>
        <div class="practice-item__actions">
          ${it.hint ? `<button class="btn btn--secondary btn--sm" data-reveal="${uid}-hint">Show hint</button>` : ''}
          <button class="btn btn--primary btn--sm" data-reveal="${uid}-answer">Show answer</button>
        </div>
        ${it.hint ? `<div class="practice-item__reveal practice-item__reveal--hint" id="${uid}-hint"><strong>Hint:</strong> ${formatInline(it.hint)}</div>` : ''}
        <div class="practice-item__reveal practice-item__reveal--answer" id="${uid}-answer"><strong>Answer:</strong> ${formatInline(it.answer)}</div>
      </div>`;
    }).join('');
    return `<div class="block practice-box"><div class="practice-box__header">${ICONS.flag}Practice Questions</div>${items}</div>`;
  }

  function renderToolBlock(block, ctx) {
    const mountId = `tool-mount-${block.toolId}-${ctx.blockIndex}`;
    ctx.toolMounts.push({ toolId: block.toolId, mode: block.mode, elId: mountId });
    return `<div class="block tool-panel" id="tool-${block.toolId}${block.mode ? '-' + block.mode : ''}">
      <div class="tool-panel__header">
        <div class="tool-panel__badge">${ICONS.wrench}Interactive Tool</div>
        <div class="tool-panel__title">${formatInline(block.title)}</div>
        <div class="tool-panel__desc">${formatInline(block.description)}</div>
      </div>
      <div class="tool-panel__body" id="${mountId}"></div>
    </div>`;
  }

  function renderBlock(block, ctx) {
    switch (block.type) {
      case 'lead': return `<p class="block block-lead">${formatInline(block.text)}</p>`;
      case 'p': return `<p class="block block-p">${formatInline(block.text)}</p>`;
      case 'heading': {
        const level = block.level || 2;
        const id = block.id || slugify(block.text);
        const href = ctx.anchorBase ? `#/${ctx.anchorBase}/${id}` : `#/topic/${ctx.topicId}/${id}`;
        return `<div class="block-heading" id="${id}"><h${level}>${formatInline(block.text)}</h${level}><a href="${href}" class="block-heading__anchor" aria-label="Link to this section">${ICONS.link}</a></div>`;
      }
      case 'list': {
        const tag = block.ordered ? 'ol' : 'ul';
        const cls = 'block block-list' + (block.ordered ? ' block-list--ordered' : '');
        const items = block.items.map((it, i) => `<li><span class="li-marker">${block.ordered ? (i + 1) + '.' : ''}</span><span>${formatInline(it)}</span></li>`).join('');
        return `<${tag} class="${cls}">${items}</${tag}>`;
      }
      case 'definition':
        return `<div class="block definition-box"><div class="definition-box__term">${formatInline(block.term)}</div><div class="definition-box__text">${formatInline(block.text)}</div></div>`;
      case 'note': {
        const variant = block.variant || 'info';
        const iconMap = { info: 'info', tip: 'lightbulb', warning: 'warningTriangle', success: 'checkCircle' };
        return `<div class="block note-box note-box--${variant}">${ICONS[iconMap[variant]]}<div><div class="note-box__title">${formatInline(block.title)}</div><div class="note-box__text">${formatInline(block.text)}</div></div></div>`;
      }
      case 'table': return renderTable(block);
      case 'example': return renderExample(block);
      case 'formula':
        return `<div class="block formula-box"><div class="formula-box__text">${formatInline(block.text)}</div>${block.note ? `<div class="formula-box__note">${formatInline(block.note)}</div>` : ''}</div>`;
      case 'keypoints':
        return `<div class="block keypoints-box"><div class="kp-header">${ICONS.checkCircle}Key Points</div><ul class="kp-list">${block.items.map(it => `<li>${formatInline(it)}</li>`).join('')}</ul></div>`;
      case 'mistakes':
        return `<div class="block mistakes-box"><div class="kp-header">${ICONS.warningTriangle}Common Mistakes</div><ul class="kp-list">${block.items.map(it => `<li>${formatInline(it)}</li>`).join('')}</ul></div>`;
      case 'practice': return renderPractice(block, ctx);
      case 'tool': return renderToolBlock(block, ctx);
      default: return '';
    }
  }

  function renderBlocks(blocks, topicId, anchorBase) {
    const ctx = { topicId, toolMounts: [], blockIndex: 0, anchorBase };
    const html = blocks.map((b, i) => { ctx.blockIndex = i; return renderBlock(b, ctx); }).join('\n');
    return { html, toolMounts: ctx.toolMounts };
  }

  /* ---------- shell pieces ---------- */
  function topicIndex(topicId) { return COURSE_DATA.topics.findIndex(t => t.id === topicId); }

  function sidebarHtml(route) {
    const pct = Progress.getPercent();
    const topicLinks = COURSE_DATA.topics.map(t => {
      const active = route.page === 'topic' && route.topicId === t.id;
      const done = Progress.isComplete(t.id);
      return `<a href="#/topic/${t.id}" class="sidebar__link${active ? ' is-active' : ''}" data-topic="${t.id}">
        <span class="topic-num">${String(t.number).padStart(2, '0')}</span>
        <span class="sidebar__link-text">${DLUtils.escapeHtml(t.shortTitle)}</span>
        <span class="sidebar__check${done ? ' is-visible' : ''}">${ICONS.check}</span>
      </a>`;
    }).join('');
    return `
      <nav class="sidebar__nav">
        <a href="#/" class="sidebar__link${route.page === 'home' ? ' is-active' : ''}">${ICONS.home}<span class="sidebar__link-text">Home</span></a>
        <div class="sidebar__section-title">Topics</div>
        ${topicLinks}
        <div class="sidebar__section-title">More</div>
        <a href="#/tools" class="sidebar__link${route.page === 'tools' ? ' is-active' : ''}">${ICONS.wrench}<span class="sidebar__link-text">Interactive Tools</span></a>
        <a href="#/quiz" class="sidebar__link${route.page === 'quiz' ? ' is-active' : ''}">${ICONS.quiz}<span class="sidebar__link-text">Practice / Quiz</span></a>
        <a href="#/exam-qa" class="sidebar__link${route.page === 'exam-qa' ? ' is-active' : ''}">${ICONS.clipboardQ}<span class="sidebar__link-text">Exam Q&amp;A</span></a>
        <a href="#/references" class="sidebar__link${route.page === 'references' ? ' is-active' : ''}">${ICONS.book}<span class="sidebar__link-text">References</span></a>
        <a href="#/about" class="sidebar__link${route.page === 'about' ? ' is-active' : ''}">${ICONS.user}<span class="sidebar__link-text">About</span></a>
      </nav>
      <div class="sidebar__progress">
        <div class="sidebar__progress-label"><span>Course Progress</span><strong>${pct}%</strong></div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>`;
  }

  function refreshProgressUI() {
    const pct = Progress.getPercent();
    document.querySelectorAll('.sidebar__progress-label strong').forEach(el => el.textContent = pct + '%');
    document.querySelectorAll('.sidebar .progress-fill').forEach(el => el.style.width = pct + '%');
    document.querySelectorAll('.header-progress-chip strong').forEach(el => el.textContent = pct + '%');
    document.querySelectorAll('.header-progress-chip .progress-fill').forEach(el => el.style.width = pct + '%');
    COURSE_DATA.topics.forEach(t => {
      const check = document.querySelector(`.sidebar__link[data-topic="${t.id}"] .sidebar__check`);
      if (check) check.classList.toggle('is-visible', Progress.isComplete(t.id));
    });
    const markBtn = document.getElementById('mark-complete-btn');
    if (markBtn && state.route.page === 'topic') {
      const done = Progress.isComplete(state.route.topicId);
      markBtn.innerHTML = done ? `${ICONS.checkCircle} Completed` : `${ICONS.check} Mark as complete`;
      markBtn.classList.toggle('btn--secondary', done);
      markBtn.classList.toggle('btn--primary', !done);
    }
  }

  function breadcrumbHtml(parts) {
    const items = parts.map((p, i) => {
      const isLast = i === parts.length - 1;
      if (isLast) return `<span class="breadcrumb__current">${DLUtils.escapeHtml(p.label)}</span>`;
      return `<a href="${p.href}">${DLUtils.escapeHtml(p.label)}</a><span class="breadcrumb__sep">/</span>`;
    }).join('');
    return `<nav class="breadcrumb">${items}</nav>`;
  }

  /* ---------- page renderers ---------- */
  function renderHome() {
    const h = COURSE_DATA.home;
    const completedCount = COURSE_DATA.topics.filter(t => Progress.isComplete(t.id)).length;
    const statCards = h.stats.map(s => `<div class="stat-card"><div class="stat-card__value">${DLUtils.escapeHtml(s.value)}</div><div class="stat-card__label">${DLUtils.escapeHtml(s.label)}</div></div>`).join('');
    const objectives = h.objectives.map((o, i) => `<div class="objective-item"><span class="objective-item__num">${String(i + 1).padStart(2, '0')}</span><span>${formatInline(o)}</span></div>`).join('');
    const topicCards = COURSE_DATA.topics.map(t => {
      const done = Progress.isComplete(t.id);
      return `<a href="#/topic/${t.id}" class="topic-card">
        ${done ? `<span class="topic-card__done">${ICONS.checkCircle}</span>` : ''}
        <div class="topic-card__top"><span class="topic-card__num">${String(t.number).padStart(2, '0')}</span><span class="topic-card__icon">${ICONS[t.icon] || ICONS.chip}</span></div>
        <div class="topic-card__title">${DLUtils.escapeHtml(t.title)}</div>
        <div class="topic-card__dek">${formatInline(t.dek)}</div>
      </a>`;
    }).join('');
    return `
      <div class="hero">
        <div class="hero__eyebrow"><span class="bit bit--one">1</span><span class="bit bit--zero">0</span> Chapter 1 · Digital Logic Design</div>
        <h1>${DLUtils.escapeHtml(COURSE_DATA.meta.courseTitle)}</h1>
        <p class="made-by">Made by <strong>Minhaz Abedin</strong></p>
        <p class="hero__lede">${formatInline(h.overview)}</p>
        <p class="hero__extra">${formatInline(h.overviewExtra)}</p>
        <div class="hero__actions">
          <a href="#/topic/${COURSE_DATA.topics[0].id}" class="btn btn--primary">${ICONS.arrowRight} Start Chapter 1</a>
          <a href="#/tools" class="btn btn--secondary">${ICONS.wrench} Explore Interactive Tools</a>
          <a href="#/quiz" class="btn btn--ghost">${ICONS.quiz} Take the Quiz</a>
        </div>
      </div>
      <div class="stats-grid">${statCards}</div>
      <div class="section-title"><h2>Learning Objectives</h2></div>
      <div class="objectives-list">${objectives}</div>
      <div class="section-title"><h2>Topics in This Chapter</h2><span class="section-title__link">${completedCount}/${COURSE_DATA.topics.length} completed</span></div>
      <div class="topic-grid">${topicCards}</div>
      <div class="page-footer"><span>${DLUtils.escapeHtml(COURSE_DATA.meta.courseSubtitle)}</span><span>Built for interactive, self-paced study</span></div>`;
  }

  function renderTopic(topicId, anchor) {
    const idx = topicIndex(topicId);
    if (idx === -1) return renderNotFound();
    const t = COURSE_DATA.topics[idx];
    const { html, toolMounts } = renderBlocks(t.blocks, t.id);
    const prev = idx > 0 ? COURSE_DATA.topics[idx - 1] : null;
    const next = idx < COURSE_DATA.topics.length - 1 ? COURSE_DATA.topics[idx + 1] : null;
    const done = Progress.isComplete(t.id);

    const prevHtml = prev
      ? `<a href="#/topic/${prev.id}" class="topic-nav__card"><span class="topic-nav__label">${ICONS.chevronLeft} Previous</span><span class="topic-nav__title">${DLUtils.escapeHtml(prev.shortTitle)}</span></a>`
      : `<a href="#/" class="topic-nav__card"><span class="topic-nav__label">${ICONS.chevronLeft} Previous</span><span class="topic-nav__title">Home</span></a>`;
    const nextHtml = next
      ? `<a href="#/topic/${next.id}" class="topic-nav__card topic-nav__card--next"><span class="topic-nav__label">Next ${ICONS.chevronRight}</span><span class="topic-nav__title">${DLUtils.escapeHtml(next.shortTitle)}</span></a>`
      : `<a href="#/quiz" class="topic-nav__card topic-nav__card--next"><span class="topic-nav__label">Next ${ICONS.chevronRight}</span><span class="topic-nav__title">Practice / Quiz</span></a>`;

    const page = `
      ${breadcrumbHtml([{ label: 'Home', href: '#/' }, { label: 'Topics', href: '#/' }, { label: t.shortTitle }])}
      <div class="topic-header">
        <div class="topic-header__num">${String(t.number).padStart(2, '0')}</div>
        <div><h1>${DLUtils.escapeHtml(t.title)}</h1></div>
      </div>
      <p class="topic-dek">${formatInline(t.dek)}</p>
      <div class="topic-toolbar">
        <button class="btn ${done ? 'btn--secondary' : 'btn--primary'}" id="mark-complete-btn" data-topic="${t.id}">${done ? ICONS.checkCircle + ' Completed' : ICONS.check + ' Mark as complete'}</button>
        <span class="tool-note" style="margin:0;">Topic ${t.number} of ${COURSE_DATA.topics.length}</span>
      </div>
      ${html}
      <div class="topic-nav">${prevHtml}${nextHtml}</div>`;

    return { page, toolMounts, anchor };
  }

  function renderToolsHub() {
    const cards = COURSE_DATA.tools.map(tool => {
      const topic = COURSE_DATA.topics.find(x => x.id === tool.topicId);
      return `<a href="#/topic/${tool.topicId}/tool-${tool.id}${tool.mode ? '-' + tool.mode : ''}" class="tool-hub-card">
        <div class="tool-hub-card__icon">${ICONS[tool.icon] || ICONS.wrench}</div>
        <div>
          <div class="tool-hub-card__title">${DLUtils.escapeHtml(tool.name)}</div>
          <div class="tool-hub-card__desc">${formatInline(tool.description)}</div>
          <div class="tool-hub-card__link">Open in "${DLUtils.escapeHtml(topic ? topic.shortTitle : '')}" ${ICONS.arrowRight}</div>
        </div>
      </a>`;
    }).join('');
    return `
      ${breadcrumbHtml([{ label: 'Home', href: '#/' }, { label: 'Interactive Tools' }])}
      <div class="topic-header"><div>${ICONS.wrench}</div><div><h1>Interactive Tools</h1></div></div>
      <p class="topic-dek">All eight calculators from the chapter, in one place. Each one also lives inline with the topic it demonstrates — click through to use it in context.</p>
      <div class="tools-hub-grid">${cards}</div>`;
  }

  function renderReferences() {
    const items = COURSE_DATA.references.map((r, i) => `
      <div class="reference-item">
        <div class="reference-item__num">[${i + 1}]</div>
        <div><div class="reference-item__title">${DLUtils.escapeHtml(r.title)}</div><div class="reference-item__meta">${DLUtils.escapeHtml(r.authors)} (${DLUtils.escapeHtml(r.year)}). ${DLUtils.escapeHtml(r.publisher)}.</div></div>
      </div>`).join('');
    return `
      ${breadcrumbHtml([{ label: 'Home', href: '#/' }, { label: 'References' }])}
      <div class="topic-header"><div>${ICONS.book}</div><div><h1>Reference Books</h1></div></div>
      <p class="topic-dek">The textbooks this chapter draws on.</p>
      <div class="block">${items}</div>`;
  }

  function renderExamQA(openId) {
    const paperSections = EXAM_DATA.papers.map(paper => {
      const qItems = paper.questions.map(q => {
        const isOpen = q.id === openId;
        const { html: answerHtml } = renderBlocks(q.answer, null, `exam-qa/${q.id}`);
        return `<div class="qa-item${isOpen ? ' is-open' : ''}" id="${q.id}">
          <button class="qa-item__header" data-qa-toggle="${q.id}">
            <span class="qa-item__label">${DLUtils.escapeHtml(q.label)}</span>
            <span class="qa-item__question">${formatInline(q.question)}</span>
            <span class="qa-item__meta">${q.marks ? `${q.marks} marks` : ''}${q.clo ? ` · ${q.clo}` : ''}</span>
            <span class="qa-item__chevron">${ICONS.chevronDown}</span>
          </button>
          <div class="qa-item__body">${answerHtml}</div>
        </div>`;
      }).join('');
      return `<section class="qa-paper">
        <div class="qa-paper__header"><h2>${DLUtils.escapeHtml(paper.title)}</h2><span class="qa-paper__term">${DLUtils.escapeHtml(paper.term)}</span></div>
        <div class="qa-list">${qItems}</div>
      </section>`;
    }).join('');

    return `
      ${breadcrumbHtml([{ label: 'Home', href: '#/' }, { label: 'Exam Q&A' }])}
      <div class="topic-header"><div>${ICONS.clipboardQ}</div><div><h1>Midterm Exam Q&amp;A</h1></div></div>
      <p class="topic-dek">${formatInline(EXAM_DATA.intro)}</p>
      ${paperSections}`;
  }

  function renderAbout() {
    const a = ABOUT_DATA;
    const socialButtons = a.social.map(s => `<a href="${DLUtils.escapeHtml(s.url)}" class="btn btn--secondary" target="_blank" rel="noopener noreferrer">${ICONS[s.icon] || ''} ${DLUtils.escapeHtml(s.platform)}</a>`).join('');
    return `
      ${breadcrumbHtml([{ label: 'Home', href: '#/' }, { label: 'About' }])}
      <div class="topic-header"><div>${ICONS.user}</div><div><h1>About</h1></div></div>
      <div class="about-card">
        <div class="about-card__row"><span class="about-card__label">Name</span><span class="about-card__value">${DLUtils.escapeHtml(a.name)}</span></div>
        <div class="about-card__row"><span class="about-card__label">Department</span><span class="about-card__value">${DLUtils.escapeHtml(a.department)}</span></div>
        <div class="about-card__row"><span class="about-card__label">ID</span><span class="about-card__value">${DLUtils.escapeHtml(a.id)}</span></div>
        <div class="about-card__row"><span class="about-card__label">University</span><span class="about-card__value">${DLUtils.escapeHtml(a.university)}</span></div>
        <div class="about-card__social">${socialButtons}</div>
      </div>`;
  }

  function renderNotFound() {
    return { page: `<div class="topic-header"><h1>Page not found</h1></div><p class="block-p">That page doesn't exist. <a href="#/">Go back home</a>.</p>`, toolMounts: [] };
  }

  /* ---------- routing ---------- */
  function parseHash() {
    const raw = (location.hash || '#/').replace(/^#/, '');
    const parts = raw.split('/').filter(Boolean);
    if (parts.length === 0) return { page: 'home' };
    if (parts[0] === 'topic' && parts[1]) return { page: 'topic', topicId: parts[1], anchor: parts[2] || null };
    if (parts[0] === 'tools') return { page: 'tools' };
    if (parts[0] === 'quiz') return { page: 'quiz' };
    if (parts[0] === 'exam-qa') return { page: 'exam-qa', openId: parts[1] || null };
    if (parts[0] === 'about') return { page: 'about' };
    if (parts[0] === 'references') return { page: 'references' };
    return { page: 'home' };
  }

  function mountTools(toolMounts) {
    toolMounts.forEach(m => {
      const el = document.getElementById(m.elId);
      if (el && window.Tools && Tools[m.toolId] && typeof Tools[m.toolId].mount === 'function') {
        try { Tools[m.toolId].mount(el, m.mode); }
        catch (e) { el.innerHTML = `<p class="tool-error">This tool failed to load (${DLUtils.escapeHtml(e.message)}).</p>`; console.error(e); }
      }
    });
  }

  function render() {
    const route = parseHash();
    state.route = route;
    const contentEl = document.getElementById('page-content');
    contentEl.classList.remove('accordion-enter'); void contentEl.offsetWidth; contentEl.classList.add('accordion-enter');

    let toolMounts = [];
    let anchor = null;

    if (route.page === 'home') { contentEl.innerHTML = renderHome(); document.title = `${COURSE_DATA.meta.courseTitle} | Home`; }
    else if (route.page === 'topic') {
      const r = renderTopic(route.topicId, route.anchor);
      contentEl.innerHTML = r.page; toolMounts = r.toolMounts; anchor = r.anchor;
      const t = COURSE_DATA.topics.find(x => x.id === route.topicId);
      document.title = t ? `${t.title} | ${COURSE_DATA.meta.courseTitle}` : COURSE_DATA.meta.courseTitle;
    }
    else if (route.page === 'tools') { contentEl.innerHTML = renderToolsHub(); document.title = `Interactive Tools | ${COURSE_DATA.meta.courseTitle}`; }
    else if (route.page === 'quiz') { window.Quiz.render(contentEl); document.title = `Practice Quiz | ${COURSE_DATA.meta.courseTitle}`; }
    else if (route.page === 'exam-qa') { contentEl.innerHTML = renderExamQA(route.openId); document.title = `Exam Q&A | ${COURSE_DATA.meta.courseTitle}`; anchor = route.openId; }
    else if (route.page === 'about') { contentEl.innerHTML = renderAbout(); document.title = `About | ${COURSE_DATA.meta.courseTitle}`; }
    else if (route.page === 'references') { contentEl.innerHTML = renderReferences(); document.title = `References | ${COURSE_DATA.meta.courseTitle}`; }

    document.getElementById('sidebar-nav-wrap').innerHTML = sidebarHtml(route);
    mountTools(toolMounts);
    refreshProgressUI();
    closeMobileSidebar();

    if (anchor) {
      requestAnimationFrame(() => {
        const el = document.getElementById(anchor);
        if (el && typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          el.style.transition = 'background 200ms ease';
          const orig = el.style.background;
          el.style.background = 'var(--accent-tint)';
          setTimeout(() => { el.style.background = orig; }, 900);
        }
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' in document.documentElement.style ? 'instant' : 'auto' });
    }
  }

  function navigate(hash) { location.hash = hash; }

  /* ---------- theme ---------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dls-theme', theme);
    document.querySelectorAll('#theme-toggle-icon').forEach(el => el.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon);
  }
  function initTheme() {
    const saved = localStorage.getItem('dls-theme');
    const theme = saved || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(theme);
  }
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  /* ---------- mobile sidebar ---------- */
  function openMobileSidebar() {
    document.getElementById('sidebar').classList.add('is-open');
    document.getElementById('sidebar-backdrop').classList.add('is-open');
  }
  function closeMobileSidebar() {
    document.getElementById('sidebar').classList.remove('is-open');
    document.getElementById('sidebar-backdrop').classList.remove('is-open');
  }

  /* ---------- event delegation ---------- */
  function wireEvents() {
    document.addEventListener('click', function (e) {
      const reveal = e.target.closest('[data-reveal]');
      if (reveal) {
        const target = document.getElementById(reveal.getAttribute('data-reveal'));
        if (target) target.classList.toggle('is-visible');
        return;
      }
      const qaToggle = e.target.closest('[data-qa-toggle]');
      if (qaToggle) {
        qaToggle.closest('.qa-item').classList.toggle('is-open');
        return;
      }
      const markBtn = e.target.closest('#mark-complete-btn');
      if (markBtn) {
        Progress.toggle(markBtn.getAttribute('data-topic'));
        refreshProgressUI();
        return;
      }
      if (e.target.closest('#menu-toggle-btn')) { openMobileSidebar(); return; }
      if (e.target.closest('#sidebar-backdrop')) { closeMobileSidebar(); return; }
      if (e.target.closest('#theme-toggle-btn')) { toggleTheme(); return; }
      if (e.target.closest('#search-trigger-btn')) { window.Search.open(); return; }
      const sidebarLink = e.target.closest('.sidebar__link');
      if (sidebarLink) closeMobileSidebar();
    });

    window.addEventListener('hashchange', render);
    window.addEventListener('keydown', function (e) {
      if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) {
        e.preventDefault(); window.Search.open();
      }
    });
  }

  function init() {
    initTheme();
    wireEvents();
    Progress.init();
    window.Search.init(COURSE_DATA);
    render();
  }

  return { init, navigate, render, formatInline, ICONS_REF: ICONS, refreshProgressUI };
})();

document.addEventListener('DOMContentLoaded', App.init);
