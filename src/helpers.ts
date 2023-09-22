import axios, { AxiosRequestConfig } from "axios";
import { config } from "dotenv";

config();

let arraySwitcherIndex = 0;
function arraySwitcher<T>(arr: T[]) {
    if (arraySwitcherIndex >= arr.length) {
        arraySwitcherIndex = 0;
    }
    return arr[arraySwitcherIndex++];
}

export function getEnv(varName: string, useSwitcher?: true) {
    const enVar = process.env[varName];
    if (!enVar) throw new Error(`ENV variable not found: ${varName}`);

    if (useSwitcher) {
        const enVars = enVar.split(",").map((v) => v.trim());
        return arraySwitcher(enVars)
    }
    return enVar;
}

export function isJSON(str: string) {
    try {
        JSON.stringify(str);
        return true;
    } catch (_) {
        return false;
    }
}

export function isObject(str: string) {
    try {
        JSON.parse(str);
        return true;
    } catch (_) {
        return false;
    }
}


const rapidapiHost = "cloudflare-bypass2.p.rapidapi.com";

const cfBypassHost = "https://cloudflare-bypass2.p.rapidapi.com";

export const proxyGet = async (url: string, config?: AxiosRequestConfig<any>) => {
    const rapidapiKey = getEnv("RAPIDAPI_KEY", true);
    let res = await axios.get(`${cfBypassHost}?url=${encodeURI(url)}`, {
        ...config,
        headers: {
            ...config?.headers,
            "X-RapidAPI-Key": rapidapiKey,
            "X-RapidAPI-Host": rapidapiHost
        }
    });

    const decodedRes = atob(res.data);
    if (isObject(decodedRes)) res.data = JSON.parse(decodedRes);
    return res;
}

export const proxyPost = async (url: string, config?: AxiosRequestConfig<any>) => {
    const rapidapiKey = getEnv("RAPIDAPI_KEY", true);
    let res = await axios(`${cfBypassHost}?url=${encodeURI(url)}`, {
        ...config,
        method: "POST",
        headers: {
            ...config?.headers,
            "content-type": "application/json",
            "X-RapidAPI-Key": rapidapiKey,
            "X-RapidAPI-Host": rapidapiHost
        }
    });

    const decodedRes = atob(res.data);
    if (isObject(decodedRes)) res.data = JSON.parse(decodedRes);
    return res;
}

export const cfProxy = {
    get: proxyGet,
    post: proxyPost
}