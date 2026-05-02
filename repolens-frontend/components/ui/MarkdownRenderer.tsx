/**
 * MarkdownRenderer
 * Lightweight renderer for Granite LLM output.
 * Handles: bold, inline code, fenced code blocks, h1-h3 headings,
 * numbered lists, and bullet lists — no external dependencies.
 */

"use client";

import React from "react";

// ── inline formatting ──────────────────────────────────────────────────────────

function InlineText({ text }: { text: string }) {
  // Split on **bold** and `code` spans
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-current">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="font-mono text-[0.82em] bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}

// ── block-level parser ─────────────────────────────────────────────────────────

type Block =
  | { type: "h1" | "h2" | "h3"; text: string }
  | { type: "bullet"; text: string }
  | { type: "numbered"; index: number; text: string }
  | { type: "code"; lang: string; lines: string[] }
  | { type: "paragraph"; text: string }
  | { type: "blank" };

function parseBlocks(raw: string): Block[] {
  const lines = raw.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.trimStart().startsWith("```")) {
      const lang = line.trimStart().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: "code", lang, lines: codeLines });
      i++;
      continue;
    }

    // Headings
    const h3 = line.match(/^###\s+(.*)/);
    const h2 = line.match(/^##\s+(.*)/);
    const h1 = line.match(/^#\s+(.*)/);
    if (h3) { blocks.push({ type: "h3", text: h3[1] }); i++; continue; }
    if (h2) { blocks.push({ type: "h2", text: h2[1] }); i++; continue; }
    if (h1) { blocks.push({ type: "h1", text: h1[1] }); i++; continue; }

    // Numbered list (e.g. "1. ", "2. ")
    const numbered = line.match(/^(\d+)\.\s+(.*)/);
    if (numbered) {
      blocks.push({ type: "numbered", index: Number(numbered[1]), text: numbered[2] });
      i++;
      continue;
    }

    // Bullet (- or *)
    const bullet = line.match(/^[\-\*]\s+(.*)/);
    if (bullet) {
      blocks.push({ type: "bullet", text: bullet[1] });
      i++;
      continue;
    }

    // Blank line
    if (line.trim() === "") {
      blocks.push({ type: "blank" });
      i++;
      continue;
    }

    // Paragraph / plain line — merge consecutive plain lines
    let text = line;
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].match(/^[#\-\*]|^\d+\./) &&
      !lines[i].trimStart().startsWith("```")
    ) {
      text += " " + lines[i].trim();
      i++;
    }
    blocks.push({ type: "paragraph", text });
  }

  return blocks;
}

// ── renderer ──────────────────────────────────────────────────────────────────

export default function MarkdownRenderer({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  // Group consecutive bullets / numbered items into a single list element
  const rendered: React.ReactNode[] = [];
  let k = 0;

  while (k < blocks.length) {
    const block = blocks[k];
    const startK = k; // capture start index BEFORE consuming

    // ── Bullet list group ──
    if (block.type === "bullet") {
      const items: string[] = [];
      while (k < blocks.length && blocks[k].type === "bullet") {
        items.push((blocks[k] as { type: "bullet"; text: string }).text);
        k++;
      }
      rendered.push(
        <ul key={`bullet-${startK}`} className="list-none space-y-1.5 my-2 pl-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 flex-shrink-0" />
              <span><InlineText text={item} /></span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // ── Numbered list group ──
    if (block.type === "numbered") {
      const items: Array<{ index: number; text: string }> = [];
      while (k < blocks.length && blocks[k].type === "numbered") {
        const nb = blocks[k] as { type: "numbered"; index: number; text: string };
        items.push({ index: nb.index, text: nb.text });
        k++;
      }
      rendered.push(
        <ol key={`numbered-${startK}`} className="space-y-2 my-2 pl-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm leading-relaxed">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center mt-0.5">
                {item.index}
              </span>
              <span><InlineText text={item.text} /></span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // ── Fenced code ──
    if (block.type === "code") {
      const cb = block as { type: "code"; lang: string; lines: string[] };
      rendered.push(
        <div key={`code-${startK}`} className="my-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {cb.lang && (
            <div className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-xs font-mono text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              {cb.lang}
            </div>
          )}
          <pre className="overflow-x-auto px-4 py-3 text-xs leading-relaxed bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-mono">
            <code>{cb.lines.join("\n")}</code>
          </pre>
        </div>
      );
      k++;
      continue;
    }

    // ── H1 ──
    if (block.type === "h1") {
      rendered.push(
        <h2 key={`h1-${startK}`} className="text-base font-bold mt-4 mb-1.5 text-gray-900 dark:text-gray-100">
          <InlineText text={(block as { type: "h1"; text: string }).text} />
        </h2>
      );
      k++;
      continue;
    }

    // ── H2 ──
    if (block.type === "h2") {
      rendered.push(
        <h3 key={`h2-${startK}`} className="text-sm font-bold mt-3 mb-1 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-0.5">
          <InlineText text={(block as { type: "h2"; text: string }).text} />
        </h3>
      );
      k++;
      continue;
    }

    // ── H3 ──
    if (block.type === "h3") {
      rendered.push(
        <h4 key={`h3-${startK}`} className="text-sm font-semibold mt-2 mb-0.5 text-blue-700 dark:text-blue-400">
          <InlineText text={(block as { type: "h3"; text: string }).text} />
        </h4>
      );
      k++;
      continue;
    }

    // ── Blank — small spacer ──
    if (block.type === "blank") {
      k++;
      continue; // handled by space-y on parent
    }

    // ── Paragraph ──
    if (block.type === "paragraph") {
      const pb = block as { type: "paragraph"; text: string };
      // Detect "Summary:" or "Detailed Explanation:" style labels
      const labelMatch = pb.text.match(/^([A-Z][^:]{0,40}):\s*(.*)/s);
      if (labelMatch && !pb.text.includes("://")) {
        const label = labelMatch[1];
        const rest = labelMatch[2];
        rendered.push(
          <div key={`para-label-${startK}`} className="my-2">
            <span className="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              {label}
            </span>
            {rest && (
              <p className="text-sm leading-relaxed mt-0.5">
                <InlineText text={rest} />
              </p>
            )}
          </div>
        );
      } else {
        rendered.push(
          <p key={`para-${startK}`} className="text-sm leading-relaxed my-1">
            <InlineText text={pb.text} />
          </p>
        );
      }
      k++;
      continue;
    }

    k++;
  }

  return <div className="space-y-0.5">{rendered}</div>;
}
