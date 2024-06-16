import { GoogleAIFileManager } from "@google/generative-ai/files"

const apiKey = 'AIzaSyB9eTEl-szHeULqqhV2yFqyoKMOUvCiW34';
const fileManager = new GoogleAIFileManager(apiKey);

async function uploadToGemini(path, mimeType) {
    const uploadResult = await fileManager.uploadFile(path, {
        mimeType,
        displayName: path,
    });
    const file = uploadResult.file;
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
    return file;
}


export default uploadToGemini;