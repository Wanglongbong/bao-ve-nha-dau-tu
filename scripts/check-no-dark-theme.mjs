import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../src/', import.meta.url));
const forbidden = [
  /data-theme=["']navy["']/i,
  /--navy(?:-|\s*:)/i,
  /#(?:040810|070e1b|0a1428|0b1b3d|0e2145|162e5b|1d3d70)\b/i,
  /\bbg-(?:black|slate-9\d{2})\b/,
];

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return ['.ts', '.tsx', '.css'].includes(extname(entry.name)) ? [path] : [];
  }));
  return nested.flat();
}

const files = (await sourceFiles(root)).filter((file) => !file.endsWith('/components/presentation-slides.tsx'));
const violations = [];

for (const file of files) {
  const content = await readFile(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (forbidden.some((pattern) => pattern.test(line))) {
      violations.push(`${relative(root, file)}:${index + 1}: ${line.trim()}`);
    }
  });
}

if (violations.length > 0) {
  console.error('Phát hiện màu hoặc bề mặt tối ngoài phần slide:\n' + violations.join('\n'));
  process.exit(1);
}

console.log('Theme sáng hợp lệ: không còn navy/bề mặt đen ngoài phần slide.');
