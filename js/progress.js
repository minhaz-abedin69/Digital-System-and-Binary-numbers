/**
 * progress.js
 * Tracks which topics the student has marked "completed", persisted in localStorage.
 */
const Progress = (function () {
  'use strict';
  const KEY = 'dls-progress-v1';
  let completed = new Set();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      completed = new Set(raw ? JSON.parse(raw) : []);
    } catch (e) { completed = new Set(); }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(Array.from(completed))); }
    catch (e) { /* storage unavailable — progress just won't persist */ }
  }

  function init() { load(); }
  function isComplete(topicId) { return completed.has(topicId); }
  function toggle(topicId) {
    if (completed.has(topicId)) completed.delete(topicId);
    else completed.add(topicId);
    save();
  }
  function setComplete(topicId, value) {
    if (value) completed.add(topicId); else completed.delete(topicId);
    save();
  }
  function getCompletedCount() {
    return COURSE_DATA.topics.filter(t => completed.has(t.id)).length;
  }
  function getPercent() {
    const total = COURSE_DATA.topics.length || 1;
    return Math.round((getCompletedCount() / total) * 100);
  }

  return { init, isComplete, toggle, setComplete, getCompletedCount, getPercent };
})();
