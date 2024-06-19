import { Router } from 'express'
import twilio from 'twilio'
const emergencyContactRouter = Router()


emergencyContactRouter.post('/send-emergency', async (req, res) => {
    console.log('Request received')

    const { userDetails, emergencyContacts } = req.body

    console.log(emergencyContacts)

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

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH)

    emergencyContacts.forEach(async (contact) => {
        try {
            await client.messages.create({
                body: alertMessage,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: '+91' + contact.phone
            }).then(() => {
                client.calls.create({
                    twiml: `<Response><Say voice="alice">Emergency! I am in danger. My location is: ${'Angamaly'}</Say></Response>`,
                    to: '+91' + contact.phone,
                    from: process.env.TWILIO_PHONE_NUMBER
                })
            })
        } catch (error) {
            console.error('Error sending message:', error)
        }
    })

})
export default emergencyContactRouter
