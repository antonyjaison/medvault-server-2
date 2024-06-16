import axios from 'axios';

async function getImageBase64(url) {
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        });
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        return base64Image;
    } catch (error) {
        console.error('Error fetching or converting image:', error);
        throw error;
    }
}

export default getImageBase64;
