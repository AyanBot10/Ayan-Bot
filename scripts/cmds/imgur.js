const axios = require("axios");
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/ARYAN-STORE/ARYAN-ALL-API/refs/heads/main/api.json`,
  );
  return base.data.ArYan;
};

(module.exports.config = {
  name: "imgur",
  version: "6.9",
  author: "Lawkey Marvellous",
  countDown: 5,
  role: 0,
  category: "image",
  description: "convert image/video into Imgur link",
  category: "tools",
  usages: "reply [image, video]",
}),
  (module.exports.onStart = async function ({ api, event }) {
    const ArYan = event.messageReply?.attachments[0]?.url;
    if (!ArYan) {
      return api.sendMessage(
        "Please reply to an image or video.",
        event.threadID,
        event.messageID,
      );
    }
    try {
      const res = await axios.get(
        `${await baseApiUrl()}/imgur?url=${encodeURIComponent(ArYan)}`,
      );
      const ArYan1 = res.data.data;
      api.sendMessage(ArYan1, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      return api.sendMessage(
        "Failed to convert image or video into link.",
        event.threadID,
        event.messageID,
      );
    }
  });
