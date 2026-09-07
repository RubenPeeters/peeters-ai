const labels = {
  en: { note: 'Note', tip: 'Tip', warning: 'Warning' },
  nl: { note: 'Opmerking', tip: 'Tip', warning: 'Waarschuwing' },
};

const text = (value) => ({ type: 'text', value });
const element = (tagName, properties, children) => ({
  type: 'element', tagName, properties, children,
});

// Transform HAST so Markdown and MDX share the same semantic HTML.
export default function rehypeWriting() {
  return (tree, file) => {
    const locale = file.data.astro?.frontmatter?.locale === 'nl' ? 'nl' : 'en';

    function visit(node) {
      if (['pre', 'code', 'script', 'style', 'mark'].includes(node.tagName ?? node.name)) return;

      if (node.type === 'element' && node.tagName === 'blockquote') {
        const paragraphIndex = node.children.findIndex((child) => child.type === 'element');
        const paragraph = node.children[paragraphIndex];
        const first = paragraph?.children?.[0];
        const match = paragraph?.tagName === 'p' && first?.type === 'text'
          ? first.value.match(/^\[!(note|tip|warning)\]([+-]?)(?:[ \t]+|(?=\n|$))/i)
          : null;

        if (match) {
          const kind = match[1].toLowerCase();
          first.value = first.value.slice(match[0].length);
          const title = [];
          const body = [];
          let inBody = false;
          for (const child of paragraph.children) {
            if (!inBody && child.type === 'text' && child.value.includes('\n')) {
              const split = child.value.indexOf('\n');
              title.push(text(child.value.slice(0, split)));
              body.push(text(child.value.slice(split + 1)));
              inBody = true;
            } else if (!inBody && child.type === 'element' && child.tagName === 'br') {
              inBody = true;
            } else {
              (inBody ? body : title).push(child);
            }
          }
          const hasTitle = title.some((child) => child.type !== 'text' || child.value.trim());
          const heading = hasTitle ? title : [text(labels[locale][kind])];
          const collapsible = Boolean(match[2]);
          node.tagName = collapsible ? 'details' : 'aside';
          node.properties = { ...node.properties, className: ['callout', `callout-${kind}`] };
          if (match[2] === '+') node.properties.open = true;
          node.children.splice(0, paragraphIndex + 1,
            element(collapsible ? 'summary' : 'p', { className: ['callout-title'] }, heading),
            ...(body.some((child) => child.type !== 'text' || child.value.trim())
              ? [element('p', {}, body)] : []),
          );
        }
      }

      if (!node.children) return;
      node.children = node.children.flatMap((child) => {
        if (child.type !== 'text') {
          visit(child);
          return [child];
        }
        // Deliberately limited to plain text within one inline node.
        const parts = [];
        let cursor = 0;
        for (const match of child.value.matchAll(/==([^=\n]+)==/g)) {
          parts.push(text(child.value.slice(cursor, match.index)));
          parts.push(element('mark', {}, [text(match[1])]));
          cursor = match.index + match[0].length;
        }
        return cursor ? [...parts, text(child.value.slice(cursor))] : [child];
      });
    }

    visit(tree);
  };
}
