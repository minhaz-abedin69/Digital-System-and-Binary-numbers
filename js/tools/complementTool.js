/**
 * complementTool.js — Topic 4 (Binary Complements)
 * Section A: bit-by-bit animated 1's/2's complement of a single number.
 * Section B: full subtraction A - B via 1's or 2's complement, with end-carry handling.
 */
window.Tools = window.Tools || {};
Tools.complementTool = {
  mount(el) {
    el.innerHTML = `
      <div class="tool-panel__section-title">Find a complement, bit by bit</div>
      <div class="input-row">
        <div class="input-group">
          <label class="field-label" for="ct-input">Binary number</label>
          <input class="text-input mono" id="ct-input" value="1010100" maxlength="16" />
        </div>
        <div class="input-group" style="flex:0 0 auto;">
          <button class="btn btn--secondary" id="ct-1c-btn" type="button">Animate 1's complement</button>
        </div>
        <div class="input-group" style="flex:0 0 auto;">
          <button class="btn btn--primary" id="ct-2c-btn" type="button">Animate 2's complement</button>
        </div>
      </div>
      <div id="ct-error"></div>
      <div id="ct-stage" style="margin-top:1rem;"></div>

      <div class="tool-panel__section">
        <div class="tool-panel__section-title">Subtract using complements (A &minus; B)</div>
        <div class="input-row">
          <div class="input-group"><label class="field-label" for="ct-a">A</label><input class="text-input mono" id="ct-a" value="1010100" /></div>
          <div class="input-group"><label class="field-label" for="ct-b">B</label><input class="text-input mono" id="ct-b" value="1000100" /></div>
          <div class="input-group" style="flex:0 0 auto;">
            <label class="field-label">Method</label>
            <div class="segmented" id="ct-method">
              <button data-method="2c" class="is-active" type="button">2's complement</button>
              <button data-method="1c" type="button">1's complement</button>
            </div>
          </div>
          <div class="input-group" style="flex:0 0 auto;"><button class="btn btn--primary" id="ct-sub-btn" type="button">Subtract</button></div>
        </div>
        <div id="ct-sub-error"></div>
        <div id="ct-sub-result" style="margin-top:.9rem;"></div>
      </div>`;

    const input = el.querySelector('#ct-input');
    const stage = el.querySelector('#ct-stage');
    const errorEl = el.querySelector('#ct-error');

    function bitEls(bin, cls) {
      return bin.split('').map(b => `<div class="bit ${cls}">${b}</div>`).join('');
    }

    function validateSingle() {
      const v = DLUtils.sanitizeBinary(input.value);
      errorEl.innerHTML = '';
      if (!v || v !== input.value.trim()) {
        errorEl.innerHTML = `<p class="tool-error">Enter a binary number using only 0s and 1s.</p>`;
        return null;
      }
      return v;
    }

    function animateComplement(kind) {
      const v = validateSingle();
      if (!v) { stage.innerHTML = ''; return; }
      const target = kind === '1c' ? DLUtils.onesComplement(v) : DLUtils.twosComplement(v);
      const inverted = DLUtils.onesComplement(v);

      stage.innerHTML = `
        <div class="tool-flow-row">
          <div class="bit-grid" id="ct-original">${bitEls(v, 'bit--zero')}</div>
        </div>
        <p class="tool-note" id="ct-caption">Original number.</p>`;
      const originalCells = Array.from(stage.querySelectorAll('#ct-original .bit'));
      v.split('').forEach((b, i) => { originalCells[i].classList.remove('bit--zero'); originalCells[i].classList.add(b === '1' ? 'bit--one' : 'bit--zero'); });

      let i = 0;
      const flipNext = () => {
        if (i >= v.length) {
          stage.querySelector('#ct-caption').innerHTML = kind === '1c'
            ? `<strong>1's complement:</strong> every bit flipped. Result: <span class="mono">${target}</span>`
            : `Every bit flipped (1's complement) &rarr; <span class="mono">${inverted}</span>. Now add 1 to get the 2's complement:`;
          if (kind === '2c') setTimeout(() => showAddOne(inverted, target), 400);
          return;
        }
        const cell = originalCells[i];
        cell.classList.add('bit--flash');
        const bit = cell.textContent.trim();
        const flipped = bit === '0' ? '1' : '0';
        setTimeout(() => {
          cell.textContent = flipped;
          cell.classList.remove('bit--one', 'bit--zero');
          cell.classList.add(flipped === '1' ? 'bit--one' : 'bit--zero');
        }, 140);
        i++;
        setTimeout(flipNext, 220);
      };
      setTimeout(flipNext, 250);
    }

    function showAddOne(inverted, final) {
      stage.innerHTML += `
        <div class="tool-flow-row" style="margin-top:.9rem;">
          <div class="bit-grid">${bitEls(inverted, 'bit--zero')}</div>
          <span class="tool-flow-arrow">+ 1</span>
          <div class="bit-grid">${bitEls(final, 'bit--one')}</div>
        </div>
        <p class="tool-note"><strong>2's complement:</strong> <span class="mono">${final}</span></p>`;
      stage.querySelectorAll('.bit-grid')[0].querySelectorAll('.bit').forEach((c, idx) => {
        c.classList.remove('bit--zero'); c.classList.add(inverted[idx] === '1' ? 'bit--one' : 'bit--zero');
      });
    }

    el.querySelector('#ct-1c-btn').addEventListener('click', () => animateComplement('1c'));
    el.querySelector('#ct-2c-btn').addEventListener('click', () => animateComplement('2c'));
    input.addEventListener('input', () => { stage.innerHTML = ''; validateSingle(); });

    /* ---- subtraction section ---- */
    let method = '2c';
    el.querySelectorAll('#ct-method button').forEach(b => b.addEventListener('click', () => {
      el.querySelectorAll('#ct-method button').forEach(x => x.classList.remove('is-active'));
      b.classList.add('is-active');
      method = b.getAttribute('data-method');
    }));

    function subtract() {
      const aRaw = DLUtils.sanitizeBinary(el.querySelector('#ct-a').value);
      const bRaw = DLUtils.sanitizeBinary(el.querySelector('#ct-b').value);
      const subErr = el.querySelector('#ct-sub-error');
      const resultEl = el.querySelector('#ct-sub-result');
      subErr.innerHTML = '';
      if (!aRaw || !bRaw) { subErr.innerHTML = `<p class="tool-error">Enter binary numbers (0s and 1s only) for both A and B.</p>`; resultEl.innerHTML = ''; return; }

      const width = Math.max(aRaw.length, bRaw.length);
      const a = DLUtils.padBits(aRaw, width);
      const b = DLUtils.padBits(bRaw, width);
      const comp = method === '1c' ? DLUtils.onesComplement(b) : DLUtils.twosComplement(b);
      const { sum, carryOut } = DLUtils.addBinary(a, comp);

      let rows = `
        <div class="tool-step-row"><span class="tool-step-row__tag">B</span><span class="mono">${b}</span></div>
        <div class="tool-step-row"><span class="tool-step-row__tag">${method === '1c' ? "1's comp(B)" : "2's comp(B)"}</span><span class="mono">${comp}</span></div>
        <div class="tool-step-row"><span class="tool-step-row__tag">A + comp(B)</span><span class="mono">${(carryOut ? '1' : '0') + sum}</span></div>`;

      let bannerClass = 'tool-result-banner--good', bannerIcon = ICONS.checkCircle, answer, explain;
      if (carryOut) {
        if (method === '1c') {
          const corrected = DLUtils.addOne(sum);
          answer = corrected;
          explain = `End carry produced &rarr; remove it and add it back into the LSB (end-around carry): ${sum} + 1 = ${corrected}.`;
          rows += `<div class="tool-step-row is-good"><span class="tool-step-row__tag">+1 (end-around)</span><span class="mono">${sum} + 1 = ${corrected}</span></div>`;
        } else {
          answer = sum;
          explain = `End carry produced &rarr; simply discard it.`;
          rows += `<div class="tool-step-row is-good"><span class="tool-step-row__tag">Discard carry</span><span class="mono">${sum}</span></div>`;
        }
        resultEl.innerHTML = `<div class="tool-steps">${rows}</div>
          <div class="tool-result-banner ${bannerClass}">${bannerIcon}A &minus; B = ${answer}&#8322; &nbsp;(decimal ${DLUtils.binToDec(answer)})</div>
          <p class="tool-note">${explain}</p>`;
      } else {
        const recomplemented = method === '1c' ? DLUtils.onesComplement(sum) : DLUtils.twosComplement(sum);
        answer = recomplemented;
        explain = `No end carry &rarr; the true answer is negative. Re-apply the ${method === '1c' ? "1's" : "2's"} complement to the result and attach a minus sign.`;
        rows += `<div class="tool-step-row is-bad"><span class="tool-step-row__tag">No carry</span><span>Result is negative</span></div>
          <div class="tool-step-row"><span class="tool-step-row__tag">Re-complement</span><span class="mono">${sum} &rarr; ${recomplemented}</span></div>`;
        resultEl.innerHTML = `<div class="tool-steps">${rows}</div>
          <div class="tool-result-banner tool-result-banner--neutral">${ICONS.info}A &minus; B = &minus;${answer}&#8322; &nbsp;(decimal ${-DLUtils.binToDec(answer)})</div>
          <p class="tool-note">${explain}</p>`;
      }
    }
    el.querySelector('#ct-sub-btn').addEventListener('click', subtract);

    validateSingle();
    subtract();
  }
};
