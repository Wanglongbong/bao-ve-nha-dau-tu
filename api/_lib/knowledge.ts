import paper from '../../src/data/official-paper-data.json' with { type: 'json' };
import { LEGAL_FRAMEWORK, PROJECT_METADATA, TEAM_MEMBERS } from '../../src/lib/research-data.js';

export interface KnowledgeSource { title: string; url: string }
interface Chunk extends KnowledgeSource { text: string; search: string }

const normalize = (value: string) => value.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
const tokens = (value: string) => Array.from(new Set(normalize(value).split(/[^a-z0-9]+/).filter((word) => word.length > 2)));
const chunks: Chunk[] = [];

for (const chapter of paper.chapters) {
  for (const section of chapter.sections) {
    const sectionTitle = `${chapter.title} — ${section.title}`;
    const sectionParagraphs = section.paragraphs || [];
    for (let index = 0; index < sectionParagraphs.length; index += 3) {
      const text = sectionParagraphs.slice(index, index + 3).join('\n');
      chunks.push({ title: `Bản Word — ${section.title}`, url: `/ban-word#${section.id}`, text, search: normalize(`${sectionTitle} ${text}`) });
    }
    for (const subsection of section.subsections || []) {
      for (let index = 0; index < subsection.paragraphs.length; index += 3) {
        const text = subsection.paragraphs.slice(index, index + 3).join('\n');
        chunks.push({ title: `Bản Word — ${subsection.title}`, url: `/ban-word#${subsection.id}`, text, search: normalize(`${chapter.title} ${section.title} ${subsection.title} ${text}`) });
      }
    }
  }
}

chunks.push({
  title: 'Thông tin đề tài và nhóm', url: '/doi-ngu',
  text: JSON.stringify(PROJECT_METADATA, null, 2), search: normalize(JSON.stringify(PROJECT_METADATA)),
});
for (const member of TEAM_MEMBERS) {
  const text = JSON.stringify(member, null, 2);
  chunks.push({ title: `Thông tin nhóm — ${member.name}`, url: `/doi-ngu#${member.slug}`, text, search: normalize(text) });
}
for (const document of LEGAL_FRAMEWORK) {
  const text = JSON.stringify(document, null, 2);
  chunks.push({ title: `Khung pháp luật — ${document.code}`, url: '/#van-ban', text, search: normalize(text) });
}

const outline = paper.chapters.map((chapter) => `${chapter.title}\n${chapter.sections.map((section) => `- ${section.title}`).join('\n')}`).join('\n\n');

export function retrieveKnowledge(query: string, limit = 8): { context: string; sources: KnowledgeSource[] } {
  const queryTokens = tokens(query);
  const broadSummary = /(tom tat|tong quan|toan bai|bo cuc|muc luc|de tai)/.test(normalize(query));
  const ranked = chunks.map((chunk) => {
    let score = 0;
    for (const token of queryTokens) {
      if (chunk.search.includes(token)) score += token.length > 6 ? 3 : 1;
      if (normalize(chunk.title).includes(token)) score += 3;
    }
    return { chunk, score };
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, limit);

  const selected = ranked.length ? ranked.map((item) => item.chunk) : chunks.slice(0, 3);
  const blocks = selected.map((chunk, index) => `[Tài liệu nội bộ ${index + 1}: ${chunk.title}]\n${chunk.text}`);
  if (broadSummary) blocks.unshift(`[Mục lục toàn bài]\n${outline}`);
  const context = blocks.join('\n\n').slice(0, 14_000);
  const sources = selected.map(({ title, url }) => ({ title, url })).filter((item, index, list) => list.findIndex((source) => source.title === item.title) === index);
  if (broadSummary) sources.unshift({ title: 'Bản Word — Mục lục toàn bài', url: '/ban-word' });
  return { context, sources: sources.slice(0, 8) };
}
