import { createApiClient, ExpiredCookiesError } from "../config/api.js";
import { checkActiveCookes } from "../utils/helpers.js";

export async function getNotificationsList(chatId, ctx) {
  await checkActiveCookes(chatId, ctx);
  const apiClient = await createApiClient(chatId, ctx);
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
      const chapterNumber = item.subtext.slice(3);
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
    if (err instanceof ExpiredCookiesError) {
      await ctx.db.sessionRepo.setCookiesUnactive(chatId);
      throw err;
    }
    console.error("Couldn't retrieve notifications data: ", err);
    return [];
  }
}

export async function getReadingList(chatId, ctx) {
  await checkActiveCookes(chatId, ctx);
  const apiClient = await createApiClient(chatId, ctx);
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
    if (err instanceof ExpiredCookiesError) {
      await ctx.db.sessionRepo.setCookiesUnactive(chatId);
      throw err;
    }
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