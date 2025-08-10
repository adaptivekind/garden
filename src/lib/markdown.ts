// Function to process wiki links in markdown content
// Likely to switch to https://github.com/landakram/remark-wiki-link or
// switch over toe https://github.com/markedjs/marked
export function processWikiLinks(content: string): string {
  // Match [[page]] or [[page|display text]] patterns
  return content.replace(/\[\[([^\]]+)\]\]/g, (match, linkContent) => {
    const parts = linkContent.split("|");
    const pageName = parts[0].trim();
    const displayText = parts[1]?.trim() || pageName;

    // Convert page name to name format
    const name = pageName
      .replace(/[^a-zA-Z0-9\-_\s]/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();

    // Return as markdown link
    return `[${displayText}](/${name})`;
  });
}
