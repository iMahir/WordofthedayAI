import axios from "axios"

export const PollinationsGPT = async (prompt: string) => {

    const response = await axios.post("https://text.pollinations.ai/", {
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        model: "openai"
    });

    if (!response.data) throw new Error(`[GPT Provider] Pollinations returned error`);

    return response.data;
}