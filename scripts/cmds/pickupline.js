const axios = require('axios');

module.exports = {
  config: {
    name: "pickupline",
    aliases: ["lines"],
    version: "1.0",
    author: "Samir",
    countDown: 5,
    role: 0,
    shortDescription: "Get Random Pickupline",
    longDescription: "Get Random Pickupline",
    category: "fun",
    guide: "{p}{n}"
  },

  onStart: async function ({ api, event, args }) {
    const res = await axios.get(`https://api.popcat.xyz/pickuplines`);
return api.sendMessage(`${res.data.pickupline}`, event.threadID, event.messageID)
  }
};