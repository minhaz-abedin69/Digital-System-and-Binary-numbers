/**
 * quizData.js
 * Chapter-wide multiple-choice quiz. Every answer is verified against the source chapter
 * and, where numeric, against js/utils.js (see the project README for how these were checked).
 */

const QUIZ_DATA = [
  { id: 'q1', topicId: 'digital-systems', question: `A binary digit ("bit") has exactly two possible values. What are they?`,
    options: ['0 and 1', '1 and 2', 'A and B', 'True and False'], correctIndex: 0,
    explanation: `The chapter defines a bit as a binary digit with two values: 0 and 1 — the foundation every other code in the chapter builds on.` },

  { id: 'q2', topicId: 'digital-systems', question: `Which of these is NOT one of the chapter's stated reasons commercial products use digital circuitry?`,
    options: ['Programmability — the same hardware can run many applications', 'Falling cost as transistor counts increase', 'Total immunity to every possible error', 'High operating speed'], correctIndex: 2,
    explanation: `The chapter says digital systems can achieve "extreme reliability by using error-correcting codes" — that's reliability through specific techniques, not a claim of total immunity to error.` },

  { id: 'q3', topicId: 'number-systems', question: `What is the base (radix) of the octal number system?`,
    options: ['2', '8', '10', '16'], correctIndex: 1,
    explanation: `"Octal" means base 8 — it uses digits 0 through 7.` },

  { id: 'q4', topicId: 'number-systems', question: `What decimal value does the hexadecimal digit F represent?`,
    options: ['10', '14', '15', '16'], correctIndex: 2,
    explanation: `Hex digits A–F stand for decimal 10–15, so F = 15, the largest single hex digit.` },

  { id: 'q5', topicId: 'number-conversion', question: `Convert 84 (decimal) to binary.`,
    options: ['01011000', '01010100', '01001010', '01100100'], correctIndex: 1,
    explanation: `84 = 64 + 16 + 4, so bits are set at those weight positions: 01010100.` },

  { id: 'q6', topicId: 'number-conversion', question: `What is 10110 (binary) in decimal?`,
    options: ['20', '22', '24', '26'], correctIndex: 1,
    explanation: `10110₂ = 16 + 4 + 2 = 22.` },

  { id: 'q7', topicId: 'number-conversion', question: `Each octal digit corresponds to exactly how many binary bits?`,
    options: ['2 bits', '3 bits', '4 bits', '5 bits'], correctIndex: 1,
    explanation: `Since 8 = 2³, every octal digit maps to a fixed group of exactly 3 binary bits.` },

  { id: 'q8', topicId: 'binary-complements', question: `What is the 1's complement of 1010111?`,
    options: ['0101000', '0101001', '0100111', '1010000'], correctIndex: 0,
    explanation: `1's complement flips every bit: 1010111 → 0101000.` },

  { id: 'q9', topicId: 'binary-complements', question: `When subtracting using 2's complement, what do you do with a carry out of the leftmost bit?`,
    options: ['Discard it', 'Add it back into the least-significant bit', 'Add it to the sign bit only', 'Double the result'], correctIndex: 0,
    explanation: `The 2's complement rule is simple: an end carry is just discarded, leaving the remaining bits as the answer.` },

  { id: 'q10', topicId: 'binary-complements', question: `When subtracting using 1's complement, what do you do with a carry out of the leftmost bit?`,
    options: ['Discard it completely', 'Add it back into the least-significant bit (end-around carry)', 'Flip the sign and stop', 'Add it to the most-significant bit'], correctIndex: 1,
    explanation: `1's complement uses the "end-around carry": remove the carry from the top, then add it back into the LSB.` },

  { id: 'q11', topicId: 'signed-numbers', question: `In 8-bit signed-magnitude, how is +9 represented?`,
    options: ['00001001', '11110110', '10001001', '00010010'], correctIndex: 0,
    explanation: `Sign bit 0 (positive) followed by 9 in 7-bit binary (0001001) gives 00001001.` },

  { id: 'q12', topicId: 'signed-numbers', question: `Which of the three signed conventions has only one representation of zero?`,
    options: ['Signed-magnitude', 'Signed-1\'s-complement', 'Signed-2\'s-complement', 'All three have only one zero'], correctIndex: 2,
    explanation: `Signed-magnitude and signed-1's-complement both have a redundant −0; signed-2's-complement does not, which is a big part of why hardware favors it.` },

  { id: 'q13', topicId: 'signed-numbers', question: `In 4-bit signed-2's-complement, which value can be represented even though it has no positive counterpart in the same 4 bits?`,
    options: ['−0', '−7', '−8', '−1'], correctIndex: 2,
    explanation: `2's complement can represent −8 (1000) in 4 bits, but +8 would need a 5th bit — a normal asymmetry of the 2's-complement range.` },

  { id: 'q14', topicId: 'binary-codes', question: `What is the Excess-3 code for the decimal digit 6?`,
    options: ['0110', '1001', '1010', '1100'], correctIndex: 1,
    explanation: `Excess-3 is BCD plus 3: BCD for 6 is 0110; 0110 + 0011 = 1001.` },

  { id: 'q15', topicId: 'binary-codes', question: `In BCD addition, when does a group need the +0110 (+6) correction?`,
    options: ['Every group, always', 'Only when that group\'s binary sum is 10 or more, or it produced a carry', 'Only on the units digit', 'BCD addition never needs correction'], correctIndex: 1,
    explanation: `The +6 correction fixes any 4-bit group that landed outside the valid BCD range (0–9) or generated a carry — not every group.` },

  { id: 'q16', topicId: 'binary-codes', question: `184 + 576 in BCD comes out to 760. How is 760 written in BCD?`,
    options: ['0111 0110 0000', '0111 0000 0110', '0110 0111 0000', '1000 0110 0000'], correctIndex: 0,
    explanation: `7 → 0111, 6 → 0110, 0 → 0000, giving 0111 0110 0000 — matching the chapter's worked example.` },

  { id: 'q17', topicId: 'ascii-code', question: `How many bits does the ASCII character code itself use, before any parity bit is added?`,
    options: ['6', '7', '8', '9'], correctIndex: 1,
    explanation: `ASCII is a 7-bit code; a parity bit, when used, is an extra 8th bit added on top.` },

  { id: 'q18', topicId: 'ascii-code', question: `How many distinct characters can 7-bit ASCII represent?`,
    options: ['64', '100', '128', '256'], correctIndex: 2,
    explanation: `2⁷ = 128 distinct codes — enough for uppercase and lowercase letters, digits, punctuation, and control characters.` },

  { id: 'q19', topicId: 'parity-bit', question: `A parity bit is chosen so that the message (plus the parity bit) has...`,
    options: ['All errors automatically corrected', 'A total count of 1s matching an agreed odd or even convention', 'Its length doubled', 'A fixed checksum value of zero'], correctIndex: 1,
    explanation: `That's the entire definition — parity just fixes whether the total number of 1s is odd or even, by design.` },

  { id: 'q20', topicId: 'parity-bit', question: `What is the key limitation of a simple parity bit?`,
    options: ['It can detect any number of bit errors', 'It can only reliably detect an odd number of bit errors — a 2-bit error can slip through undetected', 'It only works for text data', 'It can correct any single-bit error'], correctIndex: 1,
    explanation: `As the chapter's worked example shows (11011 → 10111), a 2-bit flip leaves the 1-count — and therefore the parity — unchanged, so it goes undetected.` },

  { id: 'q21', topicId: 'hamming-code', question: `In Hamming(7,4), where are the parity bits placed within the codeword?`,
    options: ['At the very start and end of the word', 'At positions that are powers of 2 (1, 2, 4, …)', 'Scattered randomly', 'Only at the leftmost bit'], correctIndex: 1,
    explanation: `Parity bits sit at positions 1, 2, and 4 — each power of 2 — while data bits fill the remaining positions (3, 5, 6, 7).` },

  { id: 'q22', topicId: 'hamming-code', question: `Which formula relates the number of data bits (m) and redundant/parity bits (r) in Hamming code?`,
    options: ['r = m', '2ʳ ≥ m + r + 1', 'r = 2m', 'm ≥ 2ʳ'], correctIndex: 1,
    explanation: `This is the chapter's defining formula — for m = 4, r = 3 is the smallest value that satisfies 2³ ≥ 4 + 3 + 1.` },

  { id: 'q23', topicId: 'hamming-code', question: `If the Hamming syndrome (P₃P₂P₁, wrong=1/correct=0) comes out as binary 000, what does that mean?`,
    options: ['Bit position 1 is wrong', 'No error was detected', 'Every bit is wrong', 'The codeword is automatically invalid'], correctIndex: 1,
    explanation: `A syndrome of 000 (decimal 0) is the "no error at this position" case — there's no bit to flip.` },

  { id: 'q24', topicId: 'gray-code', question: `What is the defining property of Gray code?`,
    options: ['Every codeword has the same number of 1s', 'Consecutive values differ in exactly one bit', 'It is always exactly 8 bits wide', 'It can represent negative numbers directly'], correctIndex: 1,
    explanation: `That single-bit-change guarantee between any two consecutive values is the entire reason Gray code exists.` },

  { id: 'q25', topicId: 'gray-code', question: `Convert binary 1110 to Gray code.`,
    options: ['1000', '1001', '1010', '0111'], correctIndex: 1,
    explanation: `Copy the MSB (1), then XOR each adjacent pair: 1⊕1=0, 1⊕1=0, 1⊕0=1 — giving 1001.` },

  { id: 'q26', topicId: 'logic-vs-arithmetic', question: `In binary LOGIC (as opposed to binary arithmetic), what does 1 + 1 evaluate to?`,
    options: ['10', '0', '1', '11'], correctIndex: 2,
    explanation: `In logic, "+" denotes OR: 1 OR 1 is still 1. (In arithmetic, 1 + 1 = 10, which is decimal 2 written in binary.)` }
];
