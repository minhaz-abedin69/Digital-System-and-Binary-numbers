/**
 * grayCodeTool.js — Topic 10 (Gray Code)
 * Converts either direction with a visible XOR chain, and highlights neighbors in the
 * reference table to show the "only one bit changes" property.
 */
window.Tools = window.Tools || {};
Tools.grayCodeTool = {
  mount(el) {
    el.innerHTML = `
      <div class="segmented" id="gc-direction">
        <button data-dir="b2g" class="is-active" type="button">Binary &rarr; Gray</button>
        <button data-dir="g2b" type="button">Gray &rarr; Binary</button>
      </div>
      <div class="input-row" style="margin-top:.8rem;">
        <div class="input-group"><label class="field-label" id="gc-input-label" for="gc-input">Binary value</label><input class="text-input mono" id="gc-input" value="1110" maxlength="8" /></div>
      </div>
      <div id="gc-error"></div>
      <div id="gc-steps" style="margin-top:1rem;"></div>
      <div class="tool-panel__section">
        <div class="tool-panel__section-title">Neighbors in the table (only 1 bit differs each step)</div>
        <div id="gc-neighbors"></div>
      </div>`;

    let dir = 'b2g';
    const input = el.querySelector('#gc-input');
    const label = el.querySelector('#gc-input-label');

    el.querySelectorAll('#gc-direction button').forEach(b => b.addEventListener('click', () => {
      el.querySelectorAll('#gc-direction button').forEach(x => x.classList.remove('is-active'));
      b.classList.add('is-active');
      dir = b.getAttribute('data-dir');
      label.textContent = dir === 'b2g' ? 'Binary value' : 'Gray code value';
      update();
    }));
    input.addEventListener('input', update);

    function bitEls(bin, cls) { return bin.split('').map(b => `<div class="bit ${cls}">${b}</div>`).join(''); }

    function update() {
      const raw = DLUtils.sanitizeBinary(input.value);
      const errorEl = el.querySelector('#gc-error');
      const stepsEl = el.querySelector('#gc-steps');
      const neighborsEl = el.querySelector('#gc-neighbors');
      errorEl.innerHTML = '';
      if (!raw || raw !== input.value.trim()) {
        errorEl.innerHTML = `<p class="tool-error">Enter a binary value using only 0s and 1s.</p>`;
        stepsEl.innerHTML = ''; neighborsEl.innerHTML = ''; return;
      }
      const result = dir === 'b2g' ? DLUtils.binaryToGray(raw) : DLUtils.grayToBinary(raw);
      const fromLabel = dir === 'b2g' ? 'Binary' : 'Gray';
      const toLabel = dir === 'b2g' ? 'Gray' : 'Binary';

      let chainRows = `<div class="tool-step-row"><span class="tool-step-row__tag">MSB copied</span><span class="mono">${result[0]} = ${raw[0]}</span></div>`;
      for (let i = 1; i < raw.length; i++) {
        if (dir === 'b2g') chainRows += `<div class="tool-step-row"><span class="tool-step-row__tag">bit ${i + 1}</span><span class="mono">${raw[i - 1]} &oplus; ${raw[i]} = ${result[i]}</span></div>`;
        else chainRows += `<div class="tool-step-row"><span class="tool-step-row__tag">bit ${i + 1}</span><span class="mono">${result[i - 1]} &oplus; ${raw[i]} = ${result[i]}</span></div>`;
      }

      stepsEl.innerHTML = `
        <div class="tool-flow-row">
          <div><div class="bit-caption" style="width:auto;">${fromLabel}</div><div class="bit-grid bit-grid--gapless">${bitEls(raw, 'bit--zero')}</div></div>
          <span class="tool-flow-arrow">${ICONS.arrowRight}</span>
          <div><div class="bit-caption" style="width:auto;">${toLabel}</div><div class="bit-grid bit-grid--gapless">${bitEls(result, 'bit--one')}</div></div>
        </div>
        <div class="tool-steps" style="margin-top:.8rem;">${chainRows}</div>`;

      // neighbor highlight, only meaningful for 4-bit values (matches the reference table)
      if (raw.length === 4) {
        const decValue = dir === 'b2g' ? DLUtils.binToDec(raw) : DLUtils.grayToBinary(raw) && DLUtils.binToDec(DLUtils.grayToBinary(raw));
        const rows = [];
        for (let d = 0; d < 16; d++) {
          const b = DLUtils.padBits(d.toString(2), 4);
          const g = DLUtils.binaryToGray(b);
          const isCurrent = d === decValue;
          rows.push({ d, b, g, isCurrent });
        }
        neighborsEl.innerHTML = `<table class="mini-table"><thead><tr><th>Dec</th><th>Binary</th><th>Gray</th></tr></thead><tbody>
          ${rows.map(r => `<tr class="${r.isCurrent ? 'is-current' : ''}" style="${r.isCurrent ? 'background:var(--accent-tint);' : ''}"><td>${r.d}</td><td>${r.b}</td><td>${r.g}</td></tr>`).join('')}
        </tbody></table>`;
      } else {
        neighborsEl.innerHTML = `<p class="tool-note">Use a 4-bit value to see it highlighted against the full reference table.</p>`;
      }
    }

    update();
  }
};
