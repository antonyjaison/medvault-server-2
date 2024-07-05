import { Router } from 'express';
import { SinchClient } from '@sinch/sdk-core';

const emergencyContactRouter2 = Router();

emergencyContactRouter2.post('/send-emergency', async (req, res) => {

    const { userDetails, emergencyContacts } = req.body

    console.log({
        userDetails,
        emergencyContacts
    })

    const name = userDetails.name
    const longitude = userDetails.location.coords.longitude
    const latitude = userDetails.location.coords.latitude
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`
    const alertMessage = `
    🚨 Emergency Alert from MedVault 🚨
        
    Dear Emergency Contact,
        
        This is an automated alert regarding ${name}. They have activated an emergency SOS signal indicating they may need immediate assistance.
        
        Current Location:
        ${mapUrl}
        
        Latitude: ${latitude}
        Longitude: ${longitude}
        
        Please contact them as soon as possible to ensure their safety. If you are unable to reach them, consider notifying local emergency services and provide them with the location details above.
        
        Thank you for your prompt attention to this urgent matter.
        
        Sincerely,
        MedVault Emergency Alert System
    `;

    try {
        const sinchClient = new SinchClient({
            applicationKey: process.env.SINCH_APP_KEY,
            applicationSecret: process.env.SINCH_APP_SECRET,
            projectId: process.env.SINCH_PROJECT_ID,
            keyId: process.env.ACCESSKEY,
            keySecret: process.env.ACCESSSECRET
        });

        // Send SMS
        const smsResponse = await sinchClient.sms.batches.send({
            sendSMSRequestBody: {
                to: emergencyContacts.map(contact => '+91' + contact.phone),
                from: process.env.SINCH_NUMBER,
                body: alertMessage
            }
        });

        console.log('SMS Response:', JSON.stringify(smsResponse));

        // Loop through contacts and send TTS call to each
        const callResponses = [];
        for (const contact of emergencyContacts) {
            const callResponse = await sinchClient.voice.callouts.tts({
                ttsCalloutRequestBody: {
                    method: 'ttsCallout',
                    ttsCallout: {
                        cli: process.env.SINCH_NUMBER,
                        destination: {
                            type: 'number',
                            endpoint: '+91'+contact.phone
                        },
                        text: 'Your friend is in danger. Please contact them immediately.'
                    }
                }
            });
            callResponses.push(callResponse);
        }

        console.log('Call Responses:', JSON.stringify(callResponses));

        res.send({
            smsResponse,
            callResponses
        });
    } catch (error) {
        console.error('Error sending emergency messages:', error);
        res.status(500).send({ error: 'Failed to send emergency messages' });
    }
});

export default emergencyContactRouter2;
