/**
 * search.js
 * Builds a lightweight in-memory search index from COURSE_DATA (topics, headings,
 * definitions, examples, key terms, tools) and provides an overlay UI to query it.
 */
window.Search = (function () {
  'use strict';
  let index = [];
  let activeIndex = -1;
  let currentResults = [];
  let overlayEl, inputEl, resultsEl;

  function addEntry(entry) { index.push(entry); }

  function textOf(block) {
    switch (block.type) {
      case 'lead': case 'p': return block.text;
      case 'heading': return block.text;
      case 'definition': return `${block.term}: ${block.text}`;
      case 'note': return `${block.title}. ${block.text}`;
      case 'example': return `${block.title}. ${block.given || ''} ${block.answer || ''}`;
      case 'list': return (block.items || []).join(' ');
      case 'keypoints': case 'mistakes': return (block.items || []).join(' ');
      case 'practice': return (block.items || []).map(it => it.q + ' ' + it.answer).join(' ');
      case 'tool': return `${block.title}. ${block.description}`;
      default: return '';
    }
  }

  function buildIndex(data) {
    index = [];
    addEntry({ title: 'Home', breadcrumb: 'Course', snippet: data.home.overview, route: '#/' });
    addEntry({ title: 'Interactive Tools', breadcrumb: 'Course', snippet: 'All eight interactive calculators from the chapter.', route: '#/tools' });
    addEntry({ title: 'Practice / Quiz', breadcrumb: 'Course', snippet: 'A chapter-wide multiple choice quiz with instant feedback.', route: '#/quiz' });
    addEntry({ title: 'References', breadcrumb: 'Course', snippet: 'The textbooks this chapter draws on.', route: '#/references' });

    data.topics.forEach(topic => {
      addEntry({ title: topic.title, breadcrumb: `Topic ${topic.number}`, snippet: topic.dek, route: `#/topic/${topic.id}` });
      let lastHeadingId = null;
      topic.blocks.forEach(block => {
        if (block.type === 'heading') lastHeadingId = block.id || null;
        const text = textOf(block);
        if (!text) return;
        const anchor = block.id || lastHeadingId;
        const route = anchor ? `#/topic/${topic.id}/${anchor}` : `#/topic/${topic.id}`;
        let title = topic.title;
        if (block.type === 'heading') title = block.text;
        else if (block.type === 'definition') title = block.term;
        else if (block.type === 'note') title = block.title;
        else if (block.type === 'example') title = block.title;
        else if (block.type === 'tool') title = block.title;
        addEntry({ title, breadcrumb: topic.shortTitle, snippet: text.slice(0, 140), route });
      });
    });

    data.tools.forEach(tool => {
      addEntry({ title: tool.name, breadcrumb: 'Tool', snippet: tool.description, route: `#/topic/${tool.topicId}/tool-${tool.id}${tool.mode ? '-' + tool.mode : ''}` });
    });
  }

  function score(entry, terms) {
    const hay = (entry.title + ' ' + entry.breadcrumb + ' ' + entry.snippet).toLowerCase();
    let total = 0;
    for (const term of terms) {
      if (!term) continue;
      const inTitle = entry.title.toLowerCase().includes(term);
      const inHay = hay.includes(term);
      if (!inHay) return -1;
      total += inTitle ? 3 : 1;
    }
    return total;
  }

  function query(str) {
    const terms = str.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];
    const scored = index.map(e => ({ e, s: score(e, terms) })).filter(x => x.s >= 0);
    scored.sort((a, b) => b.s - a.s);
    return scored.slice(0, 30).map(x => x.e);
  }

  function highlight(text, str) {
    const terms = str.trim().split(/\s+/).filter(Boolean).map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (terms.length === 0) return DLUtils.escapeHtml(text);
    const re = new RegExp('(' + terms.join('|') + ')', 'ig');
    return DLUtils.escapeHtml(text).replace(re, '<mark>$1</mark>');
  }

  function renderResults(str) {
    currentResults = query(str);
    activeIndex = currentResults.length ? 0 : -1;
    if (!str.trim()) {
      resultsEl.innerHTML = `<div class="search-empty">Start typing to search topics, definitions, examples, and tools.</div>`;
      return;
    }
    if (currentResults.length === 0) {
      resultsEl.innerHTML = `<div class="search-empty">No results for "${DLUtils.escapeHtml(str)}".</div>`;
      return;
    }
    resultsEl.innerHTML = currentResults.map((r, i) => `
      <div class="search-result${i === 0 ? ' is-active' : ''}" data-route="${DLUtils.escapeHtml(r.route)}" data-idx="${i}">
        <div class="search-result__breadcrumb">${DLUtils.escapeHtml(r.breadcrumb)}</div>
        <div class="search-result__title">${highlight(r.title, str)}</div>
        <div class="search-result__snippet">${highlight(r.snippet, str)}</div>
      </div>`).join('');
  }

  function setActive(i) {
    const items = resultsEl.querySelectorAll('.search-result');
    items.forEach(el => el.classList.remove('is-active'));
    if (items[i]) { items[i].classList.add('is-active'); items[i].scrollIntoView({ block: 'nearest' }); }
    activeIndex = i;
  }

  function go(route) { close(); location.hash = route.replace(/^#/, ''); }

  function open() {
    overlayEl.classList.add('is-open');
    inputEl.value = '';
    renderResults('');
    setTimeout(() => inputEl.focus(), 30);
  }
  function close() { overlayEl.classList.remove('is-open'); }

  function buildOverlay() {
    overlayEl = document.createElement('div');
    overlayEl.className = 'search-overlay';
    overlayEl.id = 'search-overlay';
    overlayEl.innerHTML = `
      <div class="search-modal" role="dialog" aria-label="Search">
        <div class="search-modal__input-row">
          ${ICONS.search}
          <input class="search-modal__input" id="search-modal-input" placeholder="Search topics, terms, examples, tools..." autocomplete="off" />
          <button class="search-modal__close" id="search-modal-close">Esc</button>
        </div>
        <div class="search-results" id="search-results"></div>
        <div class="search-hint"><span><kbd>&uarr;</kbd><kbd>&darr;</kbd> navigate</span><span><kbd>&crarr;</kbd> open</span><span><kbd>Esc</kbd> close</span></div>
      </div>`;
    document.body.appendChild(overlayEl);
    inputEl = document.getElementById('search-modal-input');
    resultsEl = document.getElementById('search-results');

    overlayEl.addEventListener('click', e => { if (e.target === overlayEl) close(); });
    document.getElementById('search-modal-close').addEventListener('click', close);
    inputEl.addEventListener('input', () => renderResults(inputEl.value));
    resultsEl.addEventListener('click', e => {
      const item = e.target.closest('.search-result');
      if (item) go(item.getAttribute('data-route'));
    });
    document.addEventListener('keydown', e => {
      if (!overlayEl.classList.contains('is-open')) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); if (currentResults.length) setActive(Math.min(activeIndex + 1, currentResults.length - 1)); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); if (currentResults.length) setActive(Math.max(activeIndex - 1, 0)); return; }
      if (e.key === 'Enter') { e.preventDefault(); if (currentResults[activeIndex]) go(currentResults[activeIndex].route); }
    });
  }

  function init(data) {
    buildIndex(data);
    buildOverlay();
  }

  return { init, open, close, query };
})();
