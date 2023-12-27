import axios from "axios";

import {client} from "./gradio/client";
import { writeFile } from "fs";

export const Pixart = async (prompt: string) => {

//     const app = await client("https://g-app-center-40033459-0290-a9wo6ry.openxlab.space")


//    const res = await app.predict("/api",
//        [
//         2,
//         "A modern house", // string  in 'Prompt' Textbox component		
//         "", // string  in 'Negative prompt' Textbox component		
//         "(No style)", // string  in 'Image Style' Radio component		
//         false, // boolean  in 'Use negative prompt' Checkbox component		
//         0, // number (numeric value between 0 and 2147483647) in 'Seed' Slider component		
//         1024, // number (numeric value between 256 and 1024) in 'Width' Slider component		
//         1024, // number (numeric value between 256 and 1024) in 'Height' Slider component		
//         10, // number (numeric value between 1 and 20) in 'Guidance scale' Slider component		
//         80, // number (numeric value between 10 and 100) in 'Number of inference steps' Slider component		
//         true, // boolean  in 'Randomize seed' Checkbox component
//        ]
//     )

//     console.log(res)

const app = await client("https://g-app-center-40033459-0290-a9wo6ry.openxlab.space/" , {
    
});
const result : any = await app.predict("/run", [		
				"A modern house", // string  in 'Prompt' Textbox component		
				"", // string  in 'Negative prompt' Textbox component		
				"Cinematic", // string  in 'Image Style' Radio component		
				false, // boolean  in 'Use negative prompt' Checkbox component		
				0, // number (numeric value between 0 and 2147483647) in 'Seed' Slider component		
				512, // number (numeric value between 256 and 1024) in 'Width' Slider component		
				512, // number (numeric value between 256 and 1024) in 'Height' Slider component		
				1, // number (numeric value between 1 and 20) in 'Guidance scale' Slider component		
				50, // number (numeric value between 10 and 100) in 'Number of inference steps' Slider component		
				true, // boolean  in 'Randomize seed' Checkbox component
	]);

console.log(result);


}

