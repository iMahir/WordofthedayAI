import { SydneyClient } from "bing-sydney-ai";

export const Sydney = async (prompt: string) => {

    let sydney = new SydneyClient();
    await sydney.startConversation();
    sydney.setSearch(false);


    const response = await sydney.ask(prompt);

    if (!response.text) throw new Error(`[GPT Provider] Sydney returned error`);

    return response.text;
}