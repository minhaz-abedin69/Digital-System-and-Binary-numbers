/**
 * hammingTool.js — Topic 9 (Hamming Code)
 * Encode 4 data bits into a 7-bit Hamming codeword, inject a single-bit error anywhere,
 * then compute the syndrome to locate and correct it.
 */
window.Tools = window.Tools || {};
Tools.hammingTool = {
  mount(el) {
    el.innerHTML = `
      <div class="tool-panel__section-title">Step 1 &middot; Choose 4 data bits</div>
      <div class="tool-flow-row" id="hm-data-bits"></div>
      <div id="hm-encode-steps" style="margin-top:.9rem;"></div>

      <div class="tool-panel__section">
        <div class="tool-panel__section-title">Step 2 &middot; Codeword (positions 7 &rarr; 1)</div>
        <div class="tool-flow-row" id="hm-codeword-caption"></div>
        <div class="tool-flow-row" id="hm-codeword" style="margin-top:.25rem;"></div>
        <p class="tool-note">Click any bit above to flip it &mdash; simulating a single-bit transmission error &mdash; then check the result below.</p>
      </div>

      <div class="tool-panel__section">
        <div class="tool-panel__section-title">Step 3 &middot; Receiver checks parity &amp; corrects</div>
        <div id="hm-syndrome"></div>
        <div id="hm-verdict" style="margin-top:.7rem;"></div>
      </div>`;

    const dataBitsEl = el.querySelector('#hm-data-bits');
    let data = ['1', '1', '0', '0']; // D4 D3 D2 D1
    let errorPos = 0; // 0 = no error, else 1-7

    function renderDataBits() {
      const labels = ['D4', 'D3', 'D2', 'D1'];
      dataBitsEl.innerHTML = data.map((b, i) => `
        <div style="text-align:center;">
          <button type="button" class="bit ${b === '1' ? 'bit--one' : 'bit--zero'}" data-i="${i}">${b}</button>
          <div class="bit-caption" style="width:auto;margin-top:.25rem;">${labels[i]}</div>
        </div>`).join('');
      dataBitsEl.querySelectorAll('.bit').forEach(btn => btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-i'), 10);
        data[i] = data[i] === '1' ? '0' : '1';
        errorPos = 0;
        renderDataBits();
        recompute();
      }));
    }

    function encode() {
      const [d4, d3, d2, d1] = data;
      const p1 = DLUtils.parityBit([d4, d2, d1].join(''), 'even');
      const p2 = DLUtils.parityBit([d4, d3, d1].join(''), 'even');
      const p3 = DLUtils.parityBit([d4, d3, d2].join(''), 'even');
      // codeword string indexed left-to-right as position 7,6,5,4,3,2,1
      const codeword = [d4, d3, d2, p3, d1, p2, p1].join('');
      return { codeword, p1, p2, p3 };
    }

    function recompute() {
      const { codeword, p1, p2, p3 } = encode();
      el.querySelector('#hm-encode-steps').innerHTML = `<div class="tool-steps">
        <div class="tool-step-row"><span class="tool-step-row__tag">P1 &larr; pos 1,3,5,7</span><span>D4&oplus;D2&oplus;D1 = ${data[0]}&oplus;${data[2]}&oplus;${data[3]} &rarr; P1 = ${p1}</span></div>
        <div class="tool-step-row"><span class="tool-step-row__tag">P2 &larr; pos 2,3,6,7</span><span>D4&oplus;D3&oplus;D1 = ${data[0]}&oplus;${data[1]}&oplus;${data[3]} &rarr; P2 = ${p2}</span></div>
        <div class="tool-step-row"><span class="tool-step-row__tag">P3 &larr; pos 4,5,6,7</span><span>D4&oplus;D3&oplus;D2 = ${data[0]}&oplus;${data[1]}&oplus;${data[2]} &rarr; P3 = ${p3}</span></div>
      </div>`;

      const positions = [7, 6, 5, 4, 3, 2, 1];
      const roleLabels = { 7: 'D4', 6: 'D3', 5: 'D2', 4: 'P3', 3: 'D1', 2: 'P2', 1: 'P1' };
      el.querySelector('#hm-codeword-caption').innerHTML = positions.map(p => `<div class="bit-caption" style="width:2.05rem;">${roleLabels[p]}<br>pos ${p}</div>`).join('');

      const received = codeword.split('').map((b, i) => (positions[i] === errorPos ? (b === '1' ? '0' : '1') : b));
      el.querySelector('#hm-codeword').innerHTML = received.map((b, i) => `<button type="button" class="bit ${b === '1' ? 'bit--one' : 'bit--zero'}${positions[i] === errorPos ? ' bit--changed' : ''}" data-pos="${positions[i]}">${b}</button>`).join('');
      el.querySelector('#hm-codeword').querySelectorAll('.bit').forEach(btn => btn.addEventListener('click', () => {
        const pos = parseInt(btn.getAttribute('data-pos'), 10);
        errorPos = errorPos === pos ? 0 : pos;
        recompute();
      }));

      // syndrome from received bits
      const at = pos => received[positions.indexOf(pos)];
      const s1 = DLUtils.parityBit([at(1), at(3), at(5), at(7)].join(''), 'even');
      const s2 = DLUtils.parityBit([at(2), at(3), at(6), at(7)].join(''), 'even');
      const s3 = DLUtils.parityBit([at(4), at(5), at(6), at(7)].join(''), 'even');
      const syndromeDec = parseInt(`${s3}${s2}${s1}`, 2);

      el.querySelector('#hm-syndrome').innerHTML = `<div class="tool-steps">
        <div class="tool-step-row${s1 === '1' ? ' is-bad' : ' is-good'}"><span class="tool-step-row__tag">P1 (1,3,5,7)</span><span>${s1 === '1' ? 'wrong' : 'correct'}</span></div>
        <div class="tool-step-row${s2 === '1' ? ' is-bad' : ' is-good'}"><span class="tool-step-row__tag">P2 (2,3,6,7)</span><span>${s2 === '1' ? 'wrong' : 'correct'}</span></div>
        <div class="tool-step-row${s3 === '1' ? ' is-bad' : ' is-good'}"><span class="tool-step-row__tag">P3 (4,5,6,7)</span><span>${s3 === '1' ? 'wrong' : 'correct'}</span></div>
        <div class="tool-step-row"><span class="tool-step-row__tag">Syndrome P3P2P1</span><span class="mono">${s3}${s2}${s1} = ${syndromeDec}</span></div>
      </div>`;

      const verdictEl = el.querySelector('#hm-verdict');
      if (syndromeDec === 0) {
        verdictEl.innerHTML = `<div class="tool-result-banner tool-result-banner--good">${ICONS.checkCircle}Syndrome is 0 &mdash; no error detected. Codeword accepted as-is.</div>`;
      } else {
        const correctedBit = received[positions.indexOf(syndromeDec)] === '1' ? '0' : '1';
        const correctedCodeword = received.slice();
        correctedCodeword[positions.indexOf(syndromeDec)] = correctedBit;
        const matches = correctedCodeword.join('') === codeword;
        verdictEl.innerHTML = `<div class="tool-result-banner ${matches ? 'tool-result-banner--good' : 'tool-result-banner--bad'}">${matches ? ICONS.checkCircle : ICONS.warningTriangle}Error located at position ${syndromeDec}. Flipping it gives <span class="mono">${correctedCodeword.join('')}</span>${matches ? ' — matching the original codeword.' : '.'}</div>`;
      }
    }

    renderDataBits();
    recompute();
  }
};
