import { postDiscord, postTweet } from "./client";

async function post() {

    const tweet = await postTweet();
    if(!tweet.status) throw new Error("Error while posting tweet");

    await postDiscord(tweet);
    
    return true;
}

post();