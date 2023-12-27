/*
import { AIHorde } from "@zeldafan0225/ai_horde";

const horde = new AIHorde({
    cache_interval: 1000 * 10,
    cache: {
        generations_check: 1000 * 2
    }
});


export const aiHorde = async (prompt: string) => {

    const image = await horde.postAsyncImageGenerate({
        prompt: prompt,
        models: [
            "Experience"
        ],
        nsfw: false
    });

    if(!image.id) return null;

    const imageCheck = await check(image.id);
    
    console.log(imageCheck);
};

async function check(id: string): Promise<any> {
    const imageCheck = await horde.getImageGenerationCheck(id);   
    console.log(imageCheck);
 
    if(!imageCheck.done) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return await check(id);
    }
    return imageCheck;
}
*/