const axios = require('axios');

module.exports = {
    config: {
        name: "namaj",
        aliases: ["prayer"],
        version: "1.0",
        author: "RUBISH",
        description: {
            vi: "Lấy thông tin giờ cầu nguyện cho một địa điểm.",
            en: "Retrieve prayer times for a location."
        },
        category: "Tools",
        guide: {
            vi: "{pn} <địa điểm>",
            en: "{pn} <location>"
        }
    },

    onStart: async function ({ api, args, event }) {
        try {
            if (!args[0]) {
                await api.sendMessage("⚠️ | Please provide a location to retrieve prayer times.", event.threadID);
                return;
            }

            const location = args[0];
            const apiUrl = `https://rubish-apihub.onrender.com/rubish/namaj?location=${encodeURIComponent(location)}&apikey=rubish69`;

            const response = await axios.get(apiUrl);
            const apiResponse = response.data;

            if (apiResponse && apiResponse.prayerTimes) {
                const { location, date, currentTime, prayerTimes, nextPrayer, imageUrl } = apiResponse;

                let formattedResponse = `
📍 Location: ${location}

📅 Date: ${date}

⏰ Current Time: ${currentTime}

🕌 Prayer Times:
- Fajr: ${prayerTimes.Fajr}
- Sunrise: ${prayerTimes.Sunrise}
- Dhuhr: ${prayerTimes.Dhuhr}
- Asr: ${prayerTimes.Asr}
- Maghrib: ${prayerTimes.Maghrib}
- Isha: ${prayerTimes.Isha}

➡️ Next Prayer:
- Name: ${nextPrayer.name}
- Time: ${nextPrayer.time}
- Remaining Time: ${nextPrayer.remainingTime}
`;

                if (imageUrl) {
                    await api.sendMessage({
                        body: formattedResponse,
                        attachment: await global.utils.getStreamFromURL(imageUrl)
                    }, event.threadID);
                } else {
                    await api.sendMessage(formattedResponse, event.threadID);
                }
            } else {
                await api.sendMessage("❌ | Unable to retrieve prayer times. Please check the location and try again.", event.threadID);
            }
        } catch (error) {
            console.error('❌ | Error fetching prayer times:', error);
            await api.sendMessage("❌ | An error occurred while processing the request.", event.threadID);
        }
    }
};
