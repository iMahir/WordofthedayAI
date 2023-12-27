import axios from "axios";

const project = "projects/mjpyeon/epic-realism/models/natural-sin-rc1-vae-base-v3.1";

const BaseUrl =
    "https://tungsten.run/api/v1";

export const Tungsten = async (prompt: string) => {
    const initialReq = await predict(prompt);
    if (initialReq.status === false) return null;

    const uid = initialReq.data?.id;
    if (!uid) return null;

    const data = await getImage(uid);
    return data;
};

interface PredictResponse {
    id: string;
    status: "pending" | "success",
    output: null | { images: string[] }
}

async function predict(prompt: string): Promise<{ status: boolean, data: PredictResponse | null }> {
    try {

        await axios.get(`https://tungsten.run`);

        const response = await axios.post(`${BaseUrl}/${project}/predict`, {
            input: {
                brightness: 0,
                cfg_scale: 5,
                clip_skip: true,
                contract: 0,
                detail: 0,
                disable_property_modification: false,
                negative_prompt:
                    "asian, chinese, text, error, cropped, ugly, duplicate, morbid, mutilated, out of frame, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, username, watermark, signature",
                num_output: 1,
                prompt,
                reference_depth_strength: 1,
                reference_image_strength: 1,
                reference_pose_strength: 1,
                samping_steps: 100,
                sampler: "Restart",
                saturation: 0,
                seed: -1,
                vae: "None",
                width: 1024,
                height: 576,
            },
            is_demo: true
        });

        return {
            status: true,
            data: response.data
        };
    } catch (error) {
        console.log(error);
        return {
            data: null,
            status: false
        };
    }
}

async function getImage(uid: string) {
    const response = await axios.get(`${BaseUrl}/predictions/${uid}`);
    if (response.status !== 200) throw new Error(`${response.config.url} returned ${response.status}`);
    const prediction = response.data as PredictResponse;

    if (prediction.status === "success") {
        return {
            image: prediction.output?.images[0] ?? null
        };
    } else {
        return getImage(uid);
    }
}
