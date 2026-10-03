import "server-only";
import sanitizeHtml from "sanitize-html";

/**
 * Allow-list sanitizer for blog/rich-text HTML. Runs when content is saved
 * and again when it is rendered, so stored HTML can never inject scripts.
 */
export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html ?? "", {
    allowedTags: [
      "p", "h2", "h3", "h4", "ul", "ol", "li", "strong", "em", "u", "s", "a",
      "blockquote", "br", "hr", "img", "figure", "figcaption",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["https"] },
    allowProtocolRelative: false,
    transformTags: {
      h1: "h2",
      b: "strong",
      i: "em",
      a: (tagName, attribs) => {
        const external = /^https?:\/\//i.test(attribs.href ?? "");
        return {
          tagName,
          attribs: {
            ...attribs,
            ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
          },
        };
      },
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy" } }),
    },
    exclusiveFilter: (frame) => frame.tag === "img" && !/^(https:\/\/|\/api\/uploads\/|\/images\/)/.test(frame.attribs.src ?? ""),
  });
}

export function stripHtml(html: string): string {
  return sanitizeHtml(html ?? "", { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim();
}
