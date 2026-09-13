/**
 * codesTool.js — Topic 6 (Binary Codes)
 * mode undefined/'lookup': decimal digits -> BCD, Excess-3, 84-2-1, Aiken(2421), Biquinary.
 * mode 'bcdAdd': BCD addition of two decimal numbers, group by group, with +6 corrections.
 */
window.Tools = window.Tools || {};

const CODE_TABLE = {
  0: { bcd: '0000', excess3: '0011', c8421: '0000', aiken: '0000', biquinary: '0100001' },
  1: { bcd: '0001', excess3: '0100', c8421: '0111', aiken: '0001', biquinary: '0100010' },
  2: { bcd: '0010', excess3: '0101', c8421: '0110', aiken: '0010', biquinary: '0100100' },
  3: { bcd: '0011', excess3: '0110', c8421: '0101', aiken: '0011', biquinary: '0101000' },
  4: { bcd: '0100', excess3: '0111', c8421: '0100', aiken: '0100', biquinary: '0110000' },
  5: { bcd: '0101', excess3: '1000', c8421: '1011', aiken: '1011', biquinary: '1000001' },
  6: { bcd: '0110', excess3: '1001', c8421: '1010', aiken: '1100', biquinary: '1000010' },
  7: { bcd: '0111', excess3: '1010', c8421: '1001', aiken: '1101', biquinary: '1000100' },
  8: { bcd: '1000', excess3: '1011', c8421: '1000', aiken: '1110', biquinary: '1001000' },
  9: { bcd: '1001', excess3: '1100', c8421: '1111', aiken: '1111', biquinary: '1010000' }
};

function bcdAddDigits(a, b, carryIn) {
  const rawSum = a + b + carryIn;
  if (rawSum <= 9) return { rawSum, needsCorrection: false, digit: rawSum, carryOut: 0 };
  const correctedSum = rawSum + 6;
  return { rawSum, needsCorrection: true, correctedSum, digit: correctedSum % 16, carryOut: 1 };
}
function bcdAdd(numAStr, numBStr) {
  const len = Math.max(numAStr.length, numBStr.length);
  const aDigits = numAStr.padStart(len, '0').split('').map(Number);
  const bDigits = numBStr.padStart(len, '0').split('').map(Number);
  let carry = 0;
  const groups = [];
  for (let i = len - 1; i >= 0; i--) {
    const r = bcdAddDigits(aDigits[i], bDigits[i], carry);
    groups.unshift(Object.assign({ aDigit: aDigits[i], bDigit: bDigits[i], carryIn: carry }, r));
    carry = r.carryOut;
  }
  return { groups, finalCarry: carry };
}

Tools.codesTool = {
  mount(el, mode) {
    if (mode === 'bcdAdd') return this._mountBcdAdd(el);
    return this._mountLookup(el);
  },

  _mountLookup(el) {
    el.innerHTML = `
      <div class="input-row">
        <div class="input-group"><label class="field-label" for="cd-input">Decimal digit(s)</label><input class="text-input mono" id="cd-input" value="6248" /></div>
      </div>
      <div id="cd-error"></div>
      <div id="cd-output" style="margin-top:1rem;"></div>`;

    const input = el.querySelector('#cd-input');
    input.addEventListener('input', update);

    function row(label, valueFn) {
      const value = input.value.trim().split('').map(d => valueFn(CODE_TABLE[Number(d)])).join(' ');
      return `<div class="tool-step-row"><span class="tool-step-row__tag">${label}</span><span class="mono">${value}</span></div>`;
    }

    function update() {
      const raw = input.value.trim();
      const errorEl = el.querySelector('#cd-error');
      const out = el.querySelector('#cd-output');
      errorEl.innerHTML = '';
      if (!/^[0-9]+$/.test(raw)) { errorEl.innerHTML = `<p class="tool-error">Enter one or more decimal digits (0–9).</p>`; out.innerHTML = ''; return; }
      out.innerHTML = `<div class="tool-steps">
        ${row('BCD (8421)', c => c.bcd)}
        ${row('Excess-3', c => c.excess3)}
        ${row('84-2-1', c => c.c8421)}
        ${row('Aiken (2421)', c => c.aiken)}
        ${row('Biquinary', c => c.biquinary)}
      </div>`;
    }
    update();
  },

  _mountBcdAdd(el) {
    el.innerHTML = `
      <div class="input-row">
        <div class="input-group"><label class="field-label" for="ba-a">First number</label><input class="text-input mono" id="ba-a" value="184" /></div>
        <div class="input-group"><label class="field-label" for="ba-b">Second number</label><input class="text-input mono" id="ba-b" value="576" /></div>
        <div class="input-group" style="flex:0 0 auto;"><button class="btn btn--primary" id="ba-btn" type="button">Add in BCD</button></div>
      </div>
      <div id="ba-error"></div>
      <div id="ba-output" style="margin-top:1rem;"></div>`;

    function run() {
      const aRaw = el.querySelector('#ba-a').value.trim();
      const bRaw = el.querySelector('#ba-b').value.trim();
      const errorEl = el.querySelector('#ba-error');
      const out = el.querySelector('#ba-output');
      errorEl.innerHTML = '';
      if (!/^[0-9]+$/.test(aRaw) || !/^[0-9]+$/.test(bRaw)) { errorEl.innerHTML = `<p class="tool-error">Enter two whole decimal numbers.</p>`; out.innerHTML = ''; return; }

      const { groups, finalCarry } = bcdAdd(aRaw, bRaw);
      const rows = groups.map((g, i) => {
        const posLabel = `Group ${i + 1}${g.carryIn ? ' (+ carry in)' : ''}`;
        const raw4 = DLUtils.padBits(g.rawSum.toString(2), 4);
        let detail = `${g.aDigit} + ${g.bDigit}${g.carryIn ? ' + 1' : ''} = ${g.rawSum} (${raw4})`;
        if (g.needsCorrection) detail += ` &ge; 10, so add 0110 &rarr; ${g.correctedSum} &rarr; digit ${g.digit}, carry ${g.carryOut}`;
        else detail += ` &lt; 10, no correction needed`;
        return `<div class="tool-step-row${g.needsCorrection ? ' is-good' : ''}"><span class="tool-step-row__tag">${posLabel}</span><span>${detail}</span></div>`;
      }).join('');

      const resultDigits = groups.map(g => g.digit).join('');
      const resultStr = (finalCarry ? '1' : '') + resultDigits;
      const decA = parseInt(aRaw, 10), decB = parseInt(bRaw, 10);

      out.innerHTML = `<div class="tool-steps">${rows}</div>
        <div class="tool-result-banner tool-result-banner--good">${ICONS.checkCircle}${aRaw} + ${bRaw} = ${parseInt(resultStr, 10)} &nbsp;&rarr;&nbsp; BCD ${resultStr.split('').map(d => DLUtils.padBits(Number(d).toString(2), 4)).join(' ')}</div>
        <p class="tool-note">Cross-check in ordinary decimal: ${decA} + ${decB} = ${decA + decB}.</p>`;
    }
    el.querySelector('#ba-btn').addEventListener('click', run);
    run();
  }
};
