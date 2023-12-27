import { Binjie } from "./gpt/binjie";
import { Aitubo } from "./image/aitubo";
import { Wordsmith } from "./wotd/wordsmith";

export const Providers = {
    wotd: {
        wordsmith: Wordsmith
    },
    gpt: {
        binjie: Binjie
    },
    image: {
        aitubo: Aitubo
    }
}