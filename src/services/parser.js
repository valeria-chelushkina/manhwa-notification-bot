import apiClient from "../config/api.js";

export async function getNotificationsList() {
  try {
    const rawData = await apiClient.get(
      "https://comix.to/api/v1/user/notifications?scope=comics&unread=1",
    );
    const rawList = rawData.data.result?.items || [];

    if (!Array.isArray(rawList)) return [];

    // Map elements
    return rawList.map((item) => {
      // Get rid of HTML tags in the title
      const cleanTitle = item.contentHtml.replace(/<\/?[^>]+(>|$)/g, "");

      // Get the chapter number
      const chapterNumber = parseInt(
        item.subtext.replace(/[^\d.]/g, "").slice(1),
      );
      return {
        id: item.id.toString(),
        releasedAt: item.createdAtFormatted,
        isUnread: item.isUnread,
        title: cleanTitle,
        chapter: chapterNumber,
        url: item.url,
        thumbnail: {
          medium: item.thumbnail.medium,
          large: item.thumbnail.large,
        },
      };
    });
  } catch (err) {
    console.error("Couldn't retrieve notifications data: ", err);
    return [];
  }
}

export async function getReadingList() {
  try {

    let pageNumber = 1;
    let rawList = [];
    while(true)
    {
      const url = 'https://comix.to/api/v1/user/following-titles?folder_id=1&sort=chapter_updated_desc&page=' + pageNumber;
      const rawData = await apiClient.get(url);
      const hasNext = rawData.data.result?.meta.hasNext || false;
      rawList.push(...(rawData.data.result?.items || []));
      pageNumber++;
      if(!hasNext) break;
    }

    if (!Array.isArray(rawList)) return [];

    return rawList.map((item) => {
      // Get rid of HTML tags in the title
      const cleanTitle = item.title.replace(/<\/?[^>]+(>|$)/g, "");

      return {
        id: item.id.toString(),
        title: cleanTitle,
        url: item.url,
      };
    });
  } catch (err) {
    console.error("Couldn't retrieve reading list data: ", err);
    return [];
  }
}
