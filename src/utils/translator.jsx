// src/utils/translator.js

export const keywordMap = {
  // Python
  "def": "karye",
  "print": "lekh",
  "if": "yadi",
  "else": "natra",

  // Java / C / C++
  "public": "sarbajanik",
  "static": "sthir",
  "void": "khali",
  "main": "mukhya",
  "System.out.println": "lekh",
  "return": "pharka",
  "int": "purnank",
  "float": "dasamlank"
};

export function translateCode(code = "") {
  let translated = code;

  for (const [key, value] of Object.entries(keywordMap)) {
    const regex = new RegExp(`\\b${key.replace(".", "\\.")}\\b`, "g");
    translated = translated.replace(regex, value);
  }

  return translated;
}
