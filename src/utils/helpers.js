const BASE_URL = "https://comix.to";

function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function cleanHtml(data) {
  const safeTitle = escapeHtml(data.title);
  const safeUrl = BASE_URL + escapeHtml(data.url);
  const safeChapter = escapeHtml(data.chapter.toString());

  return {
    url: safeUrl,
    chapter: safeChapter,
  };
}

export function compareTitles(readingList, titleName) {
  const checkTitle = (obj) =>
    obj.trim().toLowerCase() === titleName.trim().toLowerCase();

  const result = {
    isPresent: readingList.some(checkTitle),
    titleName: readingList.find(checkTitle) || "",
  };

  return result;
}
