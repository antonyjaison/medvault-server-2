import { Router } from 'express';
import Anthropic from "@anthropic-ai/sdk";
import getImageBase64 from '../utils/base64.js';

const prescriptionRouter = Router();

prescriptionRouter.post('/prescription-data', async (req, res) => {
    console.log('Request received');

    // const { image } = req.body
    // console.log(image);
    const image = 'https://firebasestorage.googleapis.com/v0/b/medvault-1ca13.appspot.com/o/prescription%2F1718704249960_IMG-20240618-WA0042.jpg?alt=media&token=d6710e5b-f1c6-41b2-b73b-3623299906e4'

    try {
            const base64Image = await getImageBase64(image);

            const anthropic = new Anthropic({
                apiKey: process.env.ANTHROPIC_API_KEY,
            });

            const msg = await anthropic.messages.create({
                model: "claude-3-opus-20240229",
                max_tokens: 1000,
                temperature: 0,
                messages: [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "from the image return a json file of list of pills along with how many times it should be taken and any other remark as an object; name:str, dose:str, frequency:number, remarks:long natural language str; return json data only without language marking. I need the data as array of objects don't use any formatting methods, you can also give me in the format that the array is stringity, then I can parse the array"
                            },
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": "image/jpeg",
                                    "data": base64Image
                                }
                            }
                        ]
                    }
                ]
            });
            console.log(msg.content[0].text);
            res.status(200).json(msg.content[0].text);

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('An error occurred while processing your request.');
    }
});


// prescriptionRouter.get('/prescription-data', async (req, res) => {
//     console.log('Request received');

//     const imageUrl = 'https://media.tumblr.com/fa1b2e9d2e5464e495f81ca83da88533/tumblr_inline_mle2yerIZy1qz4rgp.jpg'

//     const MODEL_NAME = "gemini-1.0-pro-vision-latest";
//     const API_KEY = "AIzaSyDFhnm1R2_HY9o6YCNkrroNoUSuq-0mT5o";

//     const response = await axios.get(imageUrl, {
//         responseType: 'arraybuffer'
//     });

//     const base64Image = Buffer.from(response.data, 'binary').toString('base64');

//     const genAI = new GoogleGenerativeAI(API_KEY);
//     const model = genAI.getGenerativeModel({ model: MODEL_NAME });

//     const generationConfig = {
//         temperature: 0.4,
//         topK: 32,
//         topP: 1,
//         maxOutputTokens: 4096,
//     };
//     const safetySettings = [
//         {
//             category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//             threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//         },
//         {
//             category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
//             threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//         },
//         {
//             category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
//             threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//         },
//         {
//             category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
//             threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//         },
//     ];

//     const parts = [
//         { text: "YOU CAN REPLY IN A DETAILED RESPONSE ONLY. SEND ME A SHORT EXPLANATION OF THE LECTURE NOTE OF THE IMAGE I SEND YOU. \n\n" },
//         { inlineData: { mimeType: "image/jpg", data: base64Image } },
//     ];

//     try {
//         const result = await model.generateContent({
//             contents: [{ role: "user", parts }],
//             generationConfig,
//             safetySettings,
//         });

//         const response = result.response;
//         console.log(response.text());
//         res.send(response.text());

//     } catch (error) {
//         console.error('Error processing request:', error);
//         res.status(500).send('An error occurred while processing your request.');
//     }



// });

export default prescriptionRouter;
