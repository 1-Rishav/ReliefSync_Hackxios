import { useMemo } from "react";
import DOMPurify from "dompurify";

// Robust formatter for Gemini-like responses
export  function formatGemini(text) {
  // Basic HTML-escape to avoid injecting raw HTML
  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // inline formatting: bold (**text**), italic (*text*)
  function inlineFormat(str) {
    // str is already escaped
    // handle bold first (non-greedy), then italic
    str = str.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    str = str.replace(/\*(.+?)\*/g, "<em>$1</em>");
    return str;
  }

  // Normalize newlines
  const lines = text.replace(/\r\n?/g, "\n").split("\n");

  let out = "";
  let inList = false;

  for (let rawLine of lines) {
    const line = rawLine.trim();

    if (line === "") {
      // blank line -> close any open list and add a paragraph break
      if (inList) { out += "</ul>\n"; inList = false; }
      continue;
    }

    // Headings: #, ##, etc.
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      if (inList) { out += "</ul>\n"; inList = false; }
      const level = headingMatch[1].length;
      out += `<h${level}>${inlineFormat(escapeHtml(headingMatch[2]))}</h${level}>\n`;
      continue;
    }

    // Unordered list item: starts with '* ' or '- '
    const ulMatch = line.match(/^(\*|-)\s+(.*)$/);
    if (ulMatch) {
      if (!inList) { out += "<ul>\n"; inList = true; }
      out += `  <li>${inlineFormat(escapeHtml(ulMatch[2]))}</li>\n`;
      continue;
    }

    // Numbered list: "1. " or "1) "
    const olMatch = line.match(/^(\d+)[\.\)]\s+(.*)$/);
    if (olMatch) {
      if (inList) { out += "</ul>\n"; inList = false; }
      // simple approach: treat as paragraph with leading number if you don't need <ol>
      out += `<p>${inlineFormat(escapeHtml(line))}</p>\n`;
      continue;
    }

    // Regular paragraph line
    if (inList) { out += "</ul>\n"; inList = false; }
    out += `<p>${inlineFormat(escapeHtml(line))}</p>\n`;
  }

  if (inList) out += "</ul>\n";

  return out.trim();
}

export function FormattedResponse({ html }) {
  // sanitize once (useMemo avoids re-sanitizing every render)
  const clean = useMemo(() => DOMPurify.sanitize(html), [html]);

  return (
    <div
      className="formatted-response"              // style as you like
      dangerouslySetInnerHTML={{ __html: clean }}
    ></div>
  );
}
