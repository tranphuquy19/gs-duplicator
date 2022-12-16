export function convertMarkdownToHtml(markdownString: string): string {
  const boldRegex = /\*\*(.*?)\*\*/g;
  const italicRegex = /\*(.*?)\*/g;
  const strikethroughRegex = /~~(.*?)~~/g;
  const codeRegex = /`(.*?)`/g;
  const linkRegex = /\[(.*?)\]\((.*?)\)/g;

  const boldHtml = '<strong>$1</strong>';
  const italicHtml = '<em>$1</em>';
  const strikethroughHtml = '<del>$1</del>';
  const codeHtml = '<code>$1</code>';
  const linkHtml = '<a href="$2" target="_blank">$1</a>';

  const htmlString = markdownString
    .replace(boldRegex, boldHtml)
    .replace(italicRegex, italicHtml)
    .replace(strikethroughRegex, strikethroughHtml)
    .replace(codeRegex, codeHtml)
    .replace(linkRegex, linkHtml);

  return htmlString;
}
