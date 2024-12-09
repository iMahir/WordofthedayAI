import { postTweet } from "./client";

async function post() {

    const tweet = await postTweet();
    if (!tweet.status) throw new Error("Error while posting tweet");

    return true;
}

post();