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


export default prescriptionRouter;
