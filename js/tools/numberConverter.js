/**
 * numberConverter.js — Topic 3 (Number Base Conversion)
 * Convert a value in any base to all others, with a step-by-step method breakdown.
 */
window.Tools = window.Tools || {};
Tools.numberConverter = {
  mount(el) {
    el.innerHTML = `
      <div class="input-row">
        <div class="input-group">
          <label class="field-label" for="nc-input">Value</label>
          <input class="text-input mono" id="nc-input" value="84" />
        </div>
        <div class="input-group" style="flex:0 0 auto;">
          <label class="field-label">Base of the value above</label>
          <div class="segmented" id="nc-base">
            <button data-base="10" class="is-active" type="button">Decimal</button>
            <button data-base="2" type="button">Binary</button>
            <button data-base="8" type="button">Octal</button>
            <button data-base="16" type="button">Hex</button>
          </div>
        </div>
      </div>
      <div id="nc-error"></div>
      <div class="tool-divider"></div>
      <div class="tool-output-grid" id="nc-outputs"></div>
      <div class="tool-panel__section">
        <div class="tool-panel__section-title">Step-by-step</div>
        <div id="nc-steps"></div>
      </div>`;

    let base = 10;
    const input = el.querySelector('#nc-input');
    const baseButtons = el.querySelectorAll('#nc-base button');
    const defaults = { 10: '84', 2: '1010100', 8: '124', 16: '54' };
    const names = { 10: 'decimal', 2: 'binary', 8: 'octal', 16: 'hexadecimal' };
    const validators = { 10: /^[0-9]+$/, 2: /^[01]+$/, 8: /^[0-7]+$/, 16: /^[0-9a-fA-F]+$/ };

    baseButtons.forEach(b => b.addEventListener('click', () => {
      baseButtons.forEach(x => x.classList.remove('is-active'));
      b.classList.add('is-active');
      base = parseInt(b.getAttribute('data-base'), 10);
      input.value = defaults[base];
      update();
    }));
    input.addEventListener('input', update);

    function weightBreakdown(bin) {
      const weights = bin.split('').map((_, i) => Math.pow(2, bin.length - 1 - i));
      const capRow = weights.map(w => `<div class="bit-caption">${w}</div>`).join('');
      const bitRow = bin.split('').map(b => `<div class="bit ${b === '1' ? 'bit--one' : 'bit--zero'}">${b}</div>`).join('');
      const terms = bin.split('').map((b, i) => b === '1' ? weights[i] : null).filter(v => v !== null);
      const sum = terms.reduce((a, b) => a + b, 0);
      return `<div class="bit-caption-row">${capRow}</div><div class="bit-grid bit-grid--gapless">${bitRow}</div>
        <div class="tool-note">${terms.length ? terms.join(' + ') + ' = <strong>' + sum + '</strong>' : 'All weights are 0.'}</div>`;
    }

    function groupBreakdown(raw, perGroupBits) {
      return raw.split('').map(d => {
        const bits = perGroupBits === 3 ? DLUtils.octDigitToBin3(d) : DLUtils.hexDigitToBin4(d);
        return `<div class="tool-step-row"><span class="tool-step-row__tag">${d.toUpperCase()}</span><span class="tool-flow-arrow">${ICONS.arrowRight}</span><span class="mono">${bits}</span></div>`;
      }).join('');
    }

    function update() {
      const raw = input.value.trim();
      const errorEl = el.querySelector('#nc-error');
      const outputsEl = el.querySelector('#nc-outputs');
      const stepsEl = el.querySelector('#nc-steps');
      errorEl.innerHTML = '';

      if (!raw || !validators[base].test(raw)) {
        errorEl.innerHTML = `<p class="tool-error">Enter a valid ${names[base]} number, using only its own digits.</p>`;
        outputsEl.innerHTML = ''; stepsEl.innerHTML = '';
        return;
      }

      let dec;
      if (base === 10) dec = parseInt(raw, 10);
      else if (base === 2) dec = DLUtils.binToDec(raw);
      else if (base === 8) dec = DLUtils.octToDec(raw);
      else dec = DLUtils.hexToDec(raw);

      const bin = DLUtils.decToBin(dec);
      const oct = DLUtils.decToOct(dec);
      const hex = DLUtils.decToHex(dec);

      outputsEl.innerHTML = `
        <div class="tool-output-card${base === 10 ? ' tool-output-card--accent' : ''}"><div class="tool-output-card__label">Decimal</div><div class="tool-output-card__value">${dec}</div></div>
        <div class="tool-output-card${base === 2 ? ' tool-output-card--accent' : ''}"><div class="tool-output-card__label">Binary</div><div class="tool-output-card__value">${bin}</div></div>
        <div class="tool-output-card${base === 8 ? ' tool-output-card--accent' : ''}"><div class="tool-output-card__label">Octal</div><div class="tool-output-card__value">${oct}</div></div>
        <div class="tool-output-card${base === 16 ? ' tool-output-card--accent' : ''}"><div class="tool-output-card__label">Hexadecimal</div><div class="tool-output-card__value">${hex}</div></div>`;

      if (base === 10 || base === 2) {
        stepsEl.innerHTML = `<p class="tool-note">Positional weights for the binary form (${dec}₁₀ = ${bin}₂):</p>${weightBreakdown(bin)}`;
      } else if (base === 8) {
        stepsEl.innerHTML = `<p class="tool-note">Each octal digit expands to exactly 3 bits:</p>${groupBreakdown(raw, 3)}<p class="tool-note">Concatenated: <strong class="mono">${bin}</strong></p>`;
      } else {
        stepsEl.innerHTML = `<p class="tool-note">Each hex digit expands to exactly 4 bits:</p>${groupBreakdown(raw, 4)}<p class="tool-note">Concatenated: <strong class="mono">${bin}</strong></p>`;
      }
    }

    update();
  }
};
