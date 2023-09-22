import axios from "axios";
import { load } from "cheerio";

const WordsmithBaseURL = "https://wordsmith.org";

export const Wordsmith = async () => {

    const base = await axios.get(`${WordsmithBaseURL}/words/today.html`);
    if (base.status !== 200) throw new Error(`${base.config.url} returned ${base.status}`);

    const $ = load(base.data);

    const word = $("h3").text().trim();


    const pronunciationDiv = $(`div:contains("PRONUNCIATION:")`);
    const pronunciationTextElement = pronunciationDiv.next();

    const pronunciation = {
        text: pronunciationTextElement.text().trim(),
        audio: pronunciationTextElement.find("a").attr("href") ?? null
    }


    const meaningDiv = $(`div:contains("MEANING:")`);
    const meaningTextElement = meaningDiv.next();

    const meaning = meaningTextElement.text().trim();


    const etymologyDiv = $(`div:contains("ETYMOLOGY:")`);
    const etymologyTextElement = etymologyDiv.next();

    const etymology = etymologyTextElement.text().replace(/\s+/g, ' ').trim();


    const usageDiv = $(`div:contains("USAGE:")`);
    const usageTextElement = usageDiv.next();

    const usage = usageTextElement.text().trim();


    return {
        word,
        pronunciation,
        meaning,
        etymology,
        usage
    }
}