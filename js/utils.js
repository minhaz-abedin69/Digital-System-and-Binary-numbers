/**
 * utils.js
 * Shared helpers for binary/number-system math used across the interactive tools.
 * Pure functions only — no DOM access — so they're easy to reason about and reuse.
 */

const DLUtils = (function () {
  'use strict';

  /** Left-pad a string of bits with '0' up to `len`. Never truncates. */
  function padBits(str, len) {
    str = String(str);
    return str.length >= len ? str : '0'.repeat(len - str.length) + str;
  }

  /** Keep only 0/1 characters from user input. */
  function sanitizeBinary(str) {
    return String(str || '').replace(/[^01]/g, '');
  }

  /** Convert a non-negative integer to a binary string, optionally padded to `bits` width. */
  function decToBin(n, bits) {
    n = Math.trunc(Math.abs(Number(n) || 0));
    let s = n.toString(2);
    if (bits) s = padBits(s, bits);
    return s;
  }

  /** Convert a binary string (unsigned) to a decimal integer. */
  function binToDec(bin) {
    bin = sanitizeBinary(bin);
    if (!bin) return 0;
    return parseInt(bin, 2);
  }

  /** Decimal -> Octal / Hex (uppercase), optional zero-pad to `digits`. */
  function decToOct(n, digits) {
    let s = Math.trunc(Math.abs(Number(n) || 0)).toString(8);
    if (digits) s = padBits(s, digits);
    return s;
  }
  function decToHex(n, digits) {
    let s = Math.trunc(Math.abs(Number(n) || 0)).toString(16).toUpperCase();
    if (digits) s = padBits(s, digits);
    return s;
  }

  /** Octal / Hex string -> decimal integer. */
  function octToDec(o) { return parseInt(String(o).replace(/[^0-7]/g, '') || '0', 8); }
  function hexToDec(h) { return parseInt(String(h).replace(/[^0-9a-fA-F]/g, '') || '0', 16); }

  /** Each octal digit -> exactly 3 binary bits. */
  function octDigitToBin3(d) { return padBits(parseInt(d, 8).toString(2), 3); }
  /** Each hex digit -> exactly 4 binary bits (a "nibble"). */
  function hexDigitToBin4(d) { return padBits(parseInt(d, 16).toString(2), 4); }

  function octalToBinaryGrouped(oct) {
    return String(oct).split('').map(octDigitToBin3).join('');
  }
  function hexToBinaryGrouped(hex) {
    return String(hex).split('').map(hexDigitToBin4).join('');
  }

  /** Group a binary string into chunks of `size`, padding on the LEFT with zeros first. */
  function groupBinary(bin, size) {
    const rem = bin.length % size;
    const padded = rem === 0 ? bin : padBits(bin, bin.length + (size - rem));
    const groups = [];
    for (let i = 0; i < padded.length; i += size) groups.push(padded.slice(i, i + size));
    return groups;
  }

  /** Flip every bit in a binary string: 0<->1. This is the 1's complement. */
  function onesComplement(bin) {
    return sanitizeBinary(bin).split('').map(b => (b === '0' ? '1' : '0')).join('');
  }

  /**
   * Ripple-carry add two equal-length (or auto-padded) binary strings.
   * Returns { sum, carryOut } where `sum` has the same width as the (padded) inputs.
   */
  function addBinary(a, b) {
    a = sanitizeBinary(a);
    b = sanitizeBinary(b);
    const width = Math.max(a.length, b.length);
    a = padBits(a, width);
    b = padBits(b, width);
    let carry = 0;
    let result = '';
    for (let i = width - 1; i >= 0; i--) {
      const bitA = a[i] === '1' ? 1 : 0;
      const bitB = b[i] === '1' ? 1 : 0;
      const total = bitA + bitB + carry;
      result = (total % 2) + result;
      carry = total >= 2 ? 1 : 0;
    }
    return { sum: result, carryOut: carry };
  }

  /** Add 1 (as a binary increment) to a bit string, wrapping within its own width. */
  function addOne(bin) {
    return addBinary(bin, padBits('1', bin.length)).sum;
  }

  /** 2's complement = 1's complement + 1 (same width as input). */
  function twosComplement(bin) {
    return addOne(onesComplement(bin));
  }

  /** Number of '1' characters in a bit string. */
  function countOnes(bin) {
    return (String(bin).match(/1/g) || []).length;
  }

  /** The parity bit (0/1) needed so the message, plus that bit, has the requested parity. */
  function parityBit(bin, type) {
    const ones = countOnes(bin);
    if (type === 'even') return ones % 2 === 0 ? '0' : '1';
    return ones % 2 === 0 ? '1' : '0'; // odd parity
  }

  /** XOR of two single bit characters ('0'/'1'). */
  function xorBit(a, b) { return a === b ? '0' : '1'; }

  /** Standard "reflected binary" Gray code conversion, MSB-first strings, any width. */
  function binaryToGray(bin) {
    bin = sanitizeBinary(bin);
    let gray = bin[0] || '0';
    for (let i = 1; i < bin.length; i++) gray += xorBit(bin[i - 1], bin[i]);
    return gray;
  }
  function grayToBinary(gray) {
    gray = sanitizeBinary(gray);
    let bin = gray[0] || '0';
    for (let i = 1; i < gray.length; i++) bin += xorBit(bin[i - 1], gray[i]);
    return bin;
  }

  /**
   * Signed representations of a decimal integer in a fixed bit width.
   * Returns null for values (other than -0) that cannot be represented in that width.
   */
  function signedMagnitude(value, bits) {
    const max = Math.pow(2, bits - 1) - 1;
    if (Math.abs(value) > max) return null;
    const mag = padBits(decToBin(Math.abs(value)), bits - 1);
    return (value < 0 ? '1' : '0') + mag;
  }
  function signedOnesComplement(value, bits) {
    if (value >= 0) return signedMagnitude(value, bits);
    const pos = signedMagnitude(-value, bits);
    if (pos === null) return null;
    return onesComplement(pos);
  }
  function signedTwosComplement(value, bits) {
    const min = -Math.pow(2, bits - 1);
    const max = Math.pow(2, bits - 1) - 1;
    if (value < min || value > max) return null;
    if (value >= 0) return padBits(decToBin(value), bits);
    // Work modulo 2^bits directly so the one extra negative value 2's complement can
    // represent (e.g. -8 in 4 bits) doesn't need to round-trip through signed-magnitude,
    // which cannot represent it (+8 needs 4 magnitude bits, only 3 are available).
    const mod = Math.pow(2, bits) + value;
    return padBits(decToBin(mod), bits);
  }

  /** Interpret an n-bit string as a signed 2's-complement integer. */
  function twosComplementToDecimal(bin) {
    bin = sanitizeBinary(bin);
    if (!bin) return 0;
    if (bin[0] === '0') return binToDec(bin);
    return -(binToDec(onesComplement(bin)) + 1);
  }

  /** ASCII helpers (7-bit code, as used throughout this chapter). */
  function charToAscii7(ch) {
    return padBits(ch.charCodeAt(0).toString(2), 7);
  }
  function ascii7ToChar(bin) {
    return String.fromCharCode(binToDec(padBits(sanitizeBinary(bin), 7)));
  }

  /** Escape text before dropping it into innerHTML. */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  return {
    padBits, sanitizeBinary, decToBin, binToDec, decToOct, decToHex, octToDec, hexToDec,
    octDigitToBin3, hexDigitToBin4, octalToBinaryGrouped, hexToBinaryGrouped, groupBinary,
    onesComplement, addBinary, addOne, twosComplement, countOnes, parityBit, xorBit,
    binaryToGray, grayToBinary, signedMagnitude, signedOnesComplement, signedTwosComplement,
    twosComplementToDecimal, charToAscii7, ascii7ToChar, escapeHtml
  };
})();
