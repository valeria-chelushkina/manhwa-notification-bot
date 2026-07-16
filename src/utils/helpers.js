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
  //const cleanTitle = safeTitle.replace(/&amp;amp;/g, "&").replace(/&amp;/g, "&");
  const safeUrl = BASE_URL + escapeHtml(data.url);
  const safeChapter = escapeHtml(data.chapter.toString());

  return {
    //title: data.title,
    url: safeUrl,
    chapter: safeChapter,
  };
}

export function compareTitles(readingList, titleName)
{
  const checkTitle = obj => obj.title.trim().toLowerCase() === titleName.trim().toLowerCase();
  return readingList.some(checkTitle);
}