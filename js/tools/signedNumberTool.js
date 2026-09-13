/**
 * signedNumberTool.js — Topic 5 (Signed Binary Numbers)
 * mode undefined/'explorer': decimal -> signed-magnitude / 1's-complement / 2's-complement, side by side.
 * mode 'adder': two signed decimals added in 8-bit 2's complement, carry-out discarded.
 */
window.Tools = window.Tools || {};
Tools.signedNumberTool = {
  mount(el, mode) {
    if (mode === 'adder') return this._mountAdder(el);
    return this._mountExplorer(el);
  },

  _mountExplorer(el) {
    el.innerHTML = `
      <div class="input-row">
        <div class="input-group">
          <label class="field-label" for="sn-value">Decimal value</label>
          <input class="text-input mono" id="sn-value" value="9" />
        </div>
        <div class="input-group" style="flex:0 0 auto;">
          <label class="field-label">Width</label>
          <div class="segmented" id="sn-width">
            <button data-bits="4" type="button">4-bit</button>
            <button data-bits="8" class="is-active" type="button">8-bit</button>
          </div>
        </div>
      </div>
      <div id="sn-error"></div>
      <div id="sn-output" style="margin-top:1rem;"></div>`;

    let bits = 8;
    const input = el.querySelector('#sn-value');
    el.querySelectorAll('#sn-width button').forEach(b => b.addEventListener('click', () => {
      el.querySelectorAll('#sn-width button').forEach(x => x.classList.remove('is-active'));
      b.classList.add('is-active'); bits = parseInt(b.getAttribute('data-bits'), 10); update();
    }));
    input.addEventListener('input', update);

    function card(label, bin, note) {
      if (bin === null) return `<div class="tool-output-card"><div class="tool-output-card__label">${label}</div><div class="tool-output-card__value" style="color:var(--ink-500);font-size:.85rem;">not representable</div></div>`;
      const bitHtml = bin.split('').map((b, i) => `<div class="bit ${b === '1' ? 'bit--one' : 'bit--zero'}${i === 0 ? ' bit--pos-marker' : ''}">${b}</div>`).join('');
      return `<div class="tool-output-card">
        <div class="tool-output-card__label">${label}${note ? ` &middot; ${note}` : ''}</div>
        <div class="bit-grid bit-grid--gapless" style="margin-top:.3rem;">${bitHtml}</div>
      </div>`;
    }

    function update() {
      const raw = input.value.trim();
      const errorEl = el.querySelector('#sn-error');
      const out = el.querySelector('#sn-output');
      errorEl.innerHTML = '';
      if (!/^-?\d+$/.test(raw)) { errorEl.innerHTML = `<p class="tool-error">Enter a whole number (e.g. 9 or -9).</p>`; out.innerHTML = ''; return; }
      const value = parseInt(raw, 10);
      const max = Math.pow(2, bits - 1) - 1, min = -Math.pow(2, bits - 1);
      if (value > max || value < min) {
        errorEl.innerHTML = `<p class="tool-error">${value} is out of range for ${bits}-bit signed numbers (${min} to ${max}). Try a smaller magnitude or switch width.</p>`;
        out.innerHTML = ''; return;
      }
      const sm = DLUtils.signedMagnitude(value, bits);
      const s1c = DLUtils.signedOnesComplement(value, bits);
      const s2c = DLUtils.signedTwosComplement(value, bits);
      out.innerHTML = `<div class="tool-output-grid">
          ${card('Signed magnitude', sm)}
          ${card("Signed 1's complement", s1c)}
          ${card("Signed 2's complement", s2c)}
        </div>
        <p class="tool-note">The leftmost (dashed) bit is the sign bit in each case. ${value === 0 ? "Notice signed-magnitude and 1's-complement both have a distinct &minus;0 you haven't hit yet &mdash; try entering a value, then check the full 4-bit table above for it." : (sm === null ? `${bits}-bit 2's complement can represent ${value} even though signed-magnitude and 1's-complement cannot &mdash; that extra negative value is a normal asymmetry of 2's complement.` : '')}</p>`;
    }
    update();
  },

  _mountAdder(el) {
    el.innerHTML = `
      <div class="input-row">
        <div class="input-group"><label class="field-label" for="sa-a">First value (decimal)</label><input class="text-input mono" id="sa-a" value="-8" /></div>
        <div class="input-group"><label class="field-label" for="sa-b">Second value (decimal)</label><input class="text-input mono" id="sa-b" value="10" /></div>
        <div class="input-group" style="flex:0 0 auto;"><button class="btn btn--primary" id="sa-add-btn" type="button">Add (8-bit, 2's complement)</button></div>
      </div>
      <div id="sa-error"></div>
      <div id="sa-output" style="margin-top:1rem;"></div>`;

    function run() {
      const aRaw = el.querySelector('#sa-a').value.trim();
      const bRaw = el.querySelector('#sa-b').value.trim();
      const errorEl = el.querySelector('#sa-error');
      const out = el.querySelector('#sa-output');
      errorEl.innerHTML = '';
      if (!/^-?\d+$/.test(aRaw) || !/^-?\d+$/.test(bRaw)) { errorEl.innerHTML = `<p class="tool-error">Enter two whole numbers.</p>`; out.innerHTML = ''; return; }
      const a = parseInt(aRaw, 10), b = parseInt(bRaw, 10);
      if (a < -128 || a > 127 || b < -128 || b > 127) { errorEl.innerHTML = `<p class="tool-error">Keep both values within 8-bit signed range (&minus;128 to 127).</p>`; out.innerHTML = ''; return; }
      const aBin = DLUtils.signedTwosComplement(a, 8);
      const bBin = DLUtils.signedTwosComplement(b, 8);
      const { sum, carryOut } = DLUtils.addBinary(aBin, bBin);
      const resultDec = DLUtils.twosComplementToDecimal(sum);

      const bitRow = bin => bin.split('').map(bit => `<div class="bit ${bit === '1' ? 'bit--one' : 'bit--zero'}">${bit}</div>`).join('');
      out.innerHTML = `
        <div class="tool-steps">
          <div class="tool-step-row"><span class="tool-step-row__tag">${a >= 0 ? '+' : ''}${a}</span><div class="bit-grid bit-grid--gapless">${bitRow(aBin)}</div></div>
          <div class="tool-step-row"><span class="tool-step-row__tag">${b >= 0 ? '+' : ''}${b}</span><div class="bit-grid bit-grid--gapless">${bitRow(bBin)}</div></div>
          <div class="tool-step-row is-${carryOut ? 'bad' : 'good'}"><span class="tool-step-row__tag">Sum</span><div class="bit-grid bit-grid--gapless">${bitRow(sum)}</div><span>${carryOut ? '(carry out of sign bit — discarded)' : '(no carry out)'}</span></div>
        </div>
        <div class="tool-result-banner tool-result-banner--good">${ICONS.checkCircle}(${a >= 0 ? '+' : ''}${a}) + (${b >= 0 ? '+' : ''}${b}) = ${resultDec >= 0 ? '+' : ''}${resultDec}</div>
        <p class="tool-note">Binary result <span class="mono">${sum}</span>, discarding any carry out of the sign-bit position, matches ${a} + ${b} = ${a + b} in ordinary decimal arithmetic.</p>`;
    }
    el.querySelector('#sa-add-btn').addEventListener('click', run);
    run();
  }
};
