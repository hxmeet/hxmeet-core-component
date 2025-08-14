export const convertLinksToAnchorTags = (text: string): string => {
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
  return text.replace(urlRegex, '<a href="$1" class="hover:underline text-primary-600" target="_blank">$1</a>');
};

// Copy from https://www.npmjs.com/package/escape-html
export const escapeHtml = (text: string): string => {
  const matchHtmlRegExp = /["'&<>]/;
  var str = "" + text;
  var match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  var escape;
  var html = "";
  var index = 0;
  var lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = "&quot;";
        break;
      case 38: // &
        escape = "&amp;";
        break;
      case 39: // '
        escape = "&#39;";
        break;
      case 60: // <
        escape = "&lt;";
        break;
      case 62: // >
        escape = "&gt;";
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
};

export const limitString = (str: string, limit: number): string => {
  return str.length > limit ? str.slice(0, limit) + "..." : str;
};
