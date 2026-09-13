/**
 * asciiTool.js — Topic 7 (ASCII Character Code)
 * Encode text to 7-bit ASCII (+ optional parity), or decode a binary stream back to text.
 */
window.Tools = window.Tools || {};
Tools.asciiTool = {
  mount(el) {
    el.innerHTML = `
      <div class="segmented" id="at-direction">
        <button data-dir="encode" class="is-active" type="button">Encode text &rarr; binary</button>
        <button data-dir="decode" type="button">Decode binary &rarr; text</button>
      </div>
      <div class="tool-divider"></div>
      <div id="at-encode-panel">
        <label class="field-label" for="at-text">Text to encode</label>
        <textarea class="ascii-io" id="at-text">Steve</textarea>
        <div class="input-row" style="margin-top:.7rem;">
          <div class="input-group" style="flex:0 0 auto;">
            <label class="field-label">Parity bit</label>
            <div class="segmented" id="at-parity">
              <button data-parity="none" class="is-active" type="button">None</button>
              <button data-parity="even" type="button">Even</button>
              <button data-parity="odd" type="button">Odd</button>
            </div>
          </div>
        </div>
        <div id="at-chips"></div>
        <div class="tool-panel__section">
          <div class="tool-panel__section-title">Combined bitstream</div>
          <textarea class="ascii-io" id="at-encoded-output" readonly></textarea>
        </div>
      </div>
      <div id="at-decode-panel" style="display:none;">
        <label class="field-label" for="at-binary">Binary (7 or 8 bits per character, space-separated)</label>
        <textarea class="ascii-io" id="at-binary">1010011 1110100 1100101 1110110 1100101 0100000 1001010 1101111 1100010 1110011</textarea>
        <div id="at-decode-error"></div>
        <div class="tool-panel__section">
          <div class="tool-panel__section-title">Decoded text</div>
          <div class="tool-output-card tool-output-card--accent"><div class="tool-output-card__value" id="at-decoded-output" style="font-family:var(--font-sans);font-size:1.05rem;"></div></div>
        </div>
      </div>`;

    let direction = 'encode', parity = 'none';
    const encodePanel = el.querySelector('#at-encode-panel');
    const decodePanel = el.querySelector('#at-decode-panel');

    el.querySelectorAll('#at-direction button').forEach(b => b.addEventListener('click', () => {
      el.querySelectorAll('#at-direction button').forEach(x => x.classList.remove('is-active'));
      b.classList.add('is-active');
      direction = b.getAttribute('data-dir');
      encodePanel.style.display = direction === 'encode' ? 'block' : 'none';
      decodePanel.style.display = direction === 'decode' ? 'block' : 'none';
      if (direction === 'encode') updateEncode(); else updateDecode();
    }));
    el.querySelectorAll('#at-parity button').forEach(b => b.addEventListener('click', () => {
      el.querySelectorAll('#at-parity button').forEach(x => x.classList.remove('is-active'));
      b.classList.add('is-active');
      parity = b.getAttribute('data-parity');
      updateEncode();
    }));
    el.querySelector('#at-text').addEventListener('input', updateEncode);
    el.querySelector('#at-binary').addEventListener('input', updateDecode);

    function updateEncode() {
      const text = el.querySelector('#at-text').value;
      const chipsEl = el.querySelector('#at-chips');
      const outEl = el.querySelector('#at-encoded-output');
      if (!text) { chipsEl.innerHTML = ''; outEl.value = ''; return; }
      const chars = text.split('');
      const codes = chars.map(ch => {
        const base = DLUtils.charToAscii7(ch);
        if (parity === 'none') return { ch, bits: base, p: null };
        const p = DLUtils.parityBit(base, parity);
        return { ch, bits: p + base, p };
      });
      chipsEl.innerHTML = `<div class="char-chip-row">${codes.map(c => `
        <div class="char-chip">
          <span class="char-chip__char">${c.ch === ' ' ? '␣' : DLUtils.escapeHtml(c.ch)}</span>
          <span class="char-chip__bits">${c.bits}</span>
          ${c.p !== null ? `<span class="char-chip__parity">parity ${c.p}</span>` : ''}
        </div>`).join('')}</div>`;
      outEl.value = codes.map(c => c.bits).join(' ');
    }

    function updateDecode() {
      const raw = el.querySelector('#at-binary').value.trim();
      const errorEl = el.querySelector('#at-decode-error');
      const outEl = el.querySelector('#at-decoded-output');
      errorEl.innerHTML = '';
      if (!raw) { outEl.textContent = ''; return; }
      const groups = raw.split(/\s+/);
      const bad = groups.filter(g => !/^[01]{7,8}$/.test(g));
      if (bad.length) { errorEl.innerHTML = `<p class="tool-error">Each group should be 7 or 8 bits of 0s and 1s, separated by spaces.</p>`; outEl.textContent = ''; return; }
      const text = groups.map(g => {
        const sevenBits = g.length === 8 ? g.slice(1) : g; // drop a leading parity bit if present
        return DLUtils.ascii7ToChar(sevenBits);
      }).join('');
      outEl.textContent = text;
    }

    updateEncode();
    updateDecode();
  }
};
