import { createApiClient } from "../config/api.js";

export async function getNotificationsList(chatId) {
  const apiClient = await createApiClient(chatId);
  try {
    const rawList = await getList(
      "/api/v1/user/notifications?scope=comics&unread=1&page=",
      apiClient,
    );

    // map elements
    return rawList.map((item) => {
      // get rid of HTML tags in the title
      const cleanTitle = item.contentHtml.replace(/<\/?[^>]+(>|$)/g, "");

      // get the chapter number
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

export async function getReadingList(chatId) {
  const apiClient = await createApiClient(chatId);
  try {
    const rawList = await getList(
      "/api/v1/user/following-titles?folder_id=1&sort=chapter_updated_desc&page=",
      apiClient,
    );

    return rawList.map((item) => {
      // get rid of HTML tags in the title
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

async function getList(baseUrl, apiClient) {
  let pageNumber = 1;
  let rawList = [];
  while (true) {
    const url = baseUrl + pageNumber;
    const rawData = await apiClient.get(url);
    const hasNext = rawData.data.result?.meta.hasNext || false;
    rawList.push(...(rawData.data.result?.items || []));
    pageNumber++;
    if (!hasNext) break;
  }
  if (!Array.isArray(rawList)) return [];
  return rawList;
}
