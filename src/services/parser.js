import apiClient from "../config/api.js";

export async function getNotificationsList() {

  try {
    const rawData = await apiClient.get(
      "https://comix.to/api/v1/user/notifications?scope=comics&unread=1&page=1&limit=5",
    );
    const rawList = rawData.data.result?.items || [];

    if (!Array.isArray(rawList)) return [];

    // Map elements 
    return rawList.map(item => {
      // Get rid of HTML tags in the title
      const cleanTitle = item.contentHtml.replace(/<\/?[^>]+(>|$)/g, "");

      // Get the chapter number
      const chapterNumber = parseInt(item.subtext.replace(/[^\d.]/g, "").slice(1));
      return{
        id: item.id.toString(),
        createdAtFormatted: item.createdAtFormatted,
        isUnread: item.isUnread,
        title: cleanTitle,
        chapter: chapterNumber,
        url: item.url,
        thumbnail: {
          medium: item.thumbnail.medium,
          large: item.thumbnail.large
        }
      }
    })
    
  } catch (err) {
    console.error("Couldn't retrieve the data: ", err);
    return [];
  }
}

console.log(await getNotificationsList());