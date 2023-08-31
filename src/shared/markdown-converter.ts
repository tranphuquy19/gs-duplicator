export function convertMarkdownToHtml(markdownString: string): string {
  const boldRegex = /\*\*(.*?)\*\*/g;
  const italicRegex = /\*(.*?)\*/g;
  const strikethroughRegex = /~~(.*?)~~/g;
  const codeRegex = /`(.*?)`/g;
  const linkRegex = /\[(.*?)\]\((.*?)\)/g;
  const breakLineRegex = /\n/g;
  const tabRegex = /\t/g;
  const customOpenTagRegex = /<(.*?)>/g;
  const customCloseTagRegex = /<\/(.*?)>/g;

  const boldHtml = '<strong>$1</strong>';
  const italicHtml = '<em>$1</em>';
  const strikethroughHtml = '<del>$1</del>';
  const codeHtml = '<code>$1</code>';
  const linkHtml = '<a href="$2" target="_blank">$1</a>';
  const breakLineHtml = '<br />';
  const tabHtml = '&nbsp;&nbsp;&nbsp;&nbsp;';
  const customOpenTagHtml = '&lt;$1&gt;';
  const customCloseTagHtml = '&lt;/$1&gt;';

  const htmlString = markdownString
    .replace(customCloseTagRegex, customCloseTagHtml)
    .replace(customOpenTagRegex, customOpenTagHtml)
    .replace(boldRegex, boldHtml)
    .replace(italicRegex, italicHtml)
    .replace(strikethroughRegex, strikethroughHtml)
    .replace(codeRegex, codeHtml)
    .replace(linkRegex, linkHtml)
    .replace(breakLineRegex, breakLineHtml)
    .replace(tabRegex, tabHtml);

  return htmlString;
}
