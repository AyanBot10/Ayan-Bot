const axios = require('axios');

const Prefixes = [
  'ai'
];

function apply(text, fontMap) {
  return text.replace(/[a-zA-Z0-9]/g, (char) => fontMap[char] || char);
}

const sans = {
  a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁",
  i: "𝗂", j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉",
  q: "𝗊", r: "𝗋", s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑",
  y: "𝗒", z: "𝗓", A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥",
  G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬", N: "𝖭",
  O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱", S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵",
  W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹", "0": "𝟢", "1": "𝟣", "2": "𝟤", "3": "𝟥",
  "4": "𝟦", "5": "𝟧", "6": "𝟨", "7": "𝟩", "8": "𝟪", "9": "𝟫",
};

module.exports = {
  config: {
    name: "ask",
    version: 1.0,
    author: "OtinXSandip",
    longDescription: "AI",
    category: "ai",
    guide: {
      en: "{p} questions",
    },
  },
  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    try {
      
      const prefix = Prefixes.find((p) => event.body && event.body.toLowerCase().startsWith(p));
      if (!prefix) {
        return; // Invalid prefix, ignore the command
      }
      const prompt = event.body.substring(prefix.length).trim();
   if (!prompt) {
        await message.reply("𝖧𝖾𝗅𝗅𝗈! 𝖧𝗈𝗐 𝖼𝖺𝗇 𝖨 𝖺𝗌𝗌𝗂𝗌𝗍 𝗒𝗈𝗎 𝗍𝗈𝖽𝖺𝗒?");
        return;
      }


      const response = await axios.get(`https://sandipbaruwal.onrender.com/gemini?prompt=${encodeURIComponent(prompt)}`);
      const answer = apply(response.data.reply,sans);

 
    await message.reply({ body: `${answer}`,
});

   } catch (error) {
      console.error("Error:", error.message);
    }
  }
};
