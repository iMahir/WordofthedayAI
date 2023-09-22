import { config } from "dotenv";
import { TwitterApi } from 'twitter-api-v2';
import { Providers } from "./providers";

config();

function getEnv(varName: string) {
    const enVar = process.env[varName];
    if (!enVar) throw new Error(`ENV variable not found: ${varName}`);
    return enVar;
}

const client = new TwitterApi({
    appKey: getEnv("API_KEY"),
    appSecret: getEnv("API_SECRET"),
    accessToken: getEnv("ACCESS_TOKEN"),
    accessSecret: getEnv("ACCESS_SECRET"),
});

export const postTweet = async () => {

    try {

        const wotd = await Providers.wotd.wordsmith();

        const tweetContent = await Providers.gpt.binjie(`Generate content for a twitter tweet. The tweet is about word of the day. The word is: ${wotd.word}, and means: ${wotd.meaning}. Don't forget to use #WordOfTheDay hashtag. Don't use any other hashtags. Use emojis if needed. Highlight the word by using Bold (sans) unicode characters instead of normal characters. Don't use "" or ** to highlight the word. The maximum characters in the tweet you generate should be less than 200 characters.`);

        const imageContext = await Providers.gpt.binjie(`Assume that you are a photographer and an artist. You have to create a description of an image. The image should relate to the word: ${wotd.word}. The word means: ${wotd.meaning}. Make sure you include details of the various things or objects in the scene. Use the following tips while generating the description: 1. Describe the content of your image. 2. Describe the subject. 3. Add relevant details. 4. Describe the form and style. 5. Define the composition.. Don't use very difficult words in the description, keep it simple and easy to understand. Don't use overly complicated or uncommon words in the description. Use more adjectives in the description. Only respond with the description of the image, nothing else. The description should be less than 250 words.`);

        const tweetImage = await Providers.image.easydiffusion(imageContext);

        const mediaId = await client.v1.uploadMedia(Buffer.from(tweetImage.image.data, "base64"), { mimeType: "image/jpeg" });

        await client.v2.tweet({
            text: tweetContent,
            media: {
                media_ids: [mediaId]
            }
        });

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}