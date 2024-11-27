 const funnyResponses = [
  "hasxas vai",
  "mero mutu todera aajai hasxau",
  "randi hasxas",
  "hasda hasdai gu niskela badi nahas",
  // Add more funny responses as needed
];

// Use an object to store funny responses for each group
const groupFunnyResponses = {};

module.exports = {
  config: {
    name: "haha",
    version: "1.3",  // Updated version
    author: "SKY",
    countDown: 5,
    role: 0,
    shortDescription: "no prefix",
    longDescription: "no prefix",
    category: "fun",
    prefix: ["haha","Haha"," HAHAHA","Hahaha"],  // Replace with your desired prefix
  },
  onStart: async function () {},
  onChat: async function ({ event, api, getLang }) {
    const { body, threadID } = event;

    // Check if the message body contains the prefix
    if (body && body.startsWith(module.exports.config.prefix)) {
      const args = body.slice(module.exports.config.prefix.length).trim().split(" ");
      const command = args.shift().toLowerCase();

      if (command === "add" && args.length > 0) {
        // Add the new funny response to the specific group
        const newResponse = args.join(" ");
        if (!groupFunnyResponses[threadID]) {
          groupFunnyResponses[threadID] = [];
        }
        groupFunnyResponses[threadID].push(newResponse);
        api.sendMessage(`New funny response added: ${newResponse}`, event.threadID);
      } else if (command === "delete" && args.length > 0) {
        // Delete a funny response from the specific group
        const indexToDelete = parseInt(args[0], 10);
        const groupResponses = groupFunnyResponses[threadID];
        if (groupResponses && groupResponses.length > 0 && !isNaN(indexToDelete) && indexToDelete >= 0 && indexToDelete < groupResponses.length) {
          const deletedResponse = groupResponses.splice(indexToDelete, 1)[0];
          await api.sendMessage(`Deleted funny response: ${deletedResponse}`, event.threadID);
        } else {
          api.sendMessage("Invalid index or no funny responses available to delete.", event.threadID);
        }
      }
    } else if (body && (body.includes("😂") || body.includes("😅") || body.includes("😹") || body.includes("🤣"))) {
      // Send a random funny response specific to the group
      const groupResponses = groupFunnyResponses[threadID];
      if (groupResponses && groupResponses.length > 0) {
        const randomIndex = Math.floor(Math.random() * groupResponses.length);
        const response = groupResponses[randomIndex];

        // Send the response to the same thread
        api.sendMessage(response, event.threadID);
      }
    }
    // You can add any other conditions or responses here if needed
  },
};