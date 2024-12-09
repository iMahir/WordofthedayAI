import { TweetV2PostTweetResult, TwitterApi } from "twitter-api-v2";
import { Providers } from "./providers";
import { getEnv } from "./helpers";

const client = new TwitterApi({
    appKey: getEnv("API_KEY"),
    appSecret: getEnv("API_SECRET"),
    accessToken: getEnv("ACCESS_TOKEN"),
    accessSecret: getEnv("ACCESS_SECRET"),
});

export interface PostTweet {
    status: boolean;
    data?: {
        tweet: TweetV2PostTweetResult;
        meta: {
            wotd: {
                word: string;
                meaning: string;
            };
            tweetContent: string;
            imageContext: string;
            tweetImage: {
                image: {
                    data: string;
                    url: string;
                };
            };
            mediaId: string;
        };
    };
}

export const postTweet = async () => {
    try {
        const wotd = await Providers.wotd.wordsmith();

        const tweetContent = await Providers.gpt.pollinations(
            `Generate content for a tweet about the word of the day. The word is: ${wotd.word}, and its meaning is: ${wotd.meaning}. The tweet should be engaging, concise (under 200 characters), and visually appealing. Use bold Unicode characters to highlight the word, and avoid using any asterisks(** **) or quotation marks for emphasis. Only use the formatting supported by tweet content: Like: ** can't be used to make the word bold in tweets instead use unicode characters like, bold serif 𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳 in place of the word to highlight it. Include emojis where appropriate but keep them minimal. Only use the #WordOfTheDay hashtag, no other hashtags.
            The content should encourage users to engage with the word, share their thoughts, or use it in sentences. It should prompt interaction like replies, likes, and retweets.
`);

        const imageContext = await Providers.gpt
            .pollinations(`Generate a prompt for an image generation ai. The image should describe or relate to the word: ${wotd.word}.\nThe word means: ${wotd.meaning}.\n\nIncorporate the word. Only respond with the description of the image, nothing else. The description should be less than 500 words. The image should be realistic and visually appealing to achieve high user engagement.\n\n\n

"
Generate a visually stunning and immersive image that brings the word ${wotd.word} to life. The image should capture the essence of the word and reflect its meaning (${wotd.meaning}) through a carefully crafted, realistic, and modern scene.

Instructions for Image Creation:
Dynamic Art Style:

Let the art style naturally reflect and enhance the meaning of the word. For example:
For powerful, intense words: Utilize bold, dramatic lighting and vivid contrasts.
For serene or reflective words: Apply soft, tranquil tones and gentle transitions.
For futuristic or technical words: Incorporate sleek, modern aesthetics with high detail.
Ensure the style aligns harmoniously with the emotional and conceptual tone of the word.
Scene Composition:

Design the image to visually convey the meaning of the word.
Incorporate elements, textures, and atmospheres that amplify the word’s significance, without being explicitly directed.
For example, if the word implies growth, the scene might intuitively depict flourishing elements like nature or an evolving structure. If the word signifies strength, the composition might evoke solidity, resilience, or grandeur.
Word Integration:

Seamlessly incorporate the word into the image in a visually engaging and creative way.
The word can interact with the environment, such as being part of the landscape, glowing in the sky, reflected in surfaces, or integrated into textures.
The typography and presentation of the word should resonate with its meaning, adding depth and impact to the overall artwork.
Realism and Engagement:

Use a realistic and modern approach with high attention to detail, vibrant colors, and captivating textures.
Avoid cartoonish elements, ensuring the composition feels grounded, authentic, and visually striking.
The image should evoke a strong emotional or intellectual response, immersing viewers in the meaning and story of the word.
Let the essence of the word guide every aspect of the image, from the setting to the style, ensuring it communicates the word’s meaning effectively and captivates the audience through creativity and realism.
"
`);

        const tweetImage = await Providers.image.pollinations(imageContext);

        const mediaId = await client.v1.uploadMedia(
            Buffer.from(tweetImage.image.data, "base64"),
            { mimeType: "image/jpeg" }
        );

        const tweetData = await client.v2.tweet({
            text: tweetContent,
            media: {
                media_ids: [mediaId],
            },
        });

        const pronunciationTweet = await client.v2.reply(`𝗣𝗿𝗼𝗻𝘂𝗻𝗰𝗶𝗮𝘁𝗶𝗼𝗻: ${wotd.pronunciation.text}`, tweetData.data.id);

        const etymologyTweet = await client.v2.reply(`𝗘𝘁𝘆𝗺𝗼𝗹𝗼𝗴𝘆: ${wotd.etymology}`, pronunciationTweet.data.id);

        await client.v2.reply(`𝗨𝘀𝗮𝗴𝗲: ${wotd.usage}`, etymologyTweet.data.id);


        return {
            status: true,
            data: {
                tweet: tweetData,
                meta: {
                    wotd,
                    tweetContent,
                    imageContext,
                    tweetImage,
                    mediaId,
                },
            },
        };
    } catch (error) {
        console.log(error);
        return { status: false };
    }
};