import { Binjie } from "./gpt/binjie";
import { Easydiffusion } from "./image/easydiffusion";
import { Sdxl } from "./image/sdxl";
import { Wordsmith } from "./wotd/wordsmith";

export const Providers = {
    wotd: {
        wordsmith: Wordsmith
    },
    gpt: {
        binjie: Binjie
    },
    image: {
        sdxl: Sdxl,
        easydiffusion: Easydiffusion
    }
}