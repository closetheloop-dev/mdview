// GENERATED FILE — do not edit. Regenerate with:
//   bun run scripts/generate-case-folds.ts
// Source: data/CaseFolding.txt (CaseFolding-17.0.0.txt)
//
// Unicode full case folds (C- and F-status) that differ from
// String.prototype.toLowerCase. Turkic (T) folds are locale-dependent and
// excluded. Keys and values use escapes: several entries are invisible or
// have look-alike precomposed forms.

/** Full case folds not covered by toLowerCase (see file header). */
export const FULL_FOLDS = new Map<string, string>([
  ["\u{00b5}", "\u{03bc}"], // MICRO SIGN
  ["\u{00df}", "\u{0073}\u{0073}"], // LATIN SMALL LETTER SHARP S
  ["\u{0149}", "\u{02bc}\u{006e}"], // LATIN SMALL LETTER N PRECEDED BY APOSTROPHE
  ["\u{017f}", "\u{0073}"], // LATIN SMALL LETTER LONG S
  ["\u{01f0}", "\u{006a}\u{030c}"], // LATIN SMALL LETTER J WITH CARON
  ["\u{0345}", "\u{03b9}"], // COMBINING GREEK YPOGEGRAMMENI
  ["\u{0390}", "\u{03b9}\u{0308}\u{0301}"], // GREEK SMALL LETTER IOTA WITH DIALYTIKA AND TONOS
  ["\u{03b0}", "\u{03c5}\u{0308}\u{0301}"], // GREEK SMALL LETTER UPSILON WITH DIALYTIKA AND TONOS
  ["\u{03c2}", "\u{03c3}"], // GREEK SMALL LETTER FINAL SIGMA
  ["\u{03d0}", "\u{03b2}"], // GREEK BETA SYMBOL
  ["\u{03d1}", "\u{03b8}"], // GREEK THETA SYMBOL
  ["\u{03d5}", "\u{03c6}"], // GREEK PHI SYMBOL
  ["\u{03d6}", "\u{03c0}"], // GREEK PI SYMBOL
  ["\u{03f0}", "\u{03ba}"], // GREEK KAPPA SYMBOL
  ["\u{03f1}", "\u{03c1}"], // GREEK RHO SYMBOL
  ["\u{03f5}", "\u{03b5}"], // GREEK LUNATE EPSILON SYMBOL
  ["\u{0587}", "\u{0565}\u{0582}"], // ARMENIAN SMALL LIGATURE ECH YIWN
  ["\u{13a0}", "\u{13a0}"], // identity fold; toLowerCase would move it
  ["\u{13a1}", "\u{13a1}"], // identity fold; toLowerCase would move it
  ["\u{13a2}", "\u{13a2}"], // identity fold; toLowerCase would move it
  ["\u{13a3}", "\u{13a3}"], // identity fold; toLowerCase would move it
  ["\u{13a4}", "\u{13a4}"], // identity fold; toLowerCase would move it
  ["\u{13a5}", "\u{13a5}"], // identity fold; toLowerCase would move it
  ["\u{13a6}", "\u{13a6}"], // identity fold; toLowerCase would move it
  ["\u{13a7}", "\u{13a7}"], // identity fold; toLowerCase would move it
  ["\u{13a8}", "\u{13a8}"], // identity fold; toLowerCase would move it
  ["\u{13a9}", "\u{13a9}"], // identity fold; toLowerCase would move it
  ["\u{13aa}", "\u{13aa}"], // identity fold; toLowerCase would move it
  ["\u{13ab}", "\u{13ab}"], // identity fold; toLowerCase would move it
  ["\u{13ac}", "\u{13ac}"], // identity fold; toLowerCase would move it
  ["\u{13ad}", "\u{13ad}"], // identity fold; toLowerCase would move it
  ["\u{13ae}", "\u{13ae}"], // identity fold; toLowerCase would move it
  ["\u{13af}", "\u{13af}"], // identity fold; toLowerCase would move it
  ["\u{13b0}", "\u{13b0}"], // identity fold; toLowerCase would move it
  ["\u{13b1}", "\u{13b1}"], // identity fold; toLowerCase would move it
  ["\u{13b2}", "\u{13b2}"], // identity fold; toLowerCase would move it
  ["\u{13b3}", "\u{13b3}"], // identity fold; toLowerCase would move it
  ["\u{13b4}", "\u{13b4}"], // identity fold; toLowerCase would move it
  ["\u{13b5}", "\u{13b5}"], // identity fold; toLowerCase would move it
  ["\u{13b6}", "\u{13b6}"], // identity fold; toLowerCase would move it
  ["\u{13b7}", "\u{13b7}"], // identity fold; toLowerCase would move it
  ["\u{13b8}", "\u{13b8}"], // identity fold; toLowerCase would move it
  ["\u{13b9}", "\u{13b9}"], // identity fold; toLowerCase would move it
  ["\u{13ba}", "\u{13ba}"], // identity fold; toLowerCase would move it
  ["\u{13bb}", "\u{13bb}"], // identity fold; toLowerCase would move it
  ["\u{13bc}", "\u{13bc}"], // identity fold; toLowerCase would move it
  ["\u{13bd}", "\u{13bd}"], // identity fold; toLowerCase would move it
  ["\u{13be}", "\u{13be}"], // identity fold; toLowerCase would move it
  ["\u{13bf}", "\u{13bf}"], // identity fold; toLowerCase would move it
  ["\u{13c0}", "\u{13c0}"], // identity fold; toLowerCase would move it
  ["\u{13c1}", "\u{13c1}"], // identity fold; toLowerCase would move it
  ["\u{13c2}", "\u{13c2}"], // identity fold; toLowerCase would move it
  ["\u{13c3}", "\u{13c3}"], // identity fold; toLowerCase would move it
  ["\u{13c4}", "\u{13c4}"], // identity fold; toLowerCase would move it
  ["\u{13c5}", "\u{13c5}"], // identity fold; toLowerCase would move it
  ["\u{13c6}", "\u{13c6}"], // identity fold; toLowerCase would move it
  ["\u{13c7}", "\u{13c7}"], // identity fold; toLowerCase would move it
  ["\u{13c8}", "\u{13c8}"], // identity fold; toLowerCase would move it
  ["\u{13c9}", "\u{13c9}"], // identity fold; toLowerCase would move it
  ["\u{13ca}", "\u{13ca}"], // identity fold; toLowerCase would move it
  ["\u{13cb}", "\u{13cb}"], // identity fold; toLowerCase would move it
  ["\u{13cc}", "\u{13cc}"], // identity fold; toLowerCase would move it
  ["\u{13cd}", "\u{13cd}"], // identity fold; toLowerCase would move it
  ["\u{13ce}", "\u{13ce}"], // identity fold; toLowerCase would move it
  ["\u{13cf}", "\u{13cf}"], // identity fold; toLowerCase would move it
  ["\u{13d0}", "\u{13d0}"], // identity fold; toLowerCase would move it
  ["\u{13d1}", "\u{13d1}"], // identity fold; toLowerCase would move it
  ["\u{13d2}", "\u{13d2}"], // identity fold; toLowerCase would move it
  ["\u{13d3}", "\u{13d3}"], // identity fold; toLowerCase would move it
  ["\u{13d4}", "\u{13d4}"], // identity fold; toLowerCase would move it
  ["\u{13d5}", "\u{13d5}"], // identity fold; toLowerCase would move it
  ["\u{13d6}", "\u{13d6}"], // identity fold; toLowerCase would move it
  ["\u{13d7}", "\u{13d7}"], // identity fold; toLowerCase would move it
  ["\u{13d8}", "\u{13d8}"], // identity fold; toLowerCase would move it
  ["\u{13d9}", "\u{13d9}"], // identity fold; toLowerCase would move it
  ["\u{13da}", "\u{13da}"], // identity fold; toLowerCase would move it
  ["\u{13db}", "\u{13db}"], // identity fold; toLowerCase would move it
  ["\u{13dc}", "\u{13dc}"], // identity fold; toLowerCase would move it
  ["\u{13dd}", "\u{13dd}"], // identity fold; toLowerCase would move it
  ["\u{13de}", "\u{13de}"], // identity fold; toLowerCase would move it
  ["\u{13df}", "\u{13df}"], // identity fold; toLowerCase would move it
  ["\u{13e0}", "\u{13e0}"], // identity fold; toLowerCase would move it
  ["\u{13e1}", "\u{13e1}"], // identity fold; toLowerCase would move it
  ["\u{13e2}", "\u{13e2}"], // identity fold; toLowerCase would move it
  ["\u{13e3}", "\u{13e3}"], // identity fold; toLowerCase would move it
  ["\u{13e4}", "\u{13e4}"], // identity fold; toLowerCase would move it
  ["\u{13e5}", "\u{13e5}"], // identity fold; toLowerCase would move it
  ["\u{13e6}", "\u{13e6}"], // identity fold; toLowerCase would move it
  ["\u{13e7}", "\u{13e7}"], // identity fold; toLowerCase would move it
  ["\u{13e8}", "\u{13e8}"], // identity fold; toLowerCase would move it
  ["\u{13e9}", "\u{13e9}"], // identity fold; toLowerCase would move it
  ["\u{13ea}", "\u{13ea}"], // identity fold; toLowerCase would move it
  ["\u{13eb}", "\u{13eb}"], // identity fold; toLowerCase would move it
  ["\u{13ec}", "\u{13ec}"], // identity fold; toLowerCase would move it
  ["\u{13ed}", "\u{13ed}"], // identity fold; toLowerCase would move it
  ["\u{13ee}", "\u{13ee}"], // identity fold; toLowerCase would move it
  ["\u{13ef}", "\u{13ef}"], // identity fold; toLowerCase would move it
  ["\u{13f0}", "\u{13f0}"], // identity fold; toLowerCase would move it
  ["\u{13f1}", "\u{13f1}"], // identity fold; toLowerCase would move it
  ["\u{13f2}", "\u{13f2}"], // identity fold; toLowerCase would move it
  ["\u{13f3}", "\u{13f3}"], // identity fold; toLowerCase would move it
  ["\u{13f4}", "\u{13f4}"], // identity fold; toLowerCase would move it
  ["\u{13f5}", "\u{13f5}"], // identity fold; toLowerCase would move it
  ["\u{13f8}", "\u{13f0}"], // CHEROKEE SMALL LETTER YE
  ["\u{13f9}", "\u{13f1}"], // CHEROKEE SMALL LETTER YI
  ["\u{13fa}", "\u{13f2}"], // CHEROKEE SMALL LETTER YO
  ["\u{13fb}", "\u{13f3}"], // CHEROKEE SMALL LETTER YU
  ["\u{13fc}", "\u{13f4}"], // CHEROKEE SMALL LETTER YV
  ["\u{13fd}", "\u{13f5}"], // CHEROKEE SMALL LETTER MV
  ["\u{1c80}", "\u{0432}"], // CYRILLIC SMALL LETTER ROUNDED VE
  ["\u{1c81}", "\u{0434}"], // CYRILLIC SMALL LETTER LONG-LEGGED DE
  ["\u{1c82}", "\u{043e}"], // CYRILLIC SMALL LETTER NARROW O
  ["\u{1c83}", "\u{0441}"], // CYRILLIC SMALL LETTER WIDE ES
  ["\u{1c84}", "\u{0442}"], // CYRILLIC SMALL LETTER TALL TE
  ["\u{1c85}", "\u{0442}"], // CYRILLIC SMALL LETTER THREE-LEGGED TE
  ["\u{1c86}", "\u{044a}"], // CYRILLIC SMALL LETTER TALL HARD SIGN
  ["\u{1c87}", "\u{0463}"], // CYRILLIC SMALL LETTER TALL YAT
  ["\u{1c88}", "\u{a64b}"], // CYRILLIC SMALL LETTER UNBLENDED UK
  ["\u{1c89}", "\u{1c8a}"], // CYRILLIC CAPITAL LETTER TJE
  ["\u{1e96}", "\u{0068}\u{0331}"], // LATIN SMALL LETTER H WITH LINE BELOW
  ["\u{1e97}", "\u{0074}\u{0308}"], // LATIN SMALL LETTER T WITH DIAERESIS
  ["\u{1e98}", "\u{0077}\u{030a}"], // LATIN SMALL LETTER W WITH RING ABOVE
  ["\u{1e99}", "\u{0079}\u{030a}"], // LATIN SMALL LETTER Y WITH RING ABOVE
  ["\u{1e9a}", "\u{0061}\u{02be}"], // LATIN SMALL LETTER A WITH RIGHT HALF RING
  ["\u{1e9b}", "\u{1e61}"], // LATIN SMALL LETTER LONG S WITH DOT ABOVE
  ["\u{1e9e}", "\u{0073}\u{0073}"], // LATIN CAPITAL LETTER SHARP S
  ["\u{1f50}", "\u{03c5}\u{0313}"], // GREEK SMALL LETTER UPSILON WITH PSILI
  ["\u{1f52}", "\u{03c5}\u{0313}\u{0300}"], // GREEK SMALL LETTER UPSILON WITH PSILI AND VARIA
  ["\u{1f54}", "\u{03c5}\u{0313}\u{0301}"], // GREEK SMALL LETTER UPSILON WITH PSILI AND OXIA
  ["\u{1f56}", "\u{03c5}\u{0313}\u{0342}"], // GREEK SMALL LETTER UPSILON WITH PSILI AND PERISPOMENI
  ["\u{1f80}", "\u{1f00}\u{03b9}"], // GREEK SMALL LETTER ALPHA WITH PSILI AND YPOGEGRAMMENI
  ["\u{1f81}", "\u{1f01}\u{03b9}"], // GREEK SMALL LETTER ALPHA WITH DASIA AND YPOGEGRAMMENI
  ["\u{1f82}", "\u{1f02}\u{03b9}"], // GREEK SMALL LETTER ALPHA WITH PSILI AND VARIA AND YPOGEGRAMMENI
  ["\u{1f83}", "\u{1f03}\u{03b9}"], // GREEK SMALL LETTER ALPHA WITH DASIA AND VARIA AND YPOGEGRAMMENI
  ["\u{1f84}", "\u{1f04}\u{03b9}"], // GREEK SMALL LETTER ALPHA WITH PSILI AND OXIA AND YPOGEGRAMMENI
  ["\u{1f85}", "\u{1f05}\u{03b9}"], // GREEK SMALL LETTER ALPHA WITH DASIA AND OXIA AND YPOGEGRAMMENI
  ["\u{1f86}", "\u{1f06}\u{03b9}"], // GREEK SMALL LETTER ALPHA WITH PSILI AND PERISPOMENI AND YPOGEGRAMMENI
  ["\u{1f87}", "\u{1f07}\u{03b9}"], // GREEK SMALL LETTER ALPHA WITH DASIA AND PERISPOMENI AND YPOGEGRAMMENI
  ["\u{1f88}", "\u{1f00}\u{03b9}"], // GREEK CAPITAL LETTER ALPHA WITH PSILI AND PROSGEGRAMMENI
  ["\u{1f89}", "\u{1f01}\u{03b9}"], // GREEK CAPITAL LETTER ALPHA WITH DASIA AND PROSGEGRAMMENI
  ["\u{1f8a}", "\u{1f02}\u{03b9}"], // GREEK CAPITAL LETTER ALPHA WITH PSILI AND VARIA AND PROSGEGRAMMENI
  ["\u{1f8b}", "\u{1f03}\u{03b9}"], // GREEK CAPITAL LETTER ALPHA WITH DASIA AND VARIA AND PROSGEGRAMMENI
  ["\u{1f8c}", "\u{1f04}\u{03b9}"], // GREEK CAPITAL LETTER ALPHA WITH PSILI AND OXIA AND PROSGEGRAMMENI
  ["\u{1f8d}", "\u{1f05}\u{03b9}"], // GREEK CAPITAL LETTER ALPHA WITH DASIA AND OXIA AND PROSGEGRAMMENI
  ["\u{1f8e}", "\u{1f06}\u{03b9}"], // GREEK CAPITAL LETTER ALPHA WITH PSILI AND PERISPOMENI AND PROSGEGRAMMENI
  ["\u{1f8f}", "\u{1f07}\u{03b9}"], // GREEK CAPITAL LETTER ALPHA WITH DASIA AND PERISPOMENI AND PROSGEGRAMMENI
  ["\u{1f90}", "\u{1f20}\u{03b9}"], // GREEK SMALL LETTER ETA WITH PSILI AND YPOGEGRAMMENI
  ["\u{1f91}", "\u{1f21}\u{03b9}"], // GREEK SMALL LETTER ETA WITH DASIA AND YPOGEGRAMMENI
  ["\u{1f92}", "\u{1f22}\u{03b9}"], // GREEK SMALL LETTER ETA WITH PSILI AND VARIA AND YPOGEGRAMMENI
  ["\u{1f93}", "\u{1f23}\u{03b9}"], // GREEK SMALL LETTER ETA WITH DASIA AND VARIA AND YPOGEGRAMMENI
  ["\u{1f94}", "\u{1f24}\u{03b9}"], // GREEK SMALL LETTER ETA WITH PSILI AND OXIA AND YPOGEGRAMMENI
  ["\u{1f95}", "\u{1f25}\u{03b9}"], // GREEK SMALL LETTER ETA WITH DASIA AND OXIA AND YPOGEGRAMMENI
  ["\u{1f96}", "\u{1f26}\u{03b9}"], // GREEK SMALL LETTER ETA WITH PSILI AND PERISPOMENI AND YPOGEGRAMMENI
  ["\u{1f97}", "\u{1f27}\u{03b9}"], // GREEK SMALL LETTER ETA WITH DASIA AND PERISPOMENI AND YPOGEGRAMMENI
  ["\u{1f98}", "\u{1f20}\u{03b9}"], // GREEK CAPITAL LETTER ETA WITH PSILI AND PROSGEGRAMMENI
  ["\u{1f99}", "\u{1f21}\u{03b9}"], // GREEK CAPITAL LETTER ETA WITH DASIA AND PROSGEGRAMMENI
  ["\u{1f9a}", "\u{1f22}\u{03b9}"], // GREEK CAPITAL LETTER ETA WITH PSILI AND VARIA AND PROSGEGRAMMENI
  ["\u{1f9b}", "\u{1f23}\u{03b9}"], // GREEK CAPITAL LETTER ETA WITH DASIA AND VARIA AND PROSGEGRAMMENI
  ["\u{1f9c}", "\u{1f24}\u{03b9}"], // GREEK CAPITAL LETTER ETA WITH PSILI AND OXIA AND PROSGEGRAMMENI
  ["\u{1f9d}", "\u{1f25}\u{03b9}"], // GREEK CAPITAL LETTER ETA WITH DASIA AND OXIA AND PROSGEGRAMMENI
  ["\u{1f9e}", "\u{1f26}\u{03b9}"], // GREEK CAPITAL LETTER ETA WITH PSILI AND PERISPOMENI AND PROSGEGRAMMENI
  ["\u{1f9f}", "\u{1f27}\u{03b9}"], // GREEK CAPITAL LETTER ETA WITH DASIA AND PERISPOMENI AND PROSGEGRAMMENI
  ["\u{1fa0}", "\u{1f60}\u{03b9}"], // GREEK SMALL LETTER OMEGA WITH PSILI AND YPOGEGRAMMENI
  ["\u{1fa1}", "\u{1f61}\u{03b9}"], // GREEK SMALL LETTER OMEGA WITH DASIA AND YPOGEGRAMMENI
  ["\u{1fa2}", "\u{1f62}\u{03b9}"], // GREEK SMALL LETTER OMEGA WITH PSILI AND VARIA AND YPOGEGRAMMENI
  ["\u{1fa3}", "\u{1f63}\u{03b9}"], // GREEK SMALL LETTER OMEGA WITH DASIA AND VARIA AND YPOGEGRAMMENI
  ["\u{1fa4}", "\u{1f64}\u{03b9}"], // GREEK SMALL LETTER OMEGA WITH PSILI AND OXIA AND YPOGEGRAMMENI
  ["\u{1fa5}", "\u{1f65}\u{03b9}"], // GREEK SMALL LETTER OMEGA WITH DASIA AND OXIA AND YPOGEGRAMMENI
  ["\u{1fa6}", "\u{1f66}\u{03b9}"], // GREEK SMALL LETTER OMEGA WITH PSILI AND PERISPOMENI AND YPOGEGRAMMENI
  ["\u{1fa7}", "\u{1f67}\u{03b9}"], // GREEK SMALL LETTER OMEGA WITH DASIA AND PERISPOMENI AND YPOGEGRAMMENI
  ["\u{1fa8}", "\u{1f60}\u{03b9}"], // GREEK CAPITAL LETTER OMEGA WITH PSILI AND PROSGEGRAMMENI
  ["\u{1fa9}", "\u{1f61}\u{03b9}"], // GREEK CAPITAL LETTER OMEGA WITH DASIA AND PROSGEGRAMMENI
  ["\u{1faa}", "\u{1f62}\u{03b9}"], // GREEK CAPITAL LETTER OMEGA WITH PSILI AND VARIA AND PROSGEGRAMMENI
  ["\u{1fab}", "\u{1f63}\u{03b9}"], // GREEK CAPITAL LETTER OMEGA WITH DASIA AND VARIA AND PROSGEGRAMMENI
  ["\u{1fac}", "\u{1f64}\u{03b9}"], // GREEK CAPITAL LETTER OMEGA WITH PSILI AND OXIA AND PROSGEGRAMMENI
  ["\u{1fad}", "\u{1f65}\u{03b9}"], // GREEK CAPITAL LETTER OMEGA WITH DASIA AND OXIA AND PROSGEGRAMMENI
  ["\u{1fae}", "\u{1f66}\u{03b9}"], // GREEK CAPITAL LETTER OMEGA WITH PSILI AND PERISPOMENI AND PROSGEGRAMMENI
  ["\u{1faf}", "\u{1f67}\u{03b9}"], // GREEK CAPITAL LETTER OMEGA WITH DASIA AND PERISPOMENI AND PROSGEGRAMMENI
  ["\u{1fb2}", "\u{1f70}\u{03b9}"], // GREEK SMALL LETTER ALPHA WITH VARIA AND YPOGEGRAMMENI
  ["\u{1fb3}", "\u{03b1}\u{03b9}"], // GREEK SMALL LETTER ALPHA WITH YPOGEGRAMMENI
  ["\u{1fb4}", "\u{03ac}\u{03b9}"], // GREEK SMALL LETTER ALPHA WITH OXIA AND YPOGEGRAMMENI
  ["\u{1fb6}", "\u{03b1}\u{0342}"], // GREEK SMALL LETTER ALPHA WITH PERISPOMENI
  ["\u{1fb7}", "\u{03b1}\u{0342}\u{03b9}"], // GREEK SMALL LETTER ALPHA WITH PERISPOMENI AND YPOGEGRAMMENI
  ["\u{1fbc}", "\u{03b1}\u{03b9}"], // GREEK CAPITAL LETTER ALPHA WITH PROSGEGRAMMENI
  ["\u{1fbe}", "\u{03b9}"], // GREEK PROSGEGRAMMENI
  ["\u{1fc2}", "\u{1f74}\u{03b9}"], // GREEK SMALL LETTER ETA WITH VARIA AND YPOGEGRAMMENI
  ["\u{1fc3}", "\u{03b7}\u{03b9}"], // GREEK SMALL LETTER ETA WITH YPOGEGRAMMENI
  ["\u{1fc4}", "\u{03ae}\u{03b9}"], // GREEK SMALL LETTER ETA WITH OXIA AND YPOGEGRAMMENI
  ["\u{1fc6}", "\u{03b7}\u{0342}"], // GREEK SMALL LETTER ETA WITH PERISPOMENI
  ["\u{1fc7}", "\u{03b7}\u{0342}\u{03b9}"], // GREEK SMALL LETTER ETA WITH PERISPOMENI AND YPOGEGRAMMENI
  ["\u{1fcc}", "\u{03b7}\u{03b9}"], // GREEK CAPITAL LETTER ETA WITH PROSGEGRAMMENI
  ["\u{1fd2}", "\u{03b9}\u{0308}\u{0300}"], // GREEK SMALL LETTER IOTA WITH DIALYTIKA AND VARIA
  ["\u{1fd3}", "\u{03b9}\u{0308}\u{0301}"], // GREEK SMALL LETTER IOTA WITH DIALYTIKA AND OXIA
  ["\u{1fd6}", "\u{03b9}\u{0342}"], // GREEK SMALL LETTER IOTA WITH PERISPOMENI
  ["\u{1fd7}", "\u{03b9}\u{0308}\u{0342}"], // GREEK SMALL LETTER IOTA WITH DIALYTIKA AND PERISPOMENI
  ["\u{1fe2}", "\u{03c5}\u{0308}\u{0300}"], // GREEK SMALL LETTER UPSILON WITH DIALYTIKA AND VARIA
  ["\u{1fe3}", "\u{03c5}\u{0308}\u{0301}"], // GREEK SMALL LETTER UPSILON WITH DIALYTIKA AND OXIA
  ["\u{1fe4}", "\u{03c1}\u{0313}"], // GREEK SMALL LETTER RHO WITH PSILI
  ["\u{1fe6}", "\u{03c5}\u{0342}"], // GREEK SMALL LETTER UPSILON WITH PERISPOMENI
  ["\u{1fe7}", "\u{03c5}\u{0308}\u{0342}"], // GREEK SMALL LETTER UPSILON WITH DIALYTIKA AND PERISPOMENI
  ["\u{1ff2}", "\u{1f7c}\u{03b9}"], // GREEK SMALL LETTER OMEGA WITH VARIA AND YPOGEGRAMMENI
  ["\u{1ff3}", "\u{03c9}\u{03b9}"], // GREEK SMALL LETTER OMEGA WITH YPOGEGRAMMENI
  ["\u{1ff4}", "\u{03ce}\u{03b9}"], // GREEK SMALL LETTER OMEGA WITH OXIA AND YPOGEGRAMMENI
  ["\u{1ff6}", "\u{03c9}\u{0342}"], // GREEK SMALL LETTER OMEGA WITH PERISPOMENI
  ["\u{1ff7}", "\u{03c9}\u{0342}\u{03b9}"], // GREEK SMALL LETTER OMEGA WITH PERISPOMENI AND YPOGEGRAMMENI
  ["\u{1ffc}", "\u{03c9}\u{03b9}"], // GREEK CAPITAL LETTER OMEGA WITH PROSGEGRAMMENI
  ["\u{a7cb}", "\u{0264}"], // LATIN CAPITAL LETTER RAMS HORN
  ["\u{a7cc}", "\u{a7cd}"], // LATIN CAPITAL LETTER S WITH DIAGONAL STROKE
  ["\u{a7ce}", "\u{a7cf}"], // LATIN CAPITAL LETTER PHARYNGEAL VOICED FRICATIVE
  ["\u{a7d2}", "\u{a7d3}"], // LATIN CAPITAL LETTER DOUBLE THORN
  ["\u{a7d4}", "\u{a7d5}"], // LATIN CAPITAL LETTER DOUBLE WYNN
  ["\u{a7da}", "\u{a7db}"], // LATIN CAPITAL LETTER LAMBDA
  ["\u{a7dc}", "\u{019b}"], // LATIN CAPITAL LETTER LAMBDA WITH STROKE
  ["\u{ab70}", "\u{13a0}"], // CHEROKEE SMALL LETTER A
  ["\u{ab71}", "\u{13a1}"], // CHEROKEE SMALL LETTER E
  ["\u{ab72}", "\u{13a2}"], // CHEROKEE SMALL LETTER I
  ["\u{ab73}", "\u{13a3}"], // CHEROKEE SMALL LETTER O
  ["\u{ab74}", "\u{13a4}"], // CHEROKEE SMALL LETTER U
  ["\u{ab75}", "\u{13a5}"], // CHEROKEE SMALL LETTER V
  ["\u{ab76}", "\u{13a6}"], // CHEROKEE SMALL LETTER GA
  ["\u{ab77}", "\u{13a7}"], // CHEROKEE SMALL LETTER KA
  ["\u{ab78}", "\u{13a8}"], // CHEROKEE SMALL LETTER GE
  ["\u{ab79}", "\u{13a9}"], // CHEROKEE SMALL LETTER GI
  ["\u{ab7a}", "\u{13aa}"], // CHEROKEE SMALL LETTER GO
  ["\u{ab7b}", "\u{13ab}"], // CHEROKEE SMALL LETTER GU
  ["\u{ab7c}", "\u{13ac}"], // CHEROKEE SMALL LETTER GV
  ["\u{ab7d}", "\u{13ad}"], // CHEROKEE SMALL LETTER HA
  ["\u{ab7e}", "\u{13ae}"], // CHEROKEE SMALL LETTER HE
  ["\u{ab7f}", "\u{13af}"], // CHEROKEE SMALL LETTER HI
  ["\u{ab80}", "\u{13b0}"], // CHEROKEE SMALL LETTER HO
  ["\u{ab81}", "\u{13b1}"], // CHEROKEE SMALL LETTER HU
  ["\u{ab82}", "\u{13b2}"], // CHEROKEE SMALL LETTER HV
  ["\u{ab83}", "\u{13b3}"], // CHEROKEE SMALL LETTER LA
  ["\u{ab84}", "\u{13b4}"], // CHEROKEE SMALL LETTER LE
  ["\u{ab85}", "\u{13b5}"], // CHEROKEE SMALL LETTER LI
  ["\u{ab86}", "\u{13b6}"], // CHEROKEE SMALL LETTER LO
  ["\u{ab87}", "\u{13b7}"], // CHEROKEE SMALL LETTER LU
  ["\u{ab88}", "\u{13b8}"], // CHEROKEE SMALL LETTER LV
  ["\u{ab89}", "\u{13b9}"], // CHEROKEE SMALL LETTER MA
  ["\u{ab8a}", "\u{13ba}"], // CHEROKEE SMALL LETTER ME
  ["\u{ab8b}", "\u{13bb}"], // CHEROKEE SMALL LETTER MI
  ["\u{ab8c}", "\u{13bc}"], // CHEROKEE SMALL LETTER MO
  ["\u{ab8d}", "\u{13bd}"], // CHEROKEE SMALL LETTER MU
  ["\u{ab8e}", "\u{13be}"], // CHEROKEE SMALL LETTER NA
  ["\u{ab8f}", "\u{13bf}"], // CHEROKEE SMALL LETTER HNA
  ["\u{ab90}", "\u{13c0}"], // CHEROKEE SMALL LETTER NAH
  ["\u{ab91}", "\u{13c1}"], // CHEROKEE SMALL LETTER NE
  ["\u{ab92}", "\u{13c2}"], // CHEROKEE SMALL LETTER NI
  ["\u{ab93}", "\u{13c3}"], // CHEROKEE SMALL LETTER NO
  ["\u{ab94}", "\u{13c4}"], // CHEROKEE SMALL LETTER NU
  ["\u{ab95}", "\u{13c5}"], // CHEROKEE SMALL LETTER NV
  ["\u{ab96}", "\u{13c6}"], // CHEROKEE SMALL LETTER QUA
  ["\u{ab97}", "\u{13c7}"], // CHEROKEE SMALL LETTER QUE
  ["\u{ab98}", "\u{13c8}"], // CHEROKEE SMALL LETTER QUI
  ["\u{ab99}", "\u{13c9}"], // CHEROKEE SMALL LETTER QUO
  ["\u{ab9a}", "\u{13ca}"], // CHEROKEE SMALL LETTER QUU
  ["\u{ab9b}", "\u{13cb}"], // CHEROKEE SMALL LETTER QUV
  ["\u{ab9c}", "\u{13cc}"], // CHEROKEE SMALL LETTER SA
  ["\u{ab9d}", "\u{13cd}"], // CHEROKEE SMALL LETTER S
  ["\u{ab9e}", "\u{13ce}"], // CHEROKEE SMALL LETTER SE
  ["\u{ab9f}", "\u{13cf}"], // CHEROKEE SMALL LETTER SI
  ["\u{aba0}", "\u{13d0}"], // CHEROKEE SMALL LETTER SO
  ["\u{aba1}", "\u{13d1}"], // CHEROKEE SMALL LETTER SU
  ["\u{aba2}", "\u{13d2}"], // CHEROKEE SMALL LETTER SV
  ["\u{aba3}", "\u{13d3}"], // CHEROKEE SMALL LETTER DA
  ["\u{aba4}", "\u{13d4}"], // CHEROKEE SMALL LETTER TA
  ["\u{aba5}", "\u{13d5}"], // CHEROKEE SMALL LETTER DE
  ["\u{aba6}", "\u{13d6}"], // CHEROKEE SMALL LETTER TE
  ["\u{aba7}", "\u{13d7}"], // CHEROKEE SMALL LETTER DI
  ["\u{aba8}", "\u{13d8}"], // CHEROKEE SMALL LETTER TI
  ["\u{aba9}", "\u{13d9}"], // CHEROKEE SMALL LETTER DO
  ["\u{abaa}", "\u{13da}"], // CHEROKEE SMALL LETTER DU
  ["\u{abab}", "\u{13db}"], // CHEROKEE SMALL LETTER DV
  ["\u{abac}", "\u{13dc}"], // CHEROKEE SMALL LETTER DLA
  ["\u{abad}", "\u{13dd}"], // CHEROKEE SMALL LETTER TLA
  ["\u{abae}", "\u{13de}"], // CHEROKEE SMALL LETTER TLE
  ["\u{abaf}", "\u{13df}"], // CHEROKEE SMALL LETTER TLI
  ["\u{abb0}", "\u{13e0}"], // CHEROKEE SMALL LETTER TLO
  ["\u{abb1}", "\u{13e1}"], // CHEROKEE SMALL LETTER TLU
  ["\u{abb2}", "\u{13e2}"], // CHEROKEE SMALL LETTER TLV
  ["\u{abb3}", "\u{13e3}"], // CHEROKEE SMALL LETTER TSA
  ["\u{abb4}", "\u{13e4}"], // CHEROKEE SMALL LETTER TSE
  ["\u{abb5}", "\u{13e5}"], // CHEROKEE SMALL LETTER TSI
  ["\u{abb6}", "\u{13e6}"], // CHEROKEE SMALL LETTER TSO
  ["\u{abb7}", "\u{13e7}"], // CHEROKEE SMALL LETTER TSU
  ["\u{abb8}", "\u{13e8}"], // CHEROKEE SMALL LETTER TSV
  ["\u{abb9}", "\u{13e9}"], // CHEROKEE SMALL LETTER WA
  ["\u{abba}", "\u{13ea}"], // CHEROKEE SMALL LETTER WE
  ["\u{abbb}", "\u{13eb}"], // CHEROKEE SMALL LETTER WI
  ["\u{abbc}", "\u{13ec}"], // CHEROKEE SMALL LETTER WO
  ["\u{abbd}", "\u{13ed}"], // CHEROKEE SMALL LETTER WU
  ["\u{abbe}", "\u{13ee}"], // CHEROKEE SMALL LETTER WV
  ["\u{abbf}", "\u{13ef}"], // CHEROKEE SMALL LETTER YA
  ["\u{fb00}", "\u{0066}\u{0066}"], // LATIN SMALL LIGATURE FF
  ["\u{fb01}", "\u{0066}\u{0069}"], // LATIN SMALL LIGATURE FI
  ["\u{fb02}", "\u{0066}\u{006c}"], // LATIN SMALL LIGATURE FL
  ["\u{fb03}", "\u{0066}\u{0066}\u{0069}"], // LATIN SMALL LIGATURE FFI
  ["\u{fb04}", "\u{0066}\u{0066}\u{006c}"], // LATIN SMALL LIGATURE FFL
  ["\u{fb05}", "\u{0073}\u{0074}"], // LATIN SMALL LIGATURE LONG S T
  ["\u{fb06}", "\u{0073}\u{0074}"], // LATIN SMALL LIGATURE ST
  ["\u{fb13}", "\u{0574}\u{0576}"], // ARMENIAN SMALL LIGATURE MEN NOW
  ["\u{fb14}", "\u{0574}\u{0565}"], // ARMENIAN SMALL LIGATURE MEN ECH
  ["\u{fb15}", "\u{0574}\u{056b}"], // ARMENIAN SMALL LIGATURE MEN INI
  ["\u{fb16}", "\u{057e}\u{0576}"], // ARMENIAN SMALL LIGATURE VEW NOW
  ["\u{fb17}", "\u{0574}\u{056d}"], // ARMENIAN SMALL LIGATURE MEN XEH
  ["\u{10d50}", "\u{10d70}"], // GARAY CAPITAL LETTER A
  ["\u{10d51}", "\u{10d71}"], // GARAY CAPITAL LETTER CA
  ["\u{10d52}", "\u{10d72}"], // GARAY CAPITAL LETTER MA
  ["\u{10d53}", "\u{10d73}"], // GARAY CAPITAL LETTER KA
  ["\u{10d54}", "\u{10d74}"], // GARAY CAPITAL LETTER BA
  ["\u{10d55}", "\u{10d75}"], // GARAY CAPITAL LETTER JA
  ["\u{10d56}", "\u{10d76}"], // GARAY CAPITAL LETTER SA
  ["\u{10d57}", "\u{10d77}"], // GARAY CAPITAL LETTER WA
  ["\u{10d58}", "\u{10d78}"], // GARAY CAPITAL LETTER LA
  ["\u{10d59}", "\u{10d79}"], // GARAY CAPITAL LETTER GA
  ["\u{10d5a}", "\u{10d7a}"], // GARAY CAPITAL LETTER DA
  ["\u{10d5b}", "\u{10d7b}"], // GARAY CAPITAL LETTER XA
  ["\u{10d5c}", "\u{10d7c}"], // GARAY CAPITAL LETTER YA
  ["\u{10d5d}", "\u{10d7d}"], // GARAY CAPITAL LETTER TA
  ["\u{10d5e}", "\u{10d7e}"], // GARAY CAPITAL LETTER RA
  ["\u{10d5f}", "\u{10d7f}"], // GARAY CAPITAL LETTER NYA
  ["\u{10d60}", "\u{10d80}"], // GARAY CAPITAL LETTER FA
  ["\u{10d61}", "\u{10d81}"], // GARAY CAPITAL LETTER NA
  ["\u{10d62}", "\u{10d82}"], // GARAY CAPITAL LETTER PA
  ["\u{10d63}", "\u{10d83}"], // GARAY CAPITAL LETTER HA
  ["\u{10d64}", "\u{10d84}"], // GARAY CAPITAL LETTER OLD KA
  ["\u{10d65}", "\u{10d85}"], // GARAY CAPITAL LETTER OLD NA
  ["\u{16ea0}", "\u{16ebb}"], // BERIA ERFE CAPITAL LETTER ARKAB
  ["\u{16ea1}", "\u{16ebc}"], // BERIA ERFE CAPITAL LETTER BASIGNA
  ["\u{16ea2}", "\u{16ebd}"], // BERIA ERFE CAPITAL LETTER DARBAI
  ["\u{16ea3}", "\u{16ebe}"], // BERIA ERFE CAPITAL LETTER EH
  ["\u{16ea4}", "\u{16ebf}"], // BERIA ERFE CAPITAL LETTER FITKO
  ["\u{16ea5}", "\u{16ec0}"], // BERIA ERFE CAPITAL LETTER GOWAY
  ["\u{16ea6}", "\u{16ec1}"], // BERIA ERFE CAPITAL LETTER HIRDEABO
  ["\u{16ea7}", "\u{16ec2}"], // BERIA ERFE CAPITAL LETTER I
  ["\u{16ea8}", "\u{16ec3}"], // BERIA ERFE CAPITAL LETTER DJAI
  ["\u{16ea9}", "\u{16ec4}"], // BERIA ERFE CAPITAL LETTER KOBO
  ["\u{16eaa}", "\u{16ec5}"], // BERIA ERFE CAPITAL LETTER LAKKO
  ["\u{16eab}", "\u{16ec6}"], // BERIA ERFE CAPITAL LETTER MERI
  ["\u{16eac}", "\u{16ec7}"], // BERIA ERFE CAPITAL LETTER NINI
  ["\u{16ead}", "\u{16ec8}"], // BERIA ERFE CAPITAL LETTER GNA
  ["\u{16eae}", "\u{16ec9}"], // BERIA ERFE CAPITAL LETTER NGAY
  ["\u{16eaf}", "\u{16eca}"], // BERIA ERFE CAPITAL LETTER OI
  ["\u{16eb0}", "\u{16ecb}"], // BERIA ERFE CAPITAL LETTER PI
  ["\u{16eb1}", "\u{16ecc}"], // BERIA ERFE CAPITAL LETTER ERIGO
  ["\u{16eb2}", "\u{16ecd}"], // BERIA ERFE CAPITAL LETTER ERIGO TAMURA
  ["\u{16eb3}", "\u{16ece}"], // BERIA ERFE CAPITAL LETTER SERI
  ["\u{16eb4}", "\u{16ecf}"], // BERIA ERFE CAPITAL LETTER SHEP
  ["\u{16eb5}", "\u{16ed0}"], // BERIA ERFE CAPITAL LETTER TATASOUE
  ["\u{16eb6}", "\u{16ed1}"], // BERIA ERFE CAPITAL LETTER UI
  ["\u{16eb7}", "\u{16ed2}"], // BERIA ERFE CAPITAL LETTER WASSE
  ["\u{16eb8}", "\u{16ed3}"], // BERIA ERFE CAPITAL LETTER AY
]);
