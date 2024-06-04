import { Binjie } from "./gpt/binjie";
import { Sydney } from "./gpt/sydney";
import { Aitubo } from "./image/aitubo";
import { Wordsmith } from "./wotd/wordsmith";

export const Providers = {
    wotd: {
        wordsmith: Wordsmith
    },
    gpt: {
        binjie: Binjie,
        sydney: Sydney
    },
    image: {
        aitubo: Aitubo
    }
}