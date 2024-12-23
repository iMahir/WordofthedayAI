import { postTweet } from "./client";

async function post() {

    const tweet = await postTweet();
    console.log(tweet.status);

    return true;
}

post();
