import { Router } from 'express';
import Anthropic from "@anthropic-ai/sdk";
import getImageBase64 from '../utils/base64.js';
import { GoogleGenerativeAI, HarmCategory } from "@google/generative-ai";
import uploadToGemini from '../utils/uploadToGemini.js';


const prescriptionRouter = Router();

// prescriptionRouter.get('/prescription-data', async (req, res) => {
//     const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/medvault-1ca13.appspot.com/o/prescription%2F1714508824229_IMG-20240430-WA0002.jpg?alt=media&token=2ff20503-1dc0-4f07-9721-c3ab6a309a3e';
//     console.log('Request received');

//     try {
//         const base64Image = await getImageBase64(imageUrl);

//         console.log(base64Image)


//         const anthropic = new Anthropic({
//             apiKey: process.env.ANTHROPIC_API_KEY, // defaults to process.env["ANTHROPIC_API_KEY"]
//         });

//         const msg = await anthropic.messages.create({
//             model: "claude-3-opus-20240229",
//             max_tokens: 1000,
//             temperature: 0,
//             messages: [
//                 {
//                     "role": "user",
//                     "content": [
//                         {
//                             "type": "text",
//                             "text": "from the image return a json file of list of pills along with how many times it should be taken and any other remark as an object; name:str, dose:str, frequency:number, remarks:long natural language str; return json data only without language marking. I need the data as array of objects don't use any formatting methods, you can also give me in the format that the array is stringity, then I can parse the array"
//                         },
//                         {
//                             "type": "image",
//                             "source": {
//                                 "type": "base64",
//                                 "media_type": "image/jpeg",
//                                 "data": base64Image
//                             }
//                         }
//                     ]
//                 }
//             ]
//         });
//         console.log(msg);


//     } catch (error) {
//         console.error('Error processing request:', error);
//         res.status(500).send('An error occurred while processing your request.');
//     }
// });


prescriptionRouter.get('/prescription-data', async (req, res) => {
    const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/medvault-1ca13.appspot.com/o/prescription%2F1714508824229_IMG-20240430-WA0002.jpg?alt=media&token=2ff20503-1dc0-4f07-9721-c3ab6a309a3e';
    console.log('Request received');

    const genAI = new GoogleGenerativeAI('AIzaSyB9eTEl-szHeULqqhV2yFqyoKMOUvCiW34');

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });

    const generationConfig = {
        temperature: 2,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 1024,
        responseMimeType: "text/plain",
    };

    const files = [
        await uploadToGemini("prescription.png", "image/png"),
    ];

    try {
        const chatSession = model.startChat({
            generationConfig,
            history: [
                {
                    role: "user",
                    parts: [
                        {
                            fileData: {
                                mimeType: files[0].mimeType,
                                fileUri: files[0].uri,
                            },
                        },
                        { text: "analyse this image" },
                    ],
                },
            ],
        });

        const result = await chatSession.sendMessage("analyse this image");
        console.log(result.response.text());
        res.status(200).send(result.response.text());

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('An error occurred while processing your request.');
    }


});

export default prescriptionRouter;
