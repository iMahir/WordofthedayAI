import express from "express";
import { postTweet } from "./client";

const app = express();
const PORT = process.env.PORT ?? 5000;

app.get("/", (req, res) => {
    res.status(200).send("OK");
});

app.get("/post", async (req, res) => {

    try {

        const beforeDate = Date.now();
        const status = await postTweet();
        const afterDate = Date.now();

        if (status) return res.status(200).send({ status: "success", time_taken: afterDate - beforeDate })
        else return res.status(500).send({ status: "error" });

    } catch (error) {

        res.status(500).send({ status: "error" });
        console.log(error);

    }

});

app.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`);
});