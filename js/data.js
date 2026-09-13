/**
 * data.js
 * Structured course content for "Digital Systems & Binary Numbers" (Digital Logic Design, Chapter 1).
 * Transcribed from the uploaded chapter. Explanations are lightly reworded for clarity; all
 * definitions, figures, tables and worked numbers are preserved from the source material.
 *
 * Content model: each topic has an ordered list of "blocks". The renderer in app.js knows how
 * to turn each block type into HTML. See README.md for the full block-type reference.
 */

const COURSE_DATA = {
  meta: {
    courseTitle: `Digital Systems & Binary Numbers`,
    courseSubtitle: `Digital Logic Design — Chapter 1`,
    totalTopics: 11
  },

  home: {
    overview: `This chapter lays the foundation for everything else in digital logic design. It starts with the basic question of what makes a system "digital," then builds up the number systems, codes, and error-protection schemes that digital hardware uses to store and move information reliably.`,
    overviewExtra: `By the end of the chapter you'll be able to move fluently between decimal, binary, octal and hexadecimal; represent negative numbers the way hardware does; and understand how a handful of extra bits can let a system catch — or even fix — its own transmission errors.`,
    objectives: [
      `Explain what makes a system "digital" and why commercial devices are built with digital circuitry.`,
      `Convert numbers between decimal, binary, octal, and hexadecimal.`,
      `Form the 1's and 2's complement of a binary number, and use complements to perform subtraction.`,
      `Represent signed numbers using signed-magnitude, signed-1's-complement, and signed-2's-complement, and add signed numbers in 2's complement.`,
      `Encode decimal digits using BCD and other weighted binary codes, and perform BCD addition.`,
      `Encode and decode text using the 7-bit ASCII code.`,
      `Generate and check a parity bit, and explain what a simple parity scheme can and cannot detect.`,
      `Build a Hamming(7,4) codeword, and use it to locate and correct a single-bit error.`,
      `Convert between binary and Gray code, and explain why Gray code reduces transition errors.`,
      `Distinguish binary arithmetic from binary logic.`
    ],
    stats: [
      { value: '11', label: 'Topics' },
      { value: '8', label: 'Interactive tools' },
      { value: '20+', label: 'Worked examples' },
      { value: '3', label: 'Reference textbooks' }
    ]
  },

  topics: [
    // ---------------------------------------------------------------- 1
    {
      id: 'digital-systems',
      number: 1,
      title: `What is a Digital System?`,
      shortTitle: `Digital Systems`,
      icon: 'chip',
      dek: `Why computers, phones, and nearly every modern circuit are built to think in just two values.`,
      blocks: [
        { type: 'lead', text: `A digital system has the ability to represent and process discrete elements of information. Those discrete elements are represented by physical quantities called **signals** — most commonly voltage or current. Because digital systems use only two discrete values for their signals, we call them **binary**.` },
        { type: 'definition', term: `Bit`, text: `A **binary digit**, or bit, has exactly two possible values: 0 and 1. Every piece of information in a digital system — a number, a letter, a pixel, an instruction — is ultimately built out of bits.` },
        { type: 'note', variant: 'info', title: `Signal, not just number`, text: `A "signal" here means a physical, measurable quantity — usually a voltage level. A digital circuit agrees, by design, that (for example) close to 0V means the bit 0 and close to 5V means the bit 1. Everything downstream — arithmetic, memory, logic — is built on top of that simple agreement.` },
        { type: 'heading', level: 2, id: 'why-digital', text: `Why Commercial Products Are Built with Digital Circuitry` },
        { type: 'p', text: `Digital circuitry dominates commercial electronics for four practical reasons:` },
        { type: 'list', ordered: false, items: [
          `**Programmability.** Most digital devices are programmable, so the same underlying hardware can serve many different applications just by changing the program — no need to redesign the circuit for every new use.`,
          `**Falling cost.** Digital devices have seen dramatic cost reductions as the number of transistors that fit on a single chip keeps increasing.`,
          `**Speed.** Equipment built with digital integrated circuits (ICs) can perform at very high speed.`,
          `**Reliability.** Digital systems can be made to operate with extreme reliability by using error-correcting codes — a theme this chapter returns to later, in the sections on parity and Hamming codes.`
        ]},
        { type: 'keypoints', items: [
          `A digital system represents information as discrete signals — physical quantities like voltage or current.`,
          `"Binary" means a system that restricts those signals to two values, conventionally labelled 0 and 1.`,
          `A bit is one binary digit; every digital representation in this chapter (numbers, codes, text) is built from bits.`,
          `Digital circuitry is preferred commercially for programmability, cost, speed, and reliability.`
        ]},
        { type: 'mistakes', items: [
          `Thinking "binary" refers only to numbers. It really describes the *signal* — the same two-valued idea is used for numbers, letters, instructions, and more.`,
          `Assuming reliability comes from digital signals being "perfect." Real digital signals can still be corrupted — reliability instead comes from techniques like error-correcting codes, covered later in this chapter.`
        ]},
        { type: 'practice', items: [
          { q: `Name the two possible values of a bit.`, hint: `It's in the definition of "binary digit."`, answer: `0 and 1.` },
          { q: `List two of the four reasons commercial products favor digital circuitry.`, hint: `Think about cost, speed, flexibility, and reliability.`, answer: `Any two of: programmability (same hardware, different software), falling cost as transistor counts rise, high operating speed, and reliability via error-correcting codes.` }
        ]}
      ]
    },

    // ---------------------------------------------------------------- 2
    {
      id: 'number-systems',
      number: 2,
      title: `Number Systems`,
      shortTitle: `Number Systems`,
      icon: 'grid',
      dek: `Four ways of writing the same quantity: decimal, binary, octal, and hexadecimal.`,
      blocks: [
        { type: 'lead', text: `Digital systems work natively in binary, but binary numbers get long and hard to read quickly, so engineers also lean on **octal** (base 8) and **hexadecimal** (base 16) as compact shorthand — each octal digit stands in for exactly 3 bits, and each hex digit for exactly 4. Decimal (base 10) is included as the familiar reference point.` },
        { type: 'definition', term: `Base (radix)`, text: `The base of a number system is how many distinct digits it uses before it has to "carry" into a new place value. Decimal uses 10 digits (0–9), binary uses 2 (0–1), octal uses 8 (0–7), and hexadecimal uses 16 (0–9 then A–F for ten through fifteen).` },
        { type: 'table', id: 'base-table', caption: `The values 0–15 written in each of the four number systems`, headers: ['Decimal (base 10)', 'Binary (base 2)', 'Octal (base 8)', 'Hexadecimal (base 16)'], rows: [
          ['0','0000','0','0'], ['1','0001','1','1'], ['2','0010','2','2'], ['3','0011','3','3'],
          ['4','0100','4','4'], ['5','0101','5','5'], ['6','0110','6','6'], ['7','0111','7','7'],
          ['8','1000','10','8'], ['9','1001','11','9'], ['10','1010','12','A'], ['11','1011','13','B'],
          ['12','1100','14','C'], ['13','1101','15','D'], ['14','1110','16','E'], ['15','1111','17','F']
        ]},
        { type: 'note', variant: 'tip', title: `Notice the pattern`, text: `Binary always needs 4 digits to reach 15 (1111), while a single hex digit reaches the same value (F). That's exactly why hex is popular for writing binary compactly — 4 binary digits collapse into 1 hex digit with no information lost.` },
        { type: 'keypoints', items: [
          `Decimal, binary, octal, and hexadecimal are four representations of the same underlying values — converting between them never changes the quantity, only how it's written.`,
          `Octal digits (0–7) and hex digits (0–9, A–F) exist purely as compact groupings of binary digits: 1 octal digit = 3 bits, 1 hex digit = 4 bits.`,
          `Hexadecimal reaches 15 in a single digit (F), which is why it's the most compact of the four for representing binary values.`
        ]},
        { type: 'mistakes', items: [
          `Reading a binary number "as if" it were decimal — e.g. treating 10 (binary) as ten instead of two.`,
          `Forgetting that hex digits A–F stand for 10–15, not letters chosen at random.`
        ]},
        { type: 'practice', items: [
          { q: `What decimal value does hexadecimal C represent?`, hint: `Check the table.`, answer: `12.` },
          { q: `How many bits does a single octal digit always correspond to?`, hint: `Look at how octal digits 0–7 map onto 3-bit binary groups in the table.`, answer: `3 bits.` }
        ]}
      ]
    },

    // ---------------------------------------------------------------- 3
    {
      id: 'number-conversion',
      number: 3,
      title: `Number Base Conversion`,
      shortTitle: `Conversion`,
      icon: 'swap',
      dek: `The mechanics of moving a value between decimal, binary, octal, and hex — by hand and interactively.`,
      blocks: [
        { type: 'lead', text: `Converting between bases comes down to two different techniques: a **positional-weight** method for decimal ↔ binary, and a fast **grouping** method for octal/hex ↔ binary (since their bases are powers of 2).` },
        { type: 'heading', level: 2, id: 'dec-to-bin', text: `Decimal → Binary (positional weights)` },
        { type: 'p', text: `Each binary position is worth a power of two. Write out the weights, then mark a 1 under every weight that sums to your target number.` },
        { type: 'example', title: `Convert 84₁₀ to binary`, given: `84₁₀ = ?₂`, steps: [
          { label: `Write the place-value weights for 8 bits`, detail: `128  64  32  16  8  4  2  1` },
          { label: `Pick weights that sum to 84`, detail: `64 + 16 + 4 = 84, so mark a 1 under 64, 16, and 4 — and 0 everywhere else.` },
          { label: `Read off the bits`, detail: `0 1 0 1 0 1 0 0` }
        ], answer: `84₁₀ = 01010100₂` },
        { type: 'heading', level: 2, id: 'bin-to-dec', text: `Binary → Decimal (sum the weights)` },
        { type: 'example', title: `Convert 10110₂ to decimal`, given: `10110₂ = ?₁₀`, steps: [
          { label: `Write the weight above each bit that is 1`, detail: `16   8   4   2   1\n1    0   1   1   0` },
          { label: `Add the weights where the bit is 1`, detail: `16 + 4 + 2 = 22` }
        ], answer: `10110₂ = 22₁₀` },
        { type: 'heading', level: 2, id: 'oct-bin', text: `Octal ↔ Binary (group by 3)` },
        { type: 'p', text: `Because 8 = 2³, each octal digit converts independently to exactly 3 binary digits — no carrying or weight tables needed.` },
        { type: 'example', title: `Convert 337₈ to binary`, given: `337₈ = ?₂`, steps: [
          { label: `Convert each octal digit to 3 bits`, detail: `3 → 011,   3 → 011,   7 → 111` },
          { label: `Concatenate the groups`, detail: `011 011 111` }
        ], answer: `337₈ = 011011111₂` },
        { type: 'example', title: `Convert 1010011₂ to octal`, given: `1010011₂ = ?₈`, steps: [
          { label: `Group the bits into 3s from the right, padding the leftmost group with zeros`, detail: `001  010  011` },
          { label: `Convert each group of 3 bits to one octal digit`, detail: `001 → 1,   010 → 2,   011 → 3` }
        ], answer: `1010011₂ = 123₈` },
        { type: 'heading', level: 2, id: 'hex-bin', text: `Hexadecimal ↔ Binary (group by 4)` },
        { type: 'p', text: `The same idea applies to hex, but grouped by 4 bits (a "nibble"), since 16 = 2⁴.` },
        { type: 'example', title: `Convert 58A₁₆ to binary`, given: `58A₁₆ = ?₂`, steps: [
          { label: `Convert each hex digit to 4 bits`, detail: `5 → 0101,   8 → 1000,   A → 1010` },
          { label: `Concatenate the groups`, detail: `0101 1000 1010` }
        ], answer: `58A₁₆ = 010110001010₂` },
        { type: 'tool', toolId: 'numberConverter', title: `Try it: Universal Base Converter`, description: `Type a value in any base and watch it convert to all the others, with the same step-by-step breakdown shown above.` },
        { type: 'keypoints', items: [
          `Decimal ↔ binary uses positional weights (powers of 2); octal/hex ↔ binary uses fast digit-by-digit grouping (3 bits or 4 bits at a time) because 8 and 16 are powers of 2.`,
          `When grouping binary digits from the right, pad the leftmost group with leading zeros if it's short.`,
          `Going the other direction (octal/hex → binary) is just as mechanical: expand each digit to its fixed-width group and concatenate.`
        ]},
        { type: 'mistakes', items: [
          `Grouping binary digits from the left instead of the right when converting to octal/hex — always start grouping at the least-significant (rightmost) bit.`,
          `Dropping a leading zero inside a group, e.g. writing hex digit 5 as 101 instead of the full 0101 — every group must stay at its fixed width until the groups are concatenated.`,
          `Using the weight-table method for octal/hex conversions — it works, but the grouping method is far faster and is what's used in this course.`
        ]},
        { type: 'practice', items: [
          { q: `Convert 45₁₀ to binary.`, hint: `32 + 8 + 4 + 1 = 45.`, answer: `101101₂` },
          { q: `Convert 11001₂ to decimal.`, hint: `Sum the weights under the 1s: 16, 8, 1.`, answer: `25₁₀` },
          { q: `Convert 2C₁₆ to binary.`, hint: `2 → 0010, C → 1100.`, answer: `00101100₂` }
        ]}
      ]
    },

    // ---------------------------------------------------------------- 4
    {
      id: 'binary-complements',
      number: 4,
      title: `Binary Complements`,
      shortTitle: `Complements`,
      icon: 'flip',
      dek: `How digital hardware performs subtraction using nothing but an adder.`,
      blocks: [
        { type: 'lead', text: `Complements let hardware perform subtraction by *adding* instead — which matters because a digital circuit that can only add doesn't need a second, separate subtraction circuit. There are two flavors used with binary numbers: the **1's complement** and the **2's complement**.` },
        { type: 'heading', level: 2, id: 'ones-complement', text: `1's Complement` },
        { type: 'definition', term: `1's complement`, text: `Invert every digit of the number — change each 0 to 1 and each 1 to 0.` },
        { type: 'example', title: `1's complement of 1010111`, given: `1010111`, steps: [
          { label: `Invert every bit`, detail: `1→0, 0→1, 1→0, 0→1, 1→0, 1→0, 1→0` }
        ], answer: `1's complement of 1010111 is 0101000` },
        { type: 'heading', level: 2, id: 'twos-complement', text: `2's Complement` },
        { type: 'definition', term: `2's complement`, text: `Leave all the trailing zeros — and the first 1 you hit, reading from the right — unchanged, then flip every bit to the left of that first 1. (Equivalently: take the 1's complement and add 1, which is what the interactive tool below does.)` },
        { type: 'example', title: `2's complement of 1010100`, given: `1010100`, steps: [
          { label: `Copy the least-significant bits unchanged, up to and including the first 1`, detail: `...100 stays 100 (the trailing "00" and the first 1 are copied as-is)` },
          { label: `Flip every bit to the left of that point`, detail: `1010 → 0101` },
          { label: `Combine`, detail: `0101 100` }
        ], answer: `2's complement of 1010100 is 0101100` },
        { type: 'heading', level: 2, id: 'subtraction-via-complement', text: `Subtraction Using Complements` },
        { type: 'p', text: `To compute A − B, take the complement of B and add it to A. What happens next depends on whether that addition produces a carry out of the leftmost bit:` },
        { type: 'table', caption: `Handling the result after adding A + complement(B)`, headers: ['Method', 'If there is an end carry', 'If there is no end carry'], rows: [
          [`1's complement`, `Remove the carry and add it back into the least-significant bit. This is called the **end-around carry**. The result is the (positive) answer.`, `Take the 1's complement of the result again, and place a "−" sign in front — the true answer is negative.`],
          [`2's complement`, `Simply discard the carry. The remaining bits are the (positive) answer.`, `Take the 2's complement of the result again, and place a "−" sign in front — the true answer is negative.`]
        ]},
        { type: 'example', title: `Worked example: 1010100 − 1000100, using 1's complement`, given: `1010100 − 1000100`, steps: [
          { label: `Take the 1's complement of the subtrahend (1000100)`, detail: `1000100 → 0111011` },
          { label: `Add it to the minuend`, detail: `1010100 + 0111011 = 10001111` },
          { label: `There's an end carry (the leading 1) — remove it and add it back to the LSB`, detail: `0001111 + 1 = 0010000` }
        ], answer: `1010100 − 1000100 = 0010000 (decimal 16)` },
        { type: 'example', title: `The same subtraction using 2's complement`, given: `1010100 − 1000100`, steps: [
          { label: `Take the 2's complement of the subtrahend (1000100)`, detail: `1000100 → 0111100` },
          { label: `Add it to the minuend`, detail: `1010100 + 0111100 = 10010000` },
          { label: `There's an end carry — simply discard it`, detail: `Remaining bits: 0010000` }
        ], answer: `1010100 − 1000100 = 0010000 (decimal 16) — the same answer both ways, as expected.` },
        { type: 'note', variant: 'info', title: `What about the reverse subtraction?`, text: `The chapter also poses 1000100 − 1010100 — the same two numbers, flipped. Here neither method produces an end carry, which is the signal that the true answer is negative. Use the interactive tool below (enter 1000100 and 1010100) to work through it step by step and confirm the answer is −0010000, i.e. decimal −16.` },
        { type: 'tool', toolId: 'complementTool', title: `Try it: Complement & Subtraction Calculator`, description: `Enter any binary number to see its 1's and 2's complement, or enter two numbers to subtract them using either method — including the end-around carry.` },
        { type: 'keypoints', items: [
          `1's complement: flip every bit. 2's complement: flip every bit and add 1 (equivalently, copy trailing zeros and the first 1, then flip the rest).`,
          `To subtract A − B with complements: add A + complement(B). An end carry means the answer is positive (handle it per the method); no end carry means the answer is negative (re-complement and attach a minus sign).`,
          `1's complement uses an "end-around carry" (add the carry back to the LSB); 2's complement simply discards the carry.`
        ]},
        { type: 'mistakes', items: [
          `Forgetting the end-around carry step in the 1's complement method — dropping the carry outright (rather than adding it back to the LSB) gives an answer that's off by one.`,
          `Discarding the carry in the 2's complement method and then *also* adding it back — that's the 1's complement rule, not the 2's complement rule; the two methods are handled differently.`,
          `Forgetting to re-complement (and add the minus sign) when there's no end carry — a "no carry" result is not the final magnitude by itself.`
        ]},
        { type: 'practice', items: [
          { q: `Find the 1's complement of 11001010.`, hint: `Flip every bit.`, answer: `00110101` },
          { q: `Find the 2's complement of 11001010.`, hint: `1's complement, then add 1.`, answer: `00110110` },
          { q: `Compute 1000100 − 1010100 using 2's complement, and state whether the true answer is positive or negative.`, hint: `Add 1000100 + 2's-complement(1010100). Does it produce an end carry?`, answer: `1000100 + 0101100 = 1110000, no end carry, so re-complement: 2's complement of 1110000 is 0010000. The true answer is −0010000, i.e. −16.` }
        ]}
      ]
    },

    // ---------------------------------------------------------------- 5
    {
      id: 'signed-numbers',
      number: 5,
      title: `Signed Binary Numbers`,
      shortTitle: `Signed Numbers`,
      icon: 'plusMinus',
      dek: `Three ways hardware writes down negative numbers — and how it adds them.`,
      blocks: [
        { type: 'lead', text: `A computer's memory only stores bits — there's no separate "+" or "−" key. So a convention is needed to represent the sign of a number. This chapter covers two families of convention: the **signed-magnitude** convention, and the **signed-complement** system (which comes in 1's-complement and 2's-complement flavors).` },
        { type: 'heading', level: 2, id: 'signed-magnitude', text: `Signed-Magnitude Convention` },
        { type: 'p', text: `The leftmost bit is reserved as a sign bit (0 for "+", 1 for "−"), and the remaining bits hold the ordinary binary magnitude.` },
        { type: 'example', title: `+9 in 8-bit signed-magnitude`, given: `+9`, steps: [
          { label: `Write 9 in binary, using 7 bits for the magnitude`, detail: `0001001` },
          { label: `Prefix the sign bit (0 for positive)`, detail: `0  0001001` }
        ], answer: `00001001` },
        { type: 'heading', level: 2, id: 'signed-complement', text: `Signed-Complement System` },
        { type: 'p', text: `Instead of a separate sign-and-magnitude split, a negative number is stored as the complement of its positive counterpart — the sign falls out naturally as the leftmost bit.` },
        { type: 'example', title: `−9 in 8-bit signed-1's-complement and signed-2's-complement`, given: `−9 (from +9 = 00001001)`, steps: [
          { label: `Signed-1's-complement: invert every bit of +9's representation`, detail: `00001001 → 11110110` },
          { label: `Signed-2's-complement: take the 1's complement, then add 1`, detail: `11110110 + 1 = 11110111` }
        ], answer: `−9 is 11110110 in signed-1's-complement, and 11110111 in signed-2's-complement. Either way, the leftmost bit is 1, signalling a negative value.` },
        { type: 'table', id: 'signed-table', caption: `4-bit signed binary numbers across all three conventions`, headers: ['Decimal', 'Signed-2\'s Complement', 'Signed-1\'s Complement', 'Signed Magnitude'], rows: [
          ['+7','0111','0111','0111'], ['+6','0110','0110','0110'], ['+5','0101','0101','0101'], ['+4','0100','0100','0100'],
          ['+3','0011','0011','0011'], ['+2','0010','0010','0010'], ['+1','0001','0001','0001'], ['+0','0000','0000','0000'],
          ['−0','—','1111','1000'], ['−1','1111','1110','1001'], ['−2','1110','1101','1010'], ['−3','1101','1100','1011'],
          ['−4','1100','1011','1100'], ['−5','1011','1010','1101'], ['−6','1010','1001','1110'], ['−7','1001','1000','1111'],
          ['−8','1000','—','—']
        ]},
        { type: 'note', variant: 'warning', title: `Two edge cases worth noticing`, text: `Signed-magnitude and signed-1's-complement both waste a code on **−0** (a second, redundant representation of zero) — 2's complement doesn't have this problem, which is one reason it's the convention most real hardware uses. In exchange, 2's complement gains an extra negative value, **−8**, that has no positive counterpart representable in the same 4 bits — this is a normal, expected asymmetry of 2's complement, not an error.` },
        { type: 'tool', toolId: 'signedNumberTool', title: `Try it: Signed Number Explorer`, description: `Enter a decimal value to see it laid out in all three conventions, side by side — or explore the full 4-bit table above interactively.` },
        { type: 'heading', level: 2, id: 'signed-addition', text: `Addition Using Signed-2's-Complement` },
        { type: 'p', text: `This is where 2's complement earns its keep: signed addition uses the exact same binary adder as unsigned addition. Add the two representations directly, and simply discard any carry out of the sign-bit position.` },
        { type: 'table', caption: `Four worked additions in 8-bit signed-2's-complement (carry out of the sign bit is discarded)`, headers: ['Operand', 'Value', 'Operand', 'Value', 'Result'], rows: [
          ['+8','00001000','+10','00001010','+18 = 00010010'],
          ['−8','11111000','+10','00001010','+2 = 00000010'],
          ['+8','00001000','−10','11110110','−2 = 11111110'],
          ['−8','11111000','−10','11110110','−18 = 11101110']
        ]},
        { type: 'example', title: `Problem 1.20 (p. 35, 5th ed.): +49 and +29 in signed-2's-complement`, given: `Convert +49 and +29 to 8-bit signed-2's-complement, then compute (+29)+(−49), (−29)+(+49), and (−29)+(−49).`, steps: [
          { label: `Represent the two positive values`, detail: `+49 = 00110001,   +29 = 00011101` },
          { label: `Find their negatives (2's complement)`, detail: `−49 = 11001111,   −29 = 11100011` },
          { label: `(+29) + (−49): add and discard any carry`, detail: `00011101 + 11001111 = 11101100 → decimal −20` },
          { label: `(−29) + (+49): add and discard any carry`, detail: `11100011 + 00110001 = 00010100 → decimal +20` },
          { label: `(−29) + (−49): add and discard any carry`, detail: `11100011 + 11001111 = 10110010 → decimal −78` }
        ], answer: `All three results check out against ordinary decimal arithmetic: 29 − 49 = −20, −29 + 49 = 20, and −29 − 49 = −78.` },
        { type: 'tool', toolId: 'signedNumberTool', mode: 'adder', title: `Try it: Signed 2's-Complement Adder`, description: `Pick two signed decimal values and watch the 8-bit 2's-complement addition happen bit by bit, carry included.` },
        { type: 'keypoints', items: [
          `Signed-magnitude reserves one bit purely for sign; signed-complement systems fold the sign into the same complement operation used for subtraction.`,
          `2's complement is the convention most hardware uses because it has only one representation of zero (unlike the other two).`,
          `2's-complement addition uses an ordinary adder — just add the bit patterns and discard any carry out of the sign-bit position.`
        ]},
        { type: 'mistakes', items: [
          `Mixing up which representation a bit pattern belongs to — 1000 means very different things as signed-magnitude (−0) versus 2's complement (−8).`,
          `Trying to represent −8 in 4-bit signed-magnitude or signed-1's-complement — neither can; only 2's complement has room for it.`,
          `Keeping the carry out of the sign bit during 2's-complement addition instead of discarding it.`
        ]},
        { type: 'practice', items: [
          { q: `Write −5 in 4-bit signed-2's-complement.`, hint: `Check the table, or complement +5 = 0101.`, answer: `1011` },
          { q: `In 8-bit signed-2's-complement, compute (+15) + (−6). Discard any carry out of the sign bit.`, hint: `+15 = 00001111, −6 = 11111010.`, answer: `00001001, which is +9 — matching 15 − 6 = 9.` }
        ]}
      ]
    },

    // ---------------------------------------------------------------- 6
    {
      id: 'binary-codes',
      number: 6,
      title: `Binary Codes`,
      shortTitle: `Binary Codes`,
      icon: 'hash',
      dek: `BCD and its weighted-code relatives — encoding decimal digits directly in binary.`,
      blocks: [
        { type: 'lead', text: `To represent a group of 2ⁿ distinct elements in a binary code requires a minimum of n bits. This section looks at codes purpose-built to represent the ten decimal digits (0–9) directly in binary, rather than converting the whole number to pure binary.` },
        { type: 'definition', term: `BCD (Binary-Coded Decimal)`, text: `Each decimal digit is encoded separately using its ordinary 4-bit binary value (the "8421" weighting) — so a multi-digit decimal number becomes a sequence of 4-bit groups, one per digit, rather than a single binary number.` },
        { type: 'table', id: 'codes-table', caption: `Five weighted binary codes for the decimal digits 0–9`, headers: ['Decimal digit', 'BCD (8421)', 'Excess-3', '84-2-1', 'Aiken (2421)', 'Biquinary (5043210)'], rows: [
          ['0','0000','0011','0000','0000','0100001'],
          ['1','0001','0100','0111','0001','0100010'],
          ['2','0010','0101','0110','0010','0100100'],
          ['3','0011','0110','0101','0011','0101000'],
          ['4','0100','0111','0100','0100','0110000'],
          ['5','0101','1000','1011','1011','1000001'],
          ['6','0110','1001','1010','1100','1000010'],
          ['7','0111','1010','1001','1101','1000100'],
          ['8','1000','1011','1000','1110','1001000'],
          ['9','1001','1100','1111','1111','1010000']
        ]},
        { type: 'note', variant: 'info', title: `Reading the pattern in each code`, text: `**Excess-3** is just BCD plus 3 — e.g. digit 6 (BCD 0110) becomes 0110 + 0011 = 1001. **Biquinary** spends 7 bits per digit on purpose: the first 2 bits mark whether the digit is 5 or higher, and the last 5 bits are a "one-hot" marker for its position within that half (0–4). This redundancy is what makes biquinary useful for error checking — exactly one bit is set in each half, so a single-bit error is easy to spot.` },
        { type: 'tool', toolId: 'codesTool', mode: 'lookup', title: `Try it: Digit Code Lookup`, description: `Type any decimal digit or whole number to see it encoded in every code from the table above.` },
        { type: 'heading', level: 2, id: 'bcd-addition', text: `BCD Addition` },
        { type: 'p', text: `Adding two BCD numbers works digit-group by digit-group, but with a twist: ordinary binary addition can produce results from 0 to 15 in a 4-bit group, while a valid BCD digit only goes up to 9. Whenever a group's binary sum is 10 or more (invalid BCD) — or the group addition itself produces a carry — add 0110 (6) to that group to correct it, and carry 1 into the next group.` },
        { type: 'example', title: `184 + 576 in BCD`, given: `0001 1000 0100 (184) + 0101 0111 0110 (576)`, steps: [
          { label: `Add the units groups`, detail: `0100 (4) + 0110 (6) = 1010 (10). This is ≥ 10, so it's invalid BCD — add 0110: 1010 + 0110 = 1 0000. Units digit = 0, carry 1 into the tens.` },
          { label: `Add the tens groups, plus the carry`, detail: `1000 (8) + 0111 (7) + 1 (carry) = 1 0000 (16). Invalid / carried, so add 0110 to the 4-bit remainder: 0000 + 0110 = 0110. Tens digit = 6, carry 1 into the hundreds.` },
          { label: `Add the hundreds groups, plus the carry`, detail: `0001 (1) + 0101 (5) + 1 (carry) = 0111 (7). This is a valid BCD digit (≤ 9) with no carry, so no correction is needed. Hundreds digit = 7.` }
        ], answer: `184 + 576 = 760, i.e. 0111 0110 0000 in BCD.` },
        { type: 'tool', toolId: 'codesTool', mode: 'bcdAdd', title: `Try it: BCD Addition Calculator`, description: `Enter two decimal numbers and watch the group-by-group BCD addition, including every +6 correction step.` },
        { type: 'example', title: `Problem 1.23 (p. 35, 5th ed.): 791 + 658 in BCD`, given: `Represent 791 and 658 in BCD, then form their sum.`, steps: [
          { label: `Units: 1 + 8 = 9`, detail: `1001 — valid BCD, no correction needed.` },
          { label: `Tens: 9 + 5 = 14`, detail: `1110 is ≥ 10 → add 0110: 1110 + 0110 = 1 0100. Tens digit = 4, carry 1.` },
          { label: `Hundreds: 7 + 6 + 1(carry) = 14`, detail: `1110 is ≥ 10 → add 0110: 1110 + 0110 = 1 0100. Hundreds digit = 4, carry 1 becomes a new thousands digit.` }
        ], answer: `791 + 658 = 1449, i.e. 0001 0100 0100 1001 in BCD.` },
        { type: 'example', title: `Problem 1.25 (p. 35, 5th ed.): 6248 in four codes`, given: `Represent the decimal number 6248 in (a) BCD, (b) Excess-3, (c) 2421 code, and (d) 6311 code.`, steps: [
          { label: `(a) BCD — straight from the table for 6, 2, 4, 8`, detail: `0110 0010 0100 1000` },
          { label: `(b) Excess-3`, detail: `1001 0101 0111 1011` },
          { label: `(c) Aiken / 2421 code`, detail: `1100 0010 0100 1110` }
        ], answer: `(a) 0110 0010 0100 1000  (b) 1001 0101 0111 1011  (c) 1100 0010 0100 1110`, note: `Part (d) asks for the "6311" weighted code, which isn't one of the codes covered by this chapter's reference table, so it's left as a pointer to the original textbook rather than answered here.` },
        { type: 'keypoints', items: [
          `BCD encodes each decimal digit independently as 4 bits, rather than converting the whole number to binary.`,
          `A BCD group is only valid from 0000 to 1001 (0–9); anything from 1010 to 1111 never appears in valid BCD.`,
          `BCD addition needs a +6 correction on any group that comes out ≥ 10 or produces a carry, with the resulting carry rippling into the next digit group.`
        ]},
        { type: 'mistakes', items: [
          `Adding BCD digit-groups with plain binary addition and stopping there — without the +6 correction, groups that land on 10–15 are left as invalid BCD.`,
          `Applying the +6 correction to every group regardless of whether it needed it — only groups that are ≥ 10 (or produced a carry) get corrected.`,
          `Confusing the different weighted codes — e.g. reading an Excess-3 value directly as if it were plain BCD.`
        ]},
        { type: 'practice', items: [
          { q: `Encode the digit 7 in BCD, Excess-3, and 2421.`, hint: `Check the code table.`, answer: `BCD 0111, Excess-3 1010, 2421 1101.` },
          { q: `Add BCD 0011 (3) and 1000 (8) for a single digit group. Does it need a +6 correction?`, hint: `3 + 8 = 11 in binary — is that ≥ 10?`, answer: `0011 + 1000 = 1011 (11 decimal), which is ≥ 10, so it needs correction: 1011 + 0110 = 1 0001 → digit 1, carry 1 (representing the decimal result 11).` }
        ]}
      ]
    },

    // ---------------------------------------------------------------- 7
    {
      id: 'ascii-code',
      number: 7,
      title: `ASCII Character Code`,
      shortTitle: `ASCII`,
      icon: 'text',
      dek: `The 7-bit code that turns keystrokes and letters into binary — and back again.`,
      blocks: [
        { type: 'lead', text: `**ASCII** (American Standard Code for Information Interchange) uses seven bits to code 128 characters — the English alphabet in both cases, the digits, punctuation, and a set of non-printing control characters left over from the days of teletype machines.` },
        { type: 'p', text: `The full table is organized by splitting each 7-bit code into a 3-bit column selector (b₇b₆b₅) and a 4-bit row selector (b₄b₃b₂b₁).` },
        { type: 'table', id: 'ascii-table', caption: `The 7-bit ASCII character code (row = b₄b₃b₂b₁, column = b₇b₆b₅)`, headers: ['b₄b₃b₂b₁ ⁄ b₇b₆b₅', '000', '001', '010', '011', '100', '101', '110', '111'], rows: [
          ['0000','NUL','DLE','SP','0','@','P','`','p'],
          ['0001','SOH','DC1','!','1','A','Q','a','q'],
          ['0010','STX','DC2','"','2','B','R','b','r'],
          ['0011','ETX','DC3','#','3','C','S','c','s'],
          ['0100','EOT','DC4','$','4','D','T','d','t'],
          ['0101','ENQ','NAK','%','5','E','U','e','u'],
          ['0110','ACK','SYN','&','6','F','V','f','v'],
          ['0111','BEL','ETB',"'",'7','G','W','g','w'],
          ['1000','BS','CAN','(','8','H','X','h','x'],
          ['1001','HT','EM',')','9','I','Y','i','y'],
          ['1010','LF','SUB','*',':','J','Z','j','z'],
          ['1011','VT','ESC','+',';','K','[','k','{'],
          ['1100','FF','FS',',','<','L','\\','l','|'],
          ['1101','CR','GS','-','=','M',']','m','}'],
          ['1110','SO','RS','.','>','N','^','n','~'],
          ['1111','SI','US','/','?','O','_','o','DEL']
        ]},
        { type: 'table', caption: `Control character key`, headers: ['Code','Meaning','Code','Meaning'], rows: [
          ['NUL','Null','DLE','Data-link escape'], ['SOH','Start of heading','DC1','Device control 1'],
          ['STX','Start of text','DC2','Device control 2'], ['ETX','End of text','DC3','Device control 3'],
          ['EOT','End of transmission','DC4','Device control 4'], ['ENQ','Enquiry','NAK','Negative acknowledge'],
          ['ACK','Acknowledge','SYN','Synchronous idle'], ['BEL','Bell','ETB','End-of-transmission block'],
          ['BS','Backspace','CAN','Cancel'], ['HT','Horizontal tab','EM','End of medium'],
          ['LF','Line feed','SUB','Substitute'], ['VT','Vertical tab','ESC','Escape'],
          ['FF','Form feed','FS','File separator'], ['CR','Carriage return','GS','Group separator'],
          ['SO','Shift out','RS','Record separator'], ['SI','Shift in','US','Unit separator'],
          ['SP','Space','DEL','Delete']
        ]},
        { type: 'tool', toolId: 'asciiTool', title: `Try it: ASCII Converter`, description: `Type text to see its 7-bit ASCII codes (with an optional parity bit), or paste in binary to decode it back to text.` },
        { type: 'heading', level: 2, id: 'ascii-parity-example', text: `Worked Example with a Parity Bit` },
        { type: 'example', title: `Problem 1.22 (p. 35, 5th ed.): Convert 6514 to BCD and to ASCII with even parity`, given: `Convert decimal 6514 to both BCD and ASCII codes. For ASCII, an even parity bit is appended at the left.`, steps: [
          { label: `BCD — one 4-bit group per digit`, detail: `6→0110, 5→0101, 1→0001, 4→0100` },
          { label: `ASCII — the 7-bit code for each digit character`, detail: `'6'→0110110, '5'→0110101, '1'→0110001, '4'→0110100` },
          { label: `Count the 1s in each 7-bit code and choose a parity bit so the total is even`, detail: `'6' has four 1s (even) → parity 0.  '5' has four 1s (even) → parity 0.  '1' has three 1s (odd) → parity 1.  '4' has three 1s (odd) → parity 1.` }
        ], answer: `BCD: 0110 0101 0001 0100.  ASCII with even parity: 00110110 00110101 10110001 10110100.` },
        { type: 'heading', level: 2, id: 'ascii-decode-puzzle', text: `Decoding Practice` },
        { type: 'example', title: `Problem 1.29 (p. 35, 5th ed.): Decode this ASCII message`, given: `1010011 1110100 1100101 1110110 1100101 0100000 1001010 1101111 1100010 1110011`, steps: [
          { label: `Look up each 7-bit group in the table above`, detail: `1010011→S, 1110100→t, 1100101→e, 1110110→v, 1100101→e, 0100000→(space), 1001010→J, 1101111→o, 1100010→b, 1110011→s` }
        ], answer: `The decoded message reads "Steve Jobs." Paste the binary groups (with spaces) into the ASCII Converter tool above and switch it to decode mode to check this yourself.` },
        { type: 'keypoints', items: [
          `ASCII uses 7 bits per character, giving 128 possible codes — enough for the English alphabet (both cases), digits, punctuation, and control characters.`,
          `The table is organized as a 3-bit column selector and a 4-bit row selector, which together form the full 7-bit code.`,
          `A parity bit is not part of the character code itself — it's an extra bit added on top, for error detection during transmission or storage.`
        ]},
        { type: 'mistakes', items: [
          `Assuming ASCII is 8 bits — the character code itself is 7 bits; an 8th bit is only added separately, e.g. as a parity bit.`,
          `Mixing up the row and column selectors when reading the table (b₄b₃b₂b₁ is the row, b₇b₆b₅ is the column).`,
          `Forgetting that lowercase and uppercase letters have entirely different codes, not just a flipped bit.`
        ]},
        { type: 'practice', items: [
          { q: `What is the 7-bit ASCII code for the character 'A'?`, hint: `Row 0001, column 100.`, answer: `1000001` },
          { q: `Decode the ASCII byte 1101000.`, hint: `Row 1000, column 110.`, answer: `'h'` }
        ]}
      ]
    },

    // ---------------------------------------------------------------- 8
    {
      id: 'parity-bit',
      number: 8,
      title: `Error Detecting Code: The Parity Bit`,
      shortTitle: `Parity Bit`,
      icon: 'shield',
      dek: `The simplest way a digital system can notice that something got corrupted in transit.`,
      blocks: [
        { type: 'lead', text: `A **parity bit** is an extra bit included with a message to make the total number of 1s in the message either odd or even, by design. The receiver can then recount the 1s and check whether that agreed-upon parity still holds.` },
        { type: 'table', id: 'parity-table', caption: `Odd- and even-parity bit for every 4-bit message`, headers: ['Message','P (odd)','Message','P (even)'], rows: [
          ['0000','1','0000','0'], ['0001','0','0001','1'], ['0010','0','0010','1'], ['0011','1','0011','0'],
          ['0100','0','0100','1'], ['0101','1','0101','0'], ['0110','1','0110','0'], ['0111','0','0111','1'],
          ['1000','0','1000','1'], ['1001','1','1001','0'], ['1010','1','1010','0'], ['1011','0','1011','1'],
          ['1100','1','1100','0'], ['1101','0','1101','1'], ['1110','0','1110','1'], ['1111','1','1111','0']
        ]},
        { type: 'tool', toolId: 'parityTool', title: `Try it: Parity Generator & Error Simulator`, description: `Generate a parity bit for any message, then flip one or two bits during "transmission" and see whether the parity check still catches it.` },
        { type: 'note', variant: 'warning', title: `Limitations`, text: `Parity has two hard limits: it can only **detect** a single-bit error — it can never say *which* bit is wrong, so it cannot correct it. And it can only detect errors affecting an **odd** number of bits; if exactly two bits flip, the total count of 1s is unchanged, and the error slips through completely.` },
        { type: 'example', title: `A 2-bit error that parity misses`, given: `Transmitted: 11011      Received: 10111`, steps: [
          { label: `Count the 1s in the transmitted message`, detail: `1+1+0+1+1 = four 1s (even)` },
          { label: `Count the 1s in the received message`, detail: `1+0+1+1+1 = four 1s (even)` },
          { label: `Compare`, detail: `Two bits were flipped in transit (positions 2 and 3), but the parity is unchanged — even parity still holds, so no error is flagged.` }
        ], answer: `The corrupted message passes the parity check undetected, which is exactly why parity alone is considered a weak error-detection scheme.` },
        { type: 'keypoints', items: [
          `A parity bit is chosen so the message-plus-parity-bit has a total 1-count matching the agreed convention (odd or even).`,
          `Parity can detect any single-bit (or, more generally, any odd number of bit) errors.`,
          `Parity cannot detect double-bit (or other even-count) errors, and even when it does detect an error, it cannot say where the error is or correct it.`
        ]},
        { type: 'mistakes', items: [
          `Believing a passed parity check guarantees a correct message — it only guarantees no *odd* number of bits changed.`,
          `Expecting parity to locate or fix an error — by itself, it can only raise a flag that something is wrong.`
        ]},
        { type: 'practice', items: [
          { q: `What even-parity bit should accompany the message 1010?`, hint: `Count the 1s in 1010 — is it already even?`, answer: `0 (1010 already has two 1s, an even count, so the parity bit is 0).` },
          { q: `Why does parity fail to catch the error in the 11011 → 10111 example?`, hint: `Count the 1s in both.`, answer: `Both the original and the corrupted message contain four 1s, so the parity — which only tracks the count's odd/even-ness — doesn't change, even though two individual bits did.` }
        ]}
      ]
    },

    // ---------------------------------------------------------------- 9
    {
      id: 'hamming-code',
      number: 9,
      title: `Hamming Code`,
      shortTitle: `Hamming Code`,
      icon: 'shieldCheck',
      dek: `Adding just enough redundancy to find — and fix — a single flipped bit, automatically.`,
      blocks: [
        { type: 'lead', text: `Developed by **Richard W. Hamming in 1950**, Hamming code is an error-correcting code used in digital communication and storage systems that can both detect *and* correct single-bit errors — going a meaningful step beyond a plain parity bit.` },
        { type: 'heading', level: 2, id: 'hamming-how', text: `How It Works` },
        { type: 'list', ordered: true, items: [
          `Extra ("redundant") bits are added to the original data to enable error detection and correction.`,
          `The minimum number of redundant bits r needed for m data bits satisfies **2ʳ ≥ m + r + 1**.`,
          `Redundant (parity) bits are placed at positions that are powers of 2 — positions 1, 2, 4, 8, and so on.`,
          `When the data is received, a parity check is performed using those same parity bits.`,
          `If there is a single-bit error, the pattern of failed parity checks identifies the exact position of the error.`,
          `The erroneous bit is flipped to correct the data.`
        ]},
        { type: 'formula', text: `2ʳ ≥ m + r + 1`, note: `m = number of data bits, r = number of redundant (parity) bits.` },
        { type: 'heading', level: 2, id: 'hamming-74', text: `Hamming(7,4): Encoding 4 Data Bits` },
        { type: 'p', text: `With m = 4 data bits, r = 3 satisfies the formula exactly: 2³ = 8 ≥ 4 + 3 + 1 = 8. The 7-bit codeword lays data and parity bits out across positions 7 down to 1 as D₄ D₃ D₂ P₃ D₁ P₂ P₁ — parity bits at the power-of-2 positions (1, 2, 4), data bits filling the rest.` },
        { type: 'table', caption: `Which positions each parity bit checks (even parity)`, headers: ['Parity bit','Position','Checks positions'], rows: [
          ['P₁','1','1, 3, 5, 7'], ['P₂','2','2, 3, 6, 7'], ['P₃','4','4, 5, 6, 7']
        ]},
        { type: 'example', title: `Encode data bits 1100 (D₄D₃D₂D₁ = 1, 1, 0, 0), even parity`, given: `Codeword positions:  7  6  5  4  3  2  1\nCodeword bits:       D₄ D₃ D₂ P₃ D₁ P₂ P₁`, steps: [
          { label: `Place the data bits`, detail: `Position 7 (D₄) = 1,  position 6 (D₃) = 1,  position 5 (D₂) = 0,  position 3 (D₁) = 0` },
          { label: `P₁ covers positions 1, 3, 5, 7 → make their total even`, detail: `positions 3, 5, 7 currently hold 0, 0, 1 (one 1, odd) → P₁ = 1` },
          { label: `P₂ covers positions 2, 3, 6, 7 → make their total even`, detail: `positions 3, 6, 7 currently hold 0, 1, 1 (two 1s, already even) → P₂ = 0` },
          { label: `P₃ covers positions 4, 5, 6, 7 → make their total even`, detail: `positions 5, 6, 7 currently hold 0, 1, 1 (two 1s, already even) → P₃ = 0` }
        ], answer: `Codeword (positions 7→1): 1 1 0 0 0 0 1` },
        { type: 'heading', level: 2, id: 'hamming-detect', text: `How It Detects and Corrects an Error` },
        { type: 'example', title: `Received codeword 1100101 (sent as 1100001)`, given: `Transmitted: 1100001     Received: 1100101`, steps: [
          { label: `Re-check each parity group on the received bits`, detail: `P₁ (positions 1,3,5,7): wrong.   P₂ (positions 2,3,6,7): wrong.   P₃ (positions 4,5,6,7): correct.` },
          { label: `Build a binary number from the check results (1 = wrong, 0 = correct), ordered P₃P₂P₁`, detail: `P₃P₂P₁ = 0 1 1` },
          { label: `Convert that binary number to decimal — this is the exact bit position of the error`, detail: `011₂ = 3` },
          { label: `Flip the bit at position 3 to correct it`, detail: `Position 3 was 1 → flip to 0, restoring 1100001` }
        ], answer: `The error was at bit position 3, and flipping it recovers the original codeword 1100001.` },
        { type: 'tool', toolId: 'hammingTool', title: `Try it: Hamming(7,4) Encoder & Error Corrector`, description: `Encode your own 4 data bits, inject a single-bit error anywhere in the codeword, then watch the syndrome locate and fix it.` },
        { type: 'note', variant: 'warning', title: `Limitations`, text: `Hamming(7,4) can only correct a single-bit error — not multiple bits. It can *detect* a 2-bit error (the syndrome comes out non-zero) but cannot correct it, and may even point to the wrong bit if mistakenly "corrected." It also costs 3 extra bits for every 4 data bits, which increases transmission and storage size.` },
        { type: 'keypoints', items: [
          `Hamming code adds r parity bits, placed at power-of-2 positions, satisfying 2ʳ ≥ m + r + 1.`,
          `Each parity bit covers a specific, overlapping subset of positions — determined by the binary representation of the position numbers.`,
          `The pattern of failed parity checks (the "syndrome"), read as a binary number, gives the exact position of a single-bit error — position 0 means no error.`
        ]},
        { type: 'mistakes', items: [
          `Placing data and parity bits in the wrong positions — parity bits must sit at positions 1, 2, 4, 8, … (powers of 2), not at the start or end of the word.`,
          `Forgetting that the parity bit itself is included in its own check — e.g. P₁ checks position 1 (itself) along with 3, 5, 7.`,
          `Reading the syndrome bits in the wrong order — it must be read as PₙPₙ₋₁…P₂P₁ (highest parity bit first) to get the correct position number.`
        ]},
        { type: 'practice', items: [
          { q: `For Hamming(7,4), which positions does P₂ check?`, hint: `Positions whose binary form has the "2's place" bit set.`, answer: `Positions 2, 3, 6, and 7.` },
          { q: `If the syndrome computes to P₃P₂P₁ = 000, what does that mean?`, hint: `000 in decimal is 0.`, answer: `No error was detected — the codeword is either correct, or (rarely) has more errors than this scheme can detect.` }
        ]}
      ]
    },

    // ---------------------------------------------------------------- 10
    {
      id: 'gray-code',
      number: 10,
      title: `Reflected Code / Gray Code`,
      shortTitle: `Gray Code`,
      icon: 'gray',
      dek: `A binary code designed so that only one bit ever changes between consecutive values.`,
      blocks: [
        { type: 'lead', text: `**Gray code** — also called reflected binary code — reorders the standard binary sequence so that any two consecutive values differ in exactly one bit position.` },
        { type: 'table', id: 'gray-table', caption: `Binary vs. Gray code for decimal 0–15`, headers: ['Decimal','Binary','Gray code'], rows: [
          ['0','0000','0000'], ['1','0001','0001'], ['2','0010','0011'], ['3','0011','0010'],
          ['4','0100','0110'], ['5','0101','0111'], ['6','0110','0101'], ['7','0111','0100'],
          ['8','1000','1100'], ['9','1001','1101'], ['10','1010','1111'], ['11','1011','1110'],
          ['12','1100','1010'], ['13','1101','1011'], ['14','1110','1001'], ['15','1111','1000']
        ]},
        { type: 'note', variant: 'tip', title: `Compare 7 → 8`, text: `In ordinary binary, going from 7 to 8 flips *four* bits at once (0111 → 1000). In Gray code, the same step flips exactly *one* bit (0100 → 1100). That single-bit-change guarantee is the entire point of Gray code.` },
        { type: 'heading', level: 2, id: 'gray-advantages', text: `Advantages Over Binary Code` },
        { type: 'list', ordered: false, items: [
          `Only 1 bit changes per step, between any two consecutive values.`,
          `Error resilience is high, since the transition error is lower.`,
          `Power consumption is lower, since fewer bits switch on each count.`
        ]},
        { type: 'heading', level: 2, id: 'bin-to-gray', text: `Binary → Gray Code Conversion` },
        { type: 'list', ordered: true, items: [
          `The MSB of the binary number becomes the MSB of the Gray code, unchanged.`,
          `XOR the MSB with the next bit of the binary number to get the next Gray bit. Continue this, XOR-ing each pair of adjacent binary bits, all the way to the LSB.`
        ]},
        { type: 'example', title: `Convert binary 1110 to Gray code`, given: `1110`, steps: [
          { label: `Copy the MSB directly`, detail: `1` },
          { label: `XOR bit 1 and bit 2 of the binary (1 ⊕ 1)`, detail: `0` },
          { label: `XOR bit 2 and bit 3 of the binary (1 ⊕ 1)`, detail: `0` },
          { label: `XOR bit 3 and bit 4 of the binary (1 ⊕ 0)`, detail: `1` }
        ], answer: `Gray code: 1001` },
        { type: 'heading', level: 2, id: 'gray-to-bin', text: `Gray Code → Binary Conversion` },
        { type: 'list', ordered: true, items: [
          `The MSB of the Gray code becomes the MSB of the binary number, unchanged.`,
          `XOR the MSB of the binary (just computed) with the next Gray bit to get the next binary bit. Continue to the LSB.`
        ]},
        { type: 'example', title: `Convert Gray code 1010 to binary`, given: `1010`, steps: [
          { label: `Copy the MSB directly`, detail: `1` },
          { label: `XOR binary-bit-1 with Gray-bit-2 (1 ⊕ 0)`, detail: `1` },
          { label: `XOR binary-bit-2 with Gray-bit-3 (1 ⊕ 1)`, detail: `0` },
          { label: `XOR binary-bit-3 with Gray-bit-4 (0 ⊕ 0)`, detail: `0` }
        ], answer: `Binary: 1100` },
        { type: 'tool', toolId: 'grayCodeTool', title: `Try it: Binary ↔ Gray Code Converter`, description: `Convert either direction and watch the XOR chain fire bit by bit — and step through the table to see exactly one bit change between neighbors.` },
        { type: 'keypoints', items: [
          `Gray code's defining property: consecutive values differ in exactly one bit.`,
          `Binary → Gray: copy the MSB, then XOR each pair of adjacent binary bits.`,
          `Gray → Binary: copy the MSB, then XOR each newly-found binary bit with the next Gray bit.`
        ]},
        { type: 'mistakes', items: [
          `XOR-ing adjacent Gray bits together when converting Gray → binary — the second operand should be the *next Gray bit*, but the first operand is the *previously computed binary bit*, not the previous Gray bit.`,
          `Forgetting to copy the MSB unchanged before starting the XOR chain, in either direction.`
        ]},
        { type: 'practice', items: [
          { q: `Convert binary 1011 to Gray code.`, hint: `Copy the MSB, then XOR adjacent binary bits.`, answer: `1110` },
          { q: `Convert Gray code 1101 to binary.`, hint: `Copy the MSB, then XOR each new binary bit with the next Gray bit.`, answer: `1001` }
        ]}
      ]
    },

    // ---------------------------------------------------------------- 11
    {
      id: 'logic-vs-arithmetic',
      number: 11,
      title: `A Confusion: Binary Logic vs. Binary Arithmetic`,
      shortTitle: `Logic vs. Arithmetic`,
      icon: 'toggle',
      dek: `The same symbols, "1 + 1," mean two different things depending on context.`,
      blocks: [
        { type: 'lead', text: `Are binary logic and binary arithmetic the same thing? **No — they are not the same.**` },
        { type: 'example', title: `1 + 1 means different things in each system`, given: `1 + 1 = ?`, steps: [
          { label: `In binary arithmetic`, detail: `1 + 1 = 10 (that's decimal 2, written in binary — the bits carry, just like adding 5 + 5 = 10 in decimal).` },
          { label: `In binary logic`, detail: `1 + 1 = 1 (here "+" means the logical OR operation on truth values, not addition — 1 OR 1 is still just 1, "true.")` }
        ], answer: `The symbols look identical, but arithmetic addition and the logical OR operation are different operations that happen to share a "+" and the same two digits.` },
        { type: 'note', variant: 'info', title: `Why this matters`, text: `Every topic before this one in the chapter — conversions, complements, signed numbers, codes — deals with binary **arithmetic**: numbers, magnitudes, carries. Digital *logic design* (the subject of the rest of this course) deals with binary **logic**: TRUE/FALSE values combined with operations like AND, OR, and NOT. Keeping the two mental models separate avoids a very common source of confusion later in the course.` },
        { type: 'keypoints', items: [
          `Binary arithmetic treats 0/1 as numbers and follows normal addition rules, including carries.`,
          `Binary logic treats 0/1 as truth values (false/true) combined with logical operators like OR, AND, and NOT.`,
          `"1 + 1" evaluates differently in each system: 10 in arithmetic, 1 under logical OR.`
        ]},
        { type: 'practice', items: [
          { q: `Is "1 + 1 = 1" ever correct, and if so, under what interpretation?`, hint: `Think about what operation "+" could represent besides addition.`, answer: `Yes — under binary *logic*, where "+" denotes the OR operation rather than arithmetic addition.` }
        ]}
      ]
    }
  ],

  // Metadata for the 8 interactive tools — used to build the "Interactive Tools" hub page
  // and to feed the search index. `topicId` is where each tool lives in context.
  tools: [
    { id: 'numberConverter', name: 'Universal Base Converter', icon: 'swap', topicId: 'number-conversion', description: `Convert any value between decimal, binary, octal, and hexadecimal, with a step-by-step breakdown of the method.` },
    { id: 'complementTool', name: "Complement & Subtraction Calculator", icon: 'flip', topicId: 'binary-complements', description: `Find the 1's and 2's complement of a binary number, bit by bit, or subtract two numbers using either method.` },
    { id: 'signedNumberTool', name: 'Signed Number Explorer', icon: 'plusMinus', topicId: 'signed-numbers', description: `See any decimal value in signed-magnitude, signed-1's-complement, and signed-2's-complement side by side — plus a 2's-complement adder.` },
    { id: 'codesTool', name: 'Digit Codes & BCD Addition', icon: 'hash', topicId: 'binary-codes', description: `Look up BCD, Excess-3, 2421, and Biquinary codes for any digit, or walk through BCD addition with +6 corrections.` },
    { id: 'asciiTool', name: 'ASCII Converter', icon: 'text', topicId: 'ascii-code', description: `Encode text to 7-bit ASCII (with optional parity), or decode a binary stream back into text.` },
    { id: 'parityTool', name: 'Parity Generator & Error Simulator', icon: 'shield', topicId: 'parity-bit', description: `Generate an odd/even parity bit for a message, then simulate bit-flip errors to see what parity can and can't catch.` },
    { id: 'hammingTool', name: "Hamming(7,4) Encoder & Corrector", icon: 'shieldCheck', topicId: 'hamming-code', description: `Build a Hamming codeword from 4 data bits, inject a single-bit error, and watch the syndrome find and fix it.` },
    { id: 'grayCodeTool', name: 'Binary ↔ Gray Code Converter', icon: 'gray', topicId: 'gray-code', description: `Convert between binary and Gray code with a bit-by-bit XOR animation.` }
  ],

  references: [
    { authors: `Mano, M.M. and Ciletti, M.D.`, year: `2013`, title: `Digital Design: With an Introduction to the Verilog HDL`, publisher: `Pearson Prentice Hall` },
    { authors: `M. Morris Mano`, year: `2017`, title: `Digital Logic and Computer Design`, publisher: `Pearson India` },
    { authors: `Harris, S. L., & Harris, D. M.`, year: `2018`, title: `Digital Design and Computer Architecture`, publisher: `Elsevier / Morgan Kaufmann Publishers` }
  ]
};
