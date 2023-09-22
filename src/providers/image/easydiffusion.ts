import axios from "axios";
import { cfProxy, isJSON } from "../../helpers";

const maxSleeps = 30;
let sleepCount = 0;
function sleep(ms: number) {
    if (sleepCount === maxSleeps) throw new Error("Sleep count exceeded");
    sleepCount++;
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const baseUrl = "https://stablediffusion.gigantic.work";

interface IData {
    prompt: string;
    width: number;
    height: number;
    image: {
        data: string;
        type: "base64"
    }
}

export const Easydiffusion = async (prompt: string): Promise<IData> => {
    await axios.get(baseUrl);

    const ping = await cfProxy.get(`${baseUrl}/ping`, {
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (ping.data.status !== "Online") {
        await sleep(1000 * 10);
        return await Easydiffusion(prompt);
    }

    const render = await cfProxy.post(`${baseUrl}/render`, {
        data: {
            active_tags: [],
            block_nsfw: true,
            clip_skip: false,
            guidance_scale: 7.5,
            inactive_tags: [],
            latent_upscaler_steps: "50",
            metadata_output_format: "json",
            negative_prompt: "",
            num_inference_steps: 50,
            num_outputs: 1,
            output_format: "jpeg",
            output_lossless: false,
            output_quality: 95,
            sampler_name: "dpmpp_2m",
            save_to_disk_path: "/data/easy-diffusion-images",
            show_only_filtered_image: true,
            stream_image_progress: false,
            stream_progress_updates: true,
            upscale_amount: "2",
            use_face_correction: "GFPGANv1.4",
            use_stable_diffusion_model: "sd_xl_base_1.0",
            use_upscale: "latent_upscaler",
            use_vae_model: "sdxl_vae",
            used_random_seed: true,
            vram_usage_level: "balanced",
            width: 1024,
            height: 576,
            prompt,
        }
    });

    if (render.data.status !== "Online") {
        await sleep(1000 * 2);
        return await Easydiffusion(prompt);
    }

    const streamPath = render.data.stream;

    const data = await streamData(`${baseUrl}${streamPath}`);

    const base64Image = data.output[0].data
    const dataParts = base64Image.split(';base64,');
    const base64Data = dataParts[1];

    return {
        prompt: data.render_request.prompt,
        width: data.render_request.width,
        height: data.render_request.height,
        image: {
            data: base64Data,
            type: "base64"
        }
    }
};


async function streamData(url: string): Promise<{
    render_request: {
        prompt: string;
        width: number;
        height: number;
    };
    output: {
        data: string;
    }[];
}> {
    const stream = await cfProxy.get(url);
    const jsonData = isJSON(stream.data);

    if (jsonData && stream.data.status === "succeeded") {
        return stream.data;
    }
    else {
        await sleep(1000 * 60);
        return await streamData(url);
    }
}