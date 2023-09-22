import express from "express";
import { postTweet } from "./client";

const app = express();
const PORT = process.env.PORT ?? 5000;

app.get("/", (req, res) => {
    res.status(200).send("OK");
});

let lastPostStats = {
    status: "unknown",
    time_taken: 0
}

app.get("/post", async (req, res) => {

    res.status(200).send({ status: "initiated" });

    try {

        const beforeDate = Date.now();
        const status = await postTweet();
        const afterDate = Date.now();

        lastPostStats = {
            status: status ? "success" : "error",
            time_taken: afterDate - beforeDate
        }

    } catch (error) {

        lastPostStats = {
            status: "error",
            time_taken: -1
        }
        console.log(error);

    }
});

app.get("/post/last", (req, res) => {
    res.status(lastPostStats.status === "success" ? 200 : 500).send(lastPostStats);
});

app.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`);
});