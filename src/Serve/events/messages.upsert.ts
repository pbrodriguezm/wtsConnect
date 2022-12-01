import events from "events"
import Whatsapp from "../../sqlz/models/Whatsapp"
import { Sender, MessageIN ,  Payload as PayloadIN } from "../modelEvents/Messages"

const messagesUpsert = async (upsert:any, whatsapp:Whatsapp): Promise<MessageIN> => {
    let resultBody:any = []
    upsert.messages.map(message => {
        let type = 'text'
        let payloadBasic={};
        
        //is stickert
        if (message?.message?.stickerMessage) {
            type = 'sticker'
            payloadBasic = {
                url: message?.message?.stickerMessage.url,
                contentType: message?.message?.stickerMessage.mimetype
            }
        }

        //is message text OUT
        if (message?.message?.extendedTextMessage) {
            type = 'text'
            payloadBasic = {
                text: message?.message?.extendedTextMessage.text,
            }
        }

        //is message conversation IN
        if (message?.message?.conversation) {
            type = 'text'
            payloadBasic = {
                text: message?.message?.conversation,
            }
        }

        const payload: PayloadIN = {
            id: message.key.id,
            source: undefined,
            type,
            payload: Object.assign(payloadBasic, message.message)

        }
        const sender: Sender = {
            phone: message.key.remoteJid?.split('@')[0],
            name: message.pushName
        }
        const body: MessageIN = {
            type: 'message',
            company: whatsapp?.company?.name,
            app: whatsapp.name,
            timestamp: Number(message.messageTimestamp),
            date: new Date,
            version: 1,
            payload,
            sender
        }
        resultBody.push(body)
    })
    return resultBody;
}

export default messagesUpsert;