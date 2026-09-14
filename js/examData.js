/**
 * examData.js
 * Midterm exam questions transcribed from the uploaded PDF (International Islamic
 * University Chittagong, CSE-2323 Digital Logic Design), grouped by sitting exactly
 * as they appear in the source. Every numeric/logical answer here was independently
 * verified with small scripts before being written in (see project notes) — Hamming
 * syndromes, BCD addition, the full-adder-from-half-adders identity, and the NAND/NOR
 * universal-gate constructions were all checked against their full truth tables.
 *
 * Each question's `answer` is an array of the same block types used in data.js
 * (p, list, table, formula, example, note, definition) — reusing App's existing
 * renderBlocks() so no new rendering code is needed.
 */

const EXAM_DATA = {
  intro: `Sixteen questions, pulled directly from five real midterm sittings of CSE-2323 (Digital Logic Design) at IIUC. Browse by exam, or search for a topic — click any question to reveal a full worked answer.`,
  papers: [
    {
      id: 'p1', title: 'Mid Term Examination', term: 'Spring 2025',
      questions: [
        {
          id: 'p1-q1a', label: '1.a', marks: 5, clo: 'CLO1',
          question: `What do you mean by Parity code? If you receive a hamming code '1101110' with even parity then detect and correct the error.`,
          answer: [
            { type: 'definition', term: 'Parity code', text: `A parity bit is one extra bit added to a message so that the total number of 1s in the message (including that bit) comes out to an agreed value — even or odd. The receiver recounts the 1s; if the count no longer matches, at least one bit was corrupted in transit.` },
            { type: 'p', text: `Received Hamming codeword: **1101110** (7 bits, even parity). Using the standard layout **D4 D3 D2 P3 D1 P2 P1** at positions 7→1:` },
            { type: 'table', caption: 'Received bits by position', headers: ['Position', '7 (D4)', '6 (D3)', '5 (D2)', '4 (P3)', '3 (D1)', '2 (P2)', '1 (P1)'], rows: [['Bit', '1', '1', '0', '1', '1', '1', '0']] },
            { type: 'example', title: 'Locate and correct the error', given: `Check each parity group for even parity (P1→1,3,5,7 · P2→2,3,6,7 · P3→4,5,6,7)`, steps: [
              { label: 'P1 group (positions 1,3,5,7)', detail: `0+1+0+1 = 2 ones → even → correct` },
              { label: 'P2 group (positions 2,3,6,7)', detail: `1+1+1+1 = 4 ones → even → correct` },
              { label: 'P3 group (positions 4,5,6,7)', detail: `1+0+1+1 = 3 ones → odd → WRONG` },
              { label: 'Build the syndrome (wrong=1, correct=0), read as P3 P2 P1', detail: `1 0 0 = binary 100 = decimal 4 → error is at position 4` },
              { label: 'Flip the bit at position 4', detail: `Position 4 was 1 → flip to 0` }
            ], answer: `Corrected codeword: 1100110 → data bits D4D3D2D1 = **1101**.` },
            { type: 'note', variant: 'tip', title: 'Double-check', text: `Encoding 1101 from scratch with even parity independently gives the same codeword, 1100110 — confirming the correction.` }
          ]
        },
        {
          id: 'p1-q1b', label: '1.b', marks: 5, clo: 'CLO2',
          question: `Write down the half adder's truth table and its output Equation. and use AOI gates to implement it. Afterward, change AOI to NAND gates.`,
          answer: [
            { type: 'p', text: `A half adder adds two single bits, A and B, producing a **Sum** and a **Carry** — but with no carry-*in*, since it's meant to be the simplest possible adder building block.` },
            { type: 'table', caption: 'Half adder truth table', headers: ['A', 'B', 'Sum', 'Carry'], rows: [['0', '0', '0', '0'], ['0', '1', '1', '0'], ['1', '0', '1', '0'], ['1', '1', '0', '1']] },
            { type: 'formula', text: `Sum = A′B + AB′ = A ⊕ B      Carry = AB` },
            { type: 'p', text: `**AOI (AND-OR-Inverter) implementation:** invert A and B to get A′ and B′, AND them crosswise, then OR the results for the Sum; AND the original A and B directly for the Carry.` },
            { type: 'list', ordered: true, items: [
              `Inverter 1: A → A′.  Inverter 2: B → B′.`,
              `AND gate 1: A′ · B.  AND gate 2: A · B′.`,
              `OR gate: (A′·B) + (A·B′) = **Sum**.`,
              `AND gate 3: A · B = **Carry** (no inverters needed here).`
            ]},
            { type: 'p', text: `**Converting to all-NAND gates** — since NAND alone is a universal gate, the same half adder can be built from five NAND gates:` },
            { type: 'table', caption: 'Five-NAND half adder (verified against the full truth table)', headers: ['Gate', 'Inputs', 'Expression'], rows: [
              ['N1', 'A, B', "N1 = NAND(A, B) = (AB)′"],
              ['N2', 'A, N1', "N2 = NAND(A, N1)"],
              ['N3', 'B, N1', "N3 = NAND(B, N1)"],
              ['N4 (Sum)', 'N2, N3', "Sum = NAND(N2, N3) = A ⊕ B"],
              ['N5 (Carry)', 'N1, N1', "Carry = NAND(N1, N1) = (N1)′ = AB"]
            ]},
            { type: 'note', variant: 'info', title: 'Why N1 tied to itself gives the Carry', text: `NAND-ing any signal with itself just inverts it: NAND(N1,N1) = N1′. Since N1 = (AB)′, inverting it again gives back AB — exactly the Carry, using the same N1 signal already computed for the Sum path.` }
          ]
        }
      ]
    },
    {
      id: 'p2', title: 'Mid Term Examination', term: 'Spring 2023',
      questions: [
        {
          id: 'p2-q1a', label: '1.a', marks: 2,
          question: `Write down the advantages of digital systems over analog systems with proper example.`,
          answer: [
            { type: 'list', items: [
              `**Noise immunity** — a digital circuit only has to tell 0 from 1, so small amounts of noise rarely change the result; an analog circuit must preserve an exact continuous value, so any noise directly distorts it.`,
              `**Perfect reproducibility** — copying digital data (files, digital audio) produces an identical copy every time; copying analog media (e.g. a cassette tape) loses quality with every generation.`,
              `**Programmability** — the same digital hardware can run completely different tasks by changing software, instead of redesigning the physical circuit.`,
              `**Easy, stable storage** — digital data survives indefinitely in memory/storage with no degradation, unlike analog storage media, which physically wear out.`
            ]},
            { type: 'note', variant: 'tip', title: 'Example', text: `A digital audio file (like an MP3) can be copied a million times with zero quality loss, while a cassette tape loses fidelity — added hiss and dropouts — every time it's played or copied.` }
          ]
        },
        {
          id: 'p2-q1b', label: '1.b', marks: 2,
          question: `Define redundancy theorem with proper example.`,
          answer: [
            { type: 'definition', term: 'Redundancy theorem (consensus theorem)', text: `For any Boolean variables A, B, C: **AB + A′C + BC = AB + A′C**. The third term, BC — called the "consensus" of AB and A′C — is redundant and can always be eliminated without changing the function.` },
            { type: 'example', title: 'Why BC is redundant', given: `F = AB + A′C + BC`, steps: [
              { label: 'Case A = 1', detail: `F = B + 0 + BC = B(1 + C) = B — matches AB + A′C, which also reduces to B when A=1` },
              { label: 'Case A = 0', detail: `F = 0 + C + BC = C(1 + B) = C — matches AB + A′C, which also reduces to C when A=0` }
            ], answer: `Either way, BC never changes the outcome — it's already covered by the other two terms, so F = AB + A′C.` }
          ]
        },
        {
          id: 'p2-q1c', label: '1.c', marks: 2,
          question: `Define Positive and negative logic with truth table.`,
          answer: [
            { type: 'definition', term: 'Positive logic', text: `The higher of the two voltage levels (H) is assigned logic 1, and the lower level (L) is assigned logic 0.` },
            { type: 'definition', term: 'Negative logic', text: `The assignment is flipped: the higher voltage level (H) is assigned logic 0, and the lower level (L) is assigned logic 1.` },
            { type: 'table', caption: 'The same physical gate, read two ways', headers: ['Input 1', 'Input 2', 'Physical output', 'Positive logic reads as', 'Negative logic reads as'], rows: [
              ['L', 'L', 'L', '0 AND 0 = 0', '1 OR 1 = 1'],
              ['L', 'H', 'L', '0 AND 1 = 0', '1 OR 0 = 1'],
              ['H', 'L', 'L', '1 AND 0 = 0', '0 OR 1 = 1'],
              ['H', 'H', 'H', '1 AND 1 = 1', '0 OR 0 = 0']
            ]},
            { type: 'note', variant: 'info', title: 'The key takeaway', text: `The exact same physical circuit behaves as an AND gate under positive logic and as an OR gate under negative logic. Which logical function you "see" depends entirely on which voltage level you decide means 1.` }
          ]
        },
        {
          id: 'p2-q1d', label: '1.d', marks: null,
          question: `"Excess-3 code is self-complementary code." Is it true or false? Justify your comment.`,
          answer: [
            { type: 'p', text: `**True.** A code is self-complementary when the code for a digit's 9's-complement (9 − N) is simply the bitwise (1's) complement of that digit's own code — no re-lookup needed.` },
            { type: 'table', caption: 'Excess-3: digit N vs. digit (9−N)', headers: ['Digit N', 'Excess-3(N)', '1\'s complement of Excess-3(N)', 'Digit (9−N)', 'Excess-3(9−N)', 'Match?'], rows: [
              ['0', '0011', '1100', '9', '1100', 'Yes'],
              ['3', '0110', '1001', '6', '1001', 'Yes'],
              ['4', '0111', '1000', '5', '1000', 'Yes']
            ]},
            { type: 'note', variant: 'tip', title: 'Why this works', text: `Excess-3 is ordinary BCD shifted up by 3. That +3 offset is exactly what centers the code range so that complementing every bit lands on the 9's-complement digit — this is the whole reason Excess-3 was designed the way it was.` }
          ]
        },
        {
          id: 'p2-q1e', label: '1.e', marks: 3,
          question: `Compare between BCD Code and Binary numbers. Mentioned the rules applied for BCD Addition.`,
          answer: [
            { type: 'table', caption: 'BCD vs. pure binary', headers: ['', 'BCD', 'Pure Binary'], rows: [
              ['Encodes', 'Each decimal digit separately, as its own 4-bit group', 'The whole number as one continuous binary value'],
              ['Code space used', '10 of 16 possible 4-bit patterns (0000–1001); 1010–1111 never appear', 'All patterns are valid — none wasted'],
              ['Decimal I/O', 'Direct — each group maps to one displayed digit', 'Needs conversion before it can be shown as decimal'],
              ['Addition', 'Needs a correction step (below) when a group goes invalid', 'Plain binary addition, no correction needed']
            ]},
            { type: 'p', text: `**Rules for BCD addition:** add each 4-bit digit group as ordinary binary (including any carry from the group to its right). If a group's result is 10 or more, or the group addition produced a carry, add **0110 (6)** to correct that group back into valid BCD range, and carry 1 into the next group.` }
          ]
        },
        {
          id: 'p2-q1f', label: '1.f', marks: 1,
          question: `Just one lines, write down the limitations of BCD Addition.`,
          answer: [
            { type: 'p', text: `BCD addition needs an extra +6 correction step whenever a digit group is invalid or carries, making it slower and more complex in hardware than plain binary addition, while also wasting 6 of every 16 possible 4-bit patterns.` }
          ]
        }
      ]
    },
    {
      id: 'p3', title: 'Mid Term Examination', term: 'Autumn 2023',
      questions: [
        {
          id: 'p3-q1a', label: '1.a', marks: 3,
          question: `Mention the limitations of BCD addition. Define 'Stuck at 0' and 'Stuck at 1'. What are the unique property of Excess-3 code?`,
          answer: [
            { type: 'p', text: `**Limitations of BCD addition:** it requires a +6 correction step on any digit group ≥ 10 or that carries, adds extra hardware/time versus plain binary addition, and 6 of the 16 possible 4-bit codes per group are never used (wasted).` },
            { type: 'definition', term: 'Stuck-at-0 fault', text: `A fault model where a specific signal line is permanently fixed at logic 0 — it can never rise to 1, no matter what the circuit's actual inputs call for.` },
            { type: 'definition', term: 'Stuck-at-1 fault', text: `The mirror image: a signal line permanently fixed at logic 1, unable to ever fall to 0.` },
            { type: 'p', text: `**Unique property of Excess-3:** it's **self-complementary** — the 9's-complement of any digit is obtained just by flipping every bit of that digit's code (see the worked example in the Spring-2023 paper above), which makes it convenient for decimal subtraction via complements.` }
          ]
        },
        {
          id: 'p3-q1b', label: '1.b', marks: 5,
          question: `Verify whether 7421 & 3321 are self-complementary code or not. Define the steps associated for converting Binary to Gray code conversion with proper example. Describe Hamming code with proper example.`,
          answer: [
            { type: 'heading', level: 3, id: 'p3q1b-selfcomp', text: `Part 1 — Is 7421 / 3321 self-complementary?` },
            { type: 'formula', text: `A weighted BCD-style code is self-complementary if and only if its weights sum to 9.`, note: `This is the standard quick test — e.g. it correctly confirms 2421 (2+4+2+1=9) and rules out plain 8421 BCD (8+4+2+1=15≠9).` },
            { type: 'table', caption: 'Applying the weight-sum test', headers: ['Code', 'Weights', 'Sum', 'Self-complementary?'], rows: [
              ['7421', '7, 4, 2, 1', '14', 'No — 14 ≠ 9'],
              ['3321', '3, 3, 2, 1', '9', 'Yes — 9 = 9']
            ]},
            { type: 'heading', level: 3, id: 'p3q1b-graysteps', text: `Part 2 — Binary → Gray code, step by step` },
            { type: 'list', ordered: true, items: [
              `The MSB of the binary number becomes the MSB of the Gray code, unchanged.`,
              `XOR each pair of adjacent binary bits to get every following Gray bit, moving left to right.`
            ]},
            { type: 'example', title: 'Convert binary 1011 to Gray code', given: `1011`, steps: [
              { label: 'Copy the MSB', detail: `1` },
              { label: 'bit2 = binary-bit1 ⊕ binary-bit2', detail: `1 ⊕ 0 = 1` },
              { label: 'bit3 = binary-bit2 ⊕ binary-bit3', detail: `0 ⊕ 1 = 1` },
              { label: 'bit4 = binary-bit3 ⊕ binary-bit4', detail: `1 ⊕ 1 = 0` }
            ], answer: `Gray code = 1110` },
            { type: 'heading', level: 3, id: 'p3q1b-hamming', text: `Part 3 — Hamming code, with example` },
            { type: 'p', text: `Hamming code adds r redundant parity bits (placed at positions 1, 2, 4, 8, …) to m data bits so that 2ʳ ≥ m+r+1. Each parity bit checks a specific, overlapping set of positions; if a single bit gets corrupted, the pattern of failed checks — the syndrome — points to the exact bad position, letting the receiver flip it back.` },
            { type: 'p', text: `**Example:** data 1100 encodes to codeword **1100001** (worked in full in the Hamming Code topic of this site). If it's received as 1100101, the syndrome comes out to decimal 3, correctly locating and fixing the flipped bit.` }
          ]
        },
        {
          id: 'p3-q1c', label: '1.c', marks: 2,
          question: `If received hamming code is 1110101 with even parity then detect and correct error.`,
          answer: [
            { type: 'p', text: `Received: **1110101**. Positions 7→1 (D4 D3 D2 P3 D1 P2 P1): 1 1 1 0 1 0 1.` },
            { type: 'example', title: 'Syndrome check', given: `Even parity, groups P1(1,3,5,7) · P2(2,3,6,7) · P3(4,5,6,7)`, steps: [
              { label: 'P1 group', detail: `1+1+1+1 = 4 ones → even → correct` },
              { label: 'P2 group', detail: `0+1+1+1 = 3 ones → odd → WRONG` },
              { label: 'P3 group', detail: `0+1+1+1 = 3 ones → odd → WRONG` },
              { label: 'Syndrome P3 P2 P1', detail: `1 1 0 = binary 110 = decimal 6 → error at position 6` },
              { label: 'Flip position 6', detail: `Position 6 (D3) was 1 → flip to 0` }
            ], answer: `Corrected codeword: 1010101 → original data D4D3D2D1 = **1011**.` }
          ]
        }
      ]
    },
    {
      id: 'p4', title: 'Mid Term Special Examination', term: 'Autumn 2025',
      questions: [
        {
          id: 'p4-q1a', label: '1.a', marks: 5, clo: 'CLO1',
          question: `Design basic gates (AND, OR, NOT) using only NAND and NOR gates. Show the necessary truth tables, circuit diagrams, and Boolean equations.`,
          answer: [
            { type: 'p', text: `NAND and NOR are each, on their own, **universal gates** — every other basic gate can be built from just one type, repeated.` },
            { type: 'heading', level: 3, id: 'p4q1a-nand', text: `Using only NAND gates` },
            { type: 'table', caption: 'NAND-only constructions (verified against all input combinations)', headers: ['Gate', 'Construction', 'Why it works'], rows: [
              ['NOT(A)', 'NAND(A, A)', "(A·A)′ = A′ — tying both inputs together just inverts"],
              ['AND(A,B)', 'NAND( NAND(A,B), NAND(A,B) )', "Inverting a NAND output undoes the inversion: ((AB)′)′ = AB"],
              ['OR(A,B)', 'NAND( NOT(A), NOT(B) )', "NAND(A′,B′) = (A′B′)′ = A+B, by De Morgan's theorem"]
            ]},
            { type: 'heading', level: 3, id: 'p4q1a-nor', text: `Using only NOR gates` },
            { type: 'table', caption: 'NOR-only constructions (verified against all input combinations)', headers: ['Gate', 'Construction', 'Why it works'], rows: [
              ['NOT(A)', 'NOR(A, A)', "(A+A)′ = A′"],
              ['OR(A,B)', 'NOR( NOR(A,B), NOR(A,B) )', "Inverting a NOR output undoes the inversion: ((A+B)′)′ = A+B"],
              ['AND(A,B)', 'NOR( NOT(A), NOT(B) )', "NOR(A′,B′) = (A′+B′)′ = AB, by De Morgan's theorem"]
            ]},
            { type: 'table', caption: 'Truth table — every construction above matches the target gate exactly', headers: ['A', 'B', 'AND', 'OR', 'NOT A'], rows: [
              ['0', '0', '0', '0', '1'], ['0', '1', '0', '1', '1'], ['1', '0', '0', '1', '0'], ['1', '1', '1', '1', '0']
            ]},
            { type: 'note', variant: 'info', title: 'On the circuit diagrams', text: `Each construction above is drawn by literally chaining the named gates in that order — e.g. AND-from-NAND is two NAND gates in a row (a NAND gate feeding both inputs of a second NAND gate). The Boolean equations and truth table fully specify each circuit.` }
          ]
        },
        {
          id: 'p4-q1b', label: '1.b', marks: 5, clo: 'CLO2',
          question: `Design a Full Adder circuit using two Half-Adders and An OR gate and Explain how the Sum and Carry-Out functions of a Full Adder are derived using the XOR operation.`,
          answer: [
            { type: 'p', text: `A full adder extends the half adder by also accepting a **carry-in (Cin)**, so multi-bit numbers can be added column by column. It's built from exactly two half adders plus one OR gate.` },
            { type: 'list', ordered: true, items: [
              `**Half adder 1** takes the two primary inputs A and B, producing S1 = A ⊕ B and C1 = AB.`,
              `**Half adder 2** takes S1 and Cin, producing the final **Sum** = S1 ⊕ Cin, and C2 = S1 · Cin.`,
              `An **OR gate** combines the two carry outputs: **Cout** = C1 + C2.`
            ]},
            { type: 'formula', text: `Sum = (A ⊕ B) ⊕ Cin = A ⊕ B ⊕ Cin        Cout = AB + (A ⊕ B)Cin` },
            { type: 'table', caption: 'Full adder truth table (all 8 combinations verified against the formulas above)', headers: ['A', 'B', 'Cin', 'Sum', 'Cout'], rows: [
              ['0', '0', '0', '0', '0'], ['0', '0', '1', '1', '0'], ['0', '1', '0', '1', '0'], ['0', '1', '1', '0', '1'],
              ['1', '0', '0', '1', '0'], ['1', '0', '1', '0', '1'], ['1', '1', '0', '0', '1'], ['1', '1', '1', '1', '1']
            ]},
            { type: 'note', variant: 'tip', title: 'Where the XOR comes in', text: `The Sum is built entirely from two chained XORs — first A⊕B inside half adder 1, then XORed again with Cin inside half adder 2 — which is exactly why the closed-form Sum equation is a 3-input XOR, A⊕B⊕Cin.` }
          ]
        }
      ]
    },
    {
      id: 'p5', title: 'Mid Term Special Examination', term: 'Spring 2026',
      questions: [
        {
          id: 'p5-q1a', label: '1.a', marks: 5, clo: 'CLO1',
          question: `I. A 4-bit data word D = 1011 is to be transmitted using Hamming code. Construct the Hamming code word using even parity. II. Suppose the received code is 1010011. Detect whether an error has occurred. If yes, locate the error bit position. Correct the code and determine the original data word.`,
          answer: [
            { type: 'heading', level: 3, id: 'p5q1a-construct', text: `Part I — Construct the codeword for D = 1011` },
            { type: 'example', title: 'Encoding D4D3D2D1 = 1,0,1,1', given: `Positions 7→1: D4 D3 D2 P3 D1 P2 P1`, steps: [
              { label: 'P1 (checks 1,3,5,7 → P1,D1,D2,D4)', detail: `D4⊕D2⊕D1 = 1⊕1⊕1 = 1 (odd) → P1 = 1` },
              { label: 'P2 (checks 2,3,6,7 → P2,D1,D3,D4)', detail: `D4⊕D3⊕D1 = 1⊕0⊕1 = 0 (even) → P2 = 0` },
              { label: 'P3 (checks 4,5,6,7 → P3,D2,D3,D4)', detail: `D4⊕D3⊕D2 = 1⊕0⊕1 = 0 (even) → P3 = 0` }
            ], answer: `Codeword = 1010101` },
            { type: 'heading', level: 3, id: 'p5q1a-decode', text: `Part II — Received code 1010011` },
            { type: 'example', title: 'Detect, locate, and correct', given: `Positions 7→1: 1 0 1 0 0 1 1`, steps: [
              { label: 'P1 group (1,3,5,7)', detail: `1+0+1+1 = 3 ones → odd → WRONG` },
              { label: 'P2 group (2,3,6,7)', detail: `1+0+0+1 = 2 ones → even → correct` },
              { label: 'P3 group (4,5,6,7)', detail: `0+1+0+1 = 2 ones → even → correct` },
              { label: 'Syndrome P3 P2 P1', detail: `0 0 1 = decimal 1 → error at position 1` },
              { label: 'Flip position 1 (P1 itself)', detail: `1 → 0` }
            ], answer: `Yes, an error occurred. Corrected codeword: 1010010 → original data word = **1010**.` }
          ]
        },
        {
          id: 'p5-q1b', label: '1.b', marks: 3, clo: 'CLO1',
          question: `Is the BCD code a self-complementing code? Justify your answer. Perform the following 4-digit BCD addition: 3758+4867. Express the final result in valid BCD form.`,
          answer: [
            { type: 'p', text: `**No.** Plain 8421 BCD is not self-complementary — its weights sum to 8+4+2+1 = 15, not 9, which fails the weight-sum test. Directly: digit 0 = 0000, whose 1's complement is 1111, but the BCD code for digit 9 (its 9's-complement) is 1001, not 1111 — they don't match, so BCD fails to be self-complementary.` },
            { type: 'example', title: '3758 + 4867 in BCD', given: `0011 0111 0101 1000 (3758)  +  0100 1000 0110 0111 (4867)`, steps: [
              { label: 'Units: 8 + 7', detail: `= 15 ≥ 10 → add 0110 correction: 15+6=21 → digit 5, carry 1` },
              { label: 'Tens: 5 + 6 + carry 1', detail: `= 12 ≥ 10 → add 0110 correction: 12+6=18 → digit 2, carry 1` },
              { label: 'Hundreds: 7 + 8 + carry 1', detail: `= 16 ≥ 10 → add 0110 correction: 16+6=22 → digit 6, carry 1` },
              { label: 'Thousands: 3 + 4 + carry 1', detail: `= 8 < 10 → no correction needed → digit 8, carry 0` }
            ], answer: `3758 + 4867 = 8625 → in valid BCD: 1000 0110 0010 0101` }
          ]
        },
        {
          id: 'p5-q1c', label: '1.c', marks: 2, clo: 'CLO1',
          question: `Given a decimal digit 8, perform the following conversions: I. Convert the decimal number into its Excess-3 code. II. Determine the corresponding Gray code.`,
          answer: [
            { type: 'example', title: 'Digit 8 → Excess-3', given: `Excess-3 = BCD + 0011`, steps: [
              { label: 'BCD(8)', detail: `1000` },
              { label: 'Add 3 (0011)', detail: `1000 + 0011 = 1011` }
            ], answer: `Excess-3(8) = 1011` },
            { type: 'example', title: 'Digit 8 → Gray code', given: `Binary(8) = 1000`, steps: [
              { label: 'Copy the MSB', detail: `1` },
              { label: 'bit2 = 1⊕0', detail: `1` },
              { label: 'bit3 = 0⊕0', detail: `0` },
              { label: 'bit4 = 0⊕0', detail: `0` }
            ], answer: `Gray code(8) = 1100` }
          ]
        }
      ]
    }
  ]
};
