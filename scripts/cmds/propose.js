const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "propose",
    aliases: ['gf','bf','proposal'],
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Dare someone to propose in the group",
    },
    longDescription: {
      en: "Dare a user to propose to a random member in the group.",
    },
    category: "love",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event, usersData }) {
    const { loadImage, createCanvas } = require("canvas");
    let pathImg = __dirname + "/assets/background.png";
    let pathAvt1 = __dirname + "/assets/any.png";
    let pathAvt2 = __dirname + "/assets/avatar.png";

    const id1 = event.senderID;
    const name1 = await usersData.getName(id1);
    const threadInfo = await api.getThreadInfo(event.threadID);
    const allMembers = threadInfo.userInfo;

    // Filter out the sender and bot from potential dare targets
    const potentialTargets = allMembers.filter(member => member.id !== id1 && member.id !== api.getCurrentUserID());

    // Select a random target for the dare with opposite gender
    const userGender = potentialTargets.find(member => member.id === id1)?.gender;
    const oppositeGenderTargets = potentialTargets.filter(member => member.gender !== userGender);

    if (oppositeGenderTargets.length === 0) {
      return api.sendMessage("No suitable target found for the dare.", event.threadID);
    }

    const targetMember = oppositeGenderTargets[Math.floor(Math.random() * oppositeGenderTargets.length)];
    const id2 = targetMember.id;
    const name2 = targetMember.name;

    const background = [
      "https://i.imgur.com/UyX1AmJ.jpg"
    ];

    let getAvtmot = (
      await axios.get(`https://graph.facebook.com/${id1}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
      )
    ).data;
    fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));

    let getAvthai = (
      await axios.get(`https://graph.facebook.com/${id2}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
      )
    ).data;
    fs.writeFileSync(pathAvt2, Buffer.from(getAvthai, "utf-8"));

    let getbackground = (
      await axios.get(`${background}`, {
        responseType: "arraybuffer",
      })
    ).data;
    fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));

    let baseImage = await loadImage(pathImg);
    let baseAvt1 = await loadImage(pathAvt1);
    let baseAvt2 = await loadImage(pathAvt2);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseAvt1, 111, 175, 330, 330);
    ctx.drawImage(baseAvt2, 1018, 173, 330, 330);
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    fs.removeSync(pathAvt1);
    fs.removeSync(pathAvt2);

    return api.sendMessage({
      body: `${name1}, you've been dared to propose to ${name2} in the group! 🌹`,
      mentions: [
        {
          tag: `${name2}`,
          id: id2
        },
        {
          tag: `${name1}`,
          id: id1
        }
      ],
      attachment: fs.createReadStream(pathImg)
    },
      event.threadID,
      () => fs.unlinkSync(pathImg),
      event.messageID);
  }
};