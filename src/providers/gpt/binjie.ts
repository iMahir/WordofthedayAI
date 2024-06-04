import axios from "axios";

const BinjieBaseURL = "https://api.binjie.fun/api/generateStream";

export const Binjie = async (prompt: string) => {

    const response = await axios.post(BinjieBaseURL, {
        prompt,
        system: "Always talk in English.",
        withoutContext: true,
        stream: false
    }, {
        headers: {
            origin: "https://chat.jinshutuan.com",
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.79 Safari/537.36"
        }
    });

    if (response.status !== 200) throw new Error(`[GPT Provider] ${response.config.url} returned ${response.status}`);

    return response.data;
}