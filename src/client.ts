import { TweetV2PostTweetResult, TwitterApi } from 'twitter-api-v2';
import { Providers } from "./providers";
import { getEnv } from './helpers';
import axios from 'axios';

const webhooks = getEnv("WEBHOOKS").split(",");

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

        const tweetContent = await Providers.gpt.binjie(`Generate content for a twitter tweet. The tweet is about word of the day. The word is: ${wotd.word}, and means: ${wotd.meaning}. Don't forget to use #WordOfTheDay hashtag. Don't use any other hashtags. Use emojis if needed. Highlight the word by using Bold (sans) unicode characters instead of normal characters. Don't use "" or ** to highlight the word. The maximum characters in the tweet you generate should be less than 200 characters.`);

        const imageContext = await Providers.gpt.binjie(`Assume that you are a photographer and an artist. You have to create a description of an image. The image should relate to the word: ${wotd.word}. The word means: ${wotd.meaning}. Make sure you include details of the various things or objects in the scene. Use the following tips while generating the description: 1. Describe the content of your image. 2. Describe the subject. 3. Add relevant details. 4. Describe the form and style. 5. Define the composition.. Don't use very difficult words in the description, keep it simple and easy to understand. Don't use overly complicated or uncommon words in the description. Use more adjectives in the description. Only respond with the description of the image, nothing else. The description should be less than 250 words.`);

        const tweetImage = await Providers.image.aitubo(imageContext);

        const mediaId = await client.v1.uploadMedia(Buffer.from(tweetImage.image.data, "base64"), { mimeType: "image/jpeg" });

        const tweetData = await client.v2.tweet({
            text: tweetContent,
            media: {
                media_ids: [mediaId]
            }
        });

        return {
            status: true, data: {
                tweet: tweetData,
                meta: {
                    wotd,
                    tweetContent,
                    imageContext,
                    tweetImage,
                    mediaId
                }
            }
        };
    } catch (error) {
        console.log(error);
        return { status: false };
    }
}

export const postDiscord = async (tweet: PostTweet) => {
    if (!tweet.data) return;

    const payload = {
        content: null,
        embeds: [
            {
                description: tweet.data.meta.tweetContent,
                color: 1447446,
                author: {
                    name: "WordofthedayAI",
                    icon_url: "https://pbs.twimg.com/profile_images/1705203765585002496/Ng2ZBnh8.jpg"
                },
                image: {
                    url: tweet.data.meta.tweetImage.image.url
                }
            }
        ],
        attachments: []
    }

    webhooks.forEach(async (webhook) => {
        axios.post(webhook, payload).catch(console.log);
    });
}