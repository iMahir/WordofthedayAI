import { Binjie } from "./gpt/binjie";
import { Sydney } from "./gpt/sydney";
import { PollinationsGPT } from "./gpt/pollinations";
import { Aitubo } from "./image/aitubo";
import { PollinationsImage } from "./image/pollinations";
import { Wordsmith } from "./wotd/wordsmith";

export const Providers = {
    wotd: {
        wordsmith: Wordsmith
    },
    gpt: {
        binjie: Binjie,
        sydney: Sydney,
        pollinations: PollinationsGPT
    },
    image: {
        aitubo: Aitubo,
        pollinations: PollinationsImage
    }
}