const fs = require('fs');
const path = require('path');

const filePath = path.join('d:\\KaushikAndCompany\\kaushik-and-company\\ProfileSKC.pdf');
const buf = fs.readFileSync(filePath);
const raw = buf.toString('latin1');

// Extract all parenthesised strings from PDF text streams
const btEt = raw.match(/BT[\s\S]*?ET/g) || [];
const lines = [];

btEt.forEach(block => {
  const strings = block.match(/\(([^)\\]|\\.)*\)/g) || [];
  strings.forEach(s => {
    // Remove surrounding parens and unescape
    let text = s.slice(1, -1)
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '')
      .replace(/\\t/g, ' ')
      .replace(/\\\(/g, '(')
      .replace(/\\\)/g, ')')
      .replace(/\\\\/g, '\\')
      .trim();
    if (text.length > 1 && /[a-zA-Z]/.test(text)) lines.push(text);
  });
});

console.log(lines.join('\n'));
