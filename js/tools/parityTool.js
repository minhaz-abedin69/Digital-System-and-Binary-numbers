/**
 * parityTool.js — Topic 8 (Error Detecting Code: Parity Bit)
 * Generates a parity bit for a message, then lets the student click bits in the
 * "received" copy to flip them and see whether the parity check catches the error.
 */
window.Tools = window.Tools || {};
Tools.parityTool = {
  mount(el) {
    el.innerHTML = `
      <div class="input-row">
        <div class="input-group"><label class="field-label" for="pt-msg">Message (binary)</label><input class="text-input mono" id="pt-msg" value="1011" maxlength="12" /></div>
        <div class="input-group" style="flex:0 0 auto;">
          <label class="field-label">Parity type</label>
          <div class="segmented" id="pt-type">
            <button data-type="even" class="is-active" type="button">Even</button>
            <button data-type="odd" type="button">Odd</button>
          </div>
        </div>
      </div>
      <div id="pt-error"></div>
      <div class="tool-panel__section">
        <div class="tool-panel__section-title">Sent (message + parity bit)</div>
        <div id="pt-sent"></div>
      </div>
      <div class="tool-panel__section">
        <div class="tool-panel__section-title">Received &mdash; click any bit to simulate a transmission error</div>
        <div id="pt-received"></div>
        <div id="pt-result" style="margin-top:.8rem;"></div>
        <button class="btn btn--secondary btn--sm" id="pt-reset-btn" type="button" style="margin-top:.7rem;">Reset to match sent</button>
      </div>`;

    let parityType = 'even';
    let sentBits = [];    // array of '0'/'1', index 0 = parity bit, rest = message
    let receivedBits = [];

    const msgInput = el.querySelector('#pt-msg');
    el.querySelectorAll('#pt-type button').forEach(b => b.addEventListener('click', () => {
      el.querySelectorAll('#pt-type button').forEach(x => x.classList.remove('is-active'));
      b.classList.add('is-active');
      parityType = b.getAttribute('data-type');
      rebuild();
    }));
    msgInput.addEventListener('input', rebuild);
    el.querySelector('#pt-reset-btn').addEventListener('click', () => { receivedBits = sentBits.slice(); renderReceived(); checkParity(); });

    function rebuild() {
      const errorEl = el.querySelector('#pt-error');
      const msg = DLUtils.sanitizeBinary(msgInput.value);
      errorEl.innerHTML = '';
      if (!msg || msg !== msgInput.value.trim()) {
        errorEl.innerHTML = `<p class="tool-error">Enter a message using only 0s and 1s.</p>`;
        el.querySelector('#pt-sent').innerHTML = ''; el.querySelector('#pt-received').innerHTML = ''; el.querySelector('#pt-result').innerHTML = '';
        return;
      }
      const p = DLUtils.parityBit(msg, parityType);
      sentBits = (p + msg).split('');
      receivedBits = sentBits.slice();
      renderSent(msg, p);
      renderReceived();
      checkParity();
    }

    function renderSent(msg, p) {
      const bits = (p + msg).split('').map((b, i) => `<div class="bit ${b === '1' ? 'bit--one' : 'bit--zero'}${i === 0 ? ' bit--pos-marker' : ''}">${b}</div>`).join('');
      el.querySelector('#pt-sent').innerHTML = `<div class="bit-grid">${bits}</div><p class="tool-note">Leftmost dashed bit is the parity bit (<strong>${p}</strong>), chosen so the total number of 1s is ${parityType}.</p>`;
    }

    function renderReceived() {
      const bits = receivedBits.map((b, i) => `<button type="button" class="bit ${b === '1' ? 'bit--one' : 'bit--zero'}${i === 0 ? ' bit--pos-marker' : ''}${sentBits[i] !== receivedBits[i] ? ' bit--changed' : ''}" data-idx="${i}" style="cursor:pointer;"></button>`).join('');
      const container = el.querySelector('#pt-received');
      container.innerHTML = `<div class="bit-grid">${bits}</div>`;
      // set text content separately to avoid template-literal escaping headaches
      Array.from(container.querySelectorAll('.bit')).forEach((elm, i) => elm.textContent = receivedBits[i]);
      container.querySelectorAll('.bit').forEach(btn => btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-idx'), 10);
        receivedBits[i] = receivedBits[i] === '1' ? '0' : '1';
        btn.classList.add('bit--flash');
        renderReceived();
        checkParity();
      }));
    }

    function checkParity() {
      const resultEl = el.querySelector('#pt-result');
      const flippedCount = receivedBits.reduce((n, b, i) => n + (b !== sentBits[i] ? 1 : 0), 0);
      const received = receivedBits.join('');
      const ones = DLUtils.countOnes(received);
      const isOk = parityType === 'even' ? ones % 2 === 0 : ones % 2 === 1;
      if (flippedCount === 0) {
        resultEl.innerHTML = `<div class="tool-result-banner tool-result-banner--neutral">${ICONS.info}No bits flipped yet &mdash; click a bit above to simulate an error.</div>`;
        return;
      }
      if (!isOk) {
        resultEl.innerHTML = `<div class="tool-result-banner tool-result-banner--bad">${ICONS.warningTriangle}Parity check FAILS &mdash; error detected (${flippedCount} bit${flippedCount > 1 ? 's' : ''} flipped).</div>`;
      } else {
        resultEl.innerHTML = `<div class="tool-result-banner tool-result-banner--good">${ICONS.checkCircle}Parity check still PASSES, even though ${flippedCount} bit${flippedCount > 1 ? 's are' : ' is'} wrong! This is exactly parity's blind spot: an even number of flipped bits leaves the total 1-count &mdash; and so the parity &mdash; unchanged.</div>`;
      }
    }

    rebuild();
  }
};
