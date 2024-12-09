import axios from "axios"
import { writeFileSync } from "fs";

const baseURL = "https://fluximagegenerator.ai/api/huggingface";

export const Flux = async (prompt: string) => {

    const payload = {
        prompt,
        height: 576,
        width: 1024,
        version: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell"
    }

    const response = await axios.post(`${baseURL}`, payload, {
        headers: {
            "Content-Type": "application/json"
        },
        responseType: "arraybuffer"
    });

    const filePath = "flux-image2.jpg";

    const imageBuffer = Buffer.from(response.data);

    writeFileSync(filePath, imageBuffer);

    return {
        prompt,
        width: 1024,
        height: 576,
        image: {
            url: null,
            data: imageBuffer.toString("base64"),
            type: "base64"
        }
    }

}

// https://image.pollinations.ai/prompt/The%20word%20%22Serenity%22%20is%20centered%20in%20the%20image,%20floating%20gracefully%20against%20a%20tranquil%20scene%20of%20a%20calm%20lake%20reflecting%20the%20soft%20pastel%20hues%20of%20a%20setting%20sun.%20Surrounding%20the%20lake%20are%20lush,%20rolling%20hills%20and%20a%20few%20scattered%20wildflowers%20swaying%20gently%20in%20the%20breeze.%20The%20sky%20above%20transitions%20smoothly%20from%20warm%20oranges%20to%20cool%20purples,%20creating%20an%20atmosphere%20of%20peace%20and%20stillness.%20The%20word%20subtly%20blends%20into%20the%20scenery,%20enhancing%20the%20sense%20of%20quiet%20and%20harmony?model=flux-pro&nologo=true&width=1024&height=576

Flux(`The word "Serenity" is centered in the image, floating gracefully against a tranquil scene of a calm lake reflecting the soft pastel hues of a setting sun. Surrounding the lake are lush, rolling hills and a few scattered wildflowers swaying gently in the breeze. The sky above transitions smoothly from warm oranges to cool purples, creating an atmosphere of peace and stillness. The word subtly blends into the scenery, enhancing the sense of quiet and harmony`);