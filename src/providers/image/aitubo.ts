import axios from "axios";
import { getEnv } from "../../helpers";

const baseURL = "https://creator.aitubo.ai/api";

const apiKey = getEnv("AITUBO_API_KEY");

export const Aitubo = async (prompt: string) => {


    const job = await axios.post(`${baseURL}/job/create`, {
        width: 1536,
        height: 864,
        prompt,
        steps: 50,
        modelId: "657d044d91ee83b5d3c5894e",
        modelName: "DreamShaper XL",
        scheduler: "DPMSolverMultistep",
        count: 1,
        styles: ["Aitubo"]
    },
        {
            headers: {
                "Authorization": `Bearer ${apiKey}`
            }
        });

    if (job.data.code !== 0) throw new Error("Error creating a new job");

    const jobId = job.data.data.id;

    let jobStatus = await axios.get(`${baseURL}/job/get?id=${jobId}`);
    if (jobStatus.data.code !== 0) throw new Error("Error getting job status");

    while (jobStatus.data.data.status !== 2) {
        await new Promise(r => setTimeout(r, 1000));
        jobStatus = await axios.get(`${baseURL}/job/get?id=${jobId}`);
    }

    const jobResult = await axios.get(`${baseURL}/job/get?id=${jobId}`);
    if (jobResult.data.code !== 0) throw new Error("Error getting job result");


    const upscale = await axios.post(`${baseURL}/job/upscale`, {
        imagePath: jobResult.data.data.result.data.images[0],
        artId: jobResult.data.data.result.data.artIds[0],
        upscaleFactor: 4
    }, {

        headers: {
            "Authorization": `Bearer ${apiKey}`
        }
    });
    if (upscale.data.code !== 0) throw new Error("Error upscaling image");

    let upscaleStatus = await axios.get(`${baseURL}/job/get?id=${upscale.data.data.id}`);
    if (upscaleStatus.data.code !== 0) throw new Error("Error getting upscale status");

    while (upscaleStatus.data.data.status !== 2) {
        await new Promise(r => setTimeout(r, 1000));
        upscaleStatus = await axios.get(`${baseURL}/job/get?id=${upscale.data.data.id}`);
    }

    const upscaleResult = await axios.get(`${baseURL}/job/get?id=${upscale.data.data.id}`);
    if (upscaleResult.data.code !== 0) throw new Error("Error getting upscale result");

    const imageBase64 = await axios.get(`${upscaleResult.data.data.result.data.domain}/${upscaleResult.data.data.result.data.images[0]}` , {
        responseType: "arraybuffer"
    }).then((response) => {
        return Buffer.from(response.data, "binary").toString("base64");
    });

    return {
        prompt,
        width: 1536,
        height: 864,
        image: {
            data: imageBase64,
            type: "base64"
        }
    }
}