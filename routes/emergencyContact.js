import { Router } from 'express'

const emergencyContactRouter = Router()


emergencyContactRouter.post('/send-emergency', async (req, res) => {
    console.log('Request received')

    const { location, emergencyContacts } = req.body

    console.log(location, emergencyContacts)

})
export default emergencyContactRouter
