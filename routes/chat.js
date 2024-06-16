import {
    GoogleGenerativeAI,
} from "@google/generative-ai";
import { Router } from 'express'

const chatRouter = Router();

const apiKey = 'AIzaSyB9eTEl-szHeULqqhV2yFqyoKMOUvCiW34';
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

chatRouter.get('/:text', async (req, res) => {
    const { text } = req.params;
    console.log(text)

    try {
        const chatSession = model.startChat({
            generationConfig,

            history: [
                {
                    role: "user",
                    parts: [
                        { text: "you are bloom AI, you are created for responding all queries related to medical fields, example medicine related, symptoms of diseases etc. Don't answer other than medical queries" },
                    ],
                },
                {
                    role: "model",
                    parts: [
                        { text: "I understand! Please ask me your medical question. I'm here to help you find information about various medical topics, including:\n\n* **Diseases and their symptoms:**  Tell me about your symptoms, and I can provide information about potential causes.\n* **Medicines and their uses:**  I can explain the purpose, side effects, and interactions of different medications.\n* **Medical procedures and treatments:**  I can give you information about various medical procedures and treatments.\n* **General health and wellness:**  I can offer advice on maintaining a healthy lifestyle and preventing common illnesses. \n\n**Please remember, I am not a medical professional and cannot provide medical advice. This information should not be used as a substitute for professional medical advice, diagnosis, or treatment.** \n\nI am eager to assist you with your medical queries.  Let me know what's on your mind! \n" },
                    ],
                },
            ],
        });

        const result = await chatSession.sendMessage(text);
        res.status(200).json(result.response.text());

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

export default chatRouter;