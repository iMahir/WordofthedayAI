import axios from "axios";

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.5',
    'Referer': 'https://replicate.com/stability-ai/sdxl',
    'Content-Type': 'application/json',
    'Origin': 'https://replicate.com',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'TE': 'trailers'
};

const versionHash = "2b017d9b67edd2ee1401238df49d75da53c523f36e363881e057f5dc3ed3c5b2";

const baseUrl = `https://replicate.com/api/models/stability-ai/sdxl/versions/${versionHash}/predictions`;

export const Sdxl = async (prompt: string) => {

    const response = await axios.post(baseUrl, {
        inputs: {
            width: 1024,
            height: 576,
            prompt,
            refine: "expert_ensemble_refiner",
            scheduler: "DDIM", // ["DDIM", "DPMSolverMultistep", "HeunDiscrete", "KarrasDPM", "K_EULER_ANCESTRAL", "K_EULER", "PNDM"]
            num_outputs: 1,
            guidance_scale: 7.5,
            high_noise_frac: 0.8,
            prompt_strength: 0.8,
            num_inference_steps: 400
        }
    }, {
        headers
    });
    if (response.status !== 201) throw new Error(`${response.config.url} returned ${response.status}`);

    const uuid = response.data.uuid;

    const data = await getImage(uuid);
    return data;
}

async function getImage(uuid: string) {

    const response = await axios.get(`${baseUrl}/${uuid}`, { headers });
    if (response.status !== 200) throw new Error(`${response.config.url} returned ${response.status}`);

    const { prediction } = response.data;

    console.log(prediction['status'])
    if (prediction['status'] == "succeeded") {
        return {
            width: prediction.inputs.width,
            height: prediction.inputs.height,
            prompt: prediction.inputs.prompt,
            image: prediction['output_files'][0] ?? null
        }
    }
    else getImage(uuid);
}