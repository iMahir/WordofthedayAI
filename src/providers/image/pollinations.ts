import axios from "axios";

const baseURL = "https://image.pollinations.ai/prompt";

export const PollinationsImage = async (prompt: string) => {

    const width = 1920;
    const height = 1080;

    const fetchUrl = `${baseURL}/${encodeURIComponent(prompt)}?nologo=true&model=gptimage&width=${width}&height=${height}&enhance=false`;

    const response = await axios.get(fetchUrl, {
        responseType: "arraybuffer"
    });

    if (!response.data) throw new Error("No data returned from Pollinations");

    const buffer = Buffer.from(response.data)

    return {
        prompt,
        width,
        height,
        image: {
            url: fetchUrl,
            data: buffer.toString("base64"),
            type: "base64"
        }
    }
}
