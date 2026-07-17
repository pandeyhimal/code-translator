// src/utils/syntaxChecker.js

export function checkSyntaxErrors(code, language) {
  const errors = [];

  // Check for bracket matching
  const stack = [];
  const brackets = {
    '(': ')',
    '{': '}',
    '[': ']',
  };

  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    if (brackets[char]) {
      stack.push({ char, index: i });
    } else if (Object.values(brackets).includes(char)) {
      if (stack.length === 0) {
        errors.push(`Unmatched closing bracket '${char}' at position ${i + 1}`);
      } else {
        const last = stack.pop();
        if (brackets[last.char] !== char) {
          errors.push(
            `Mismatched bracket '${last.char}' at position ${last.index + 1} and '${char}' at position ${i + 1}`
          );
        }
      }
    }
  }

  if (stack.length > 0) {
    stack.forEach(({ char, index }) => {
      errors.push(`Unmatched opening bracket '${char}' at position ${index + 1}`);
    });
  }

  // Example: simple missing semicolon detection for C, C++, Java
  if (['cpp', 'java', 'c'].includes(language)) {
    // Split code into lines
    const lines = code.split('\n');

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      // Ignore empty lines or lines that are comments
      if (
        trimmed &&
        !trimmed.endsWith(';') &&
        !trimmed.endsWith('{') &&
        !trimmed.endsWith('}') &&
        !trimmed.startsWith('//') &&
        !trimmed.startsWith('/*') &&
        !trimmed.startsWith('*') &&
        !trimmed.startsWith('#include') &&
        !trimmed.startsWith('using') &&
        !trimmed.startsWith('for') &&
        !trimmed.startsWith('if') &&
        !trimmed.startsWith('else') &&
        !trimmed.startsWith('while') &&
        !trimmed.startsWith('switch')
      ) {
        errors.push(`Possible missing semicolon at line ${idx + 1}`);
      }
    });
  }

  // You can add more checks here!

  return errors;
}
