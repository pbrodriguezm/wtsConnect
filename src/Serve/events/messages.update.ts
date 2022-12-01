
import Whatsapp from "../../sqlz/models/Whatsapp"
import { PayloadEvent, MessageEvent } from "../modelEvents/Messages"


// ESTRUCTURA BASICA ENTREGADA DE MESSAGE-EVENT
/*=="payload":{
===="id":"gBEGkYaYVSEEAgnZxQ3JmKK6Wvg" (identificador de mensaje)
===="gsId": "ee4a68a0-1203-4c85-8dc3-49d0b3226a35" (ID de mensaje para Guardar Sesiones)
===="type":"enqueued"|"failed"|"sent"|"delivered"|"read",
===="destination":"519879473456",
===="payload": << Varia según el valor de la propiedad - "type" >>;
==}*/
const messagesEvent = async (update:any, whatsapp:Whatsapp): Promise<MessageEvent> => {
    let resultBody:any = []
    update.map(event => {
        let type = 'failed'
        
        if(event.update.status == 2) type = 'send'
        if(event.update.status == 3) type = 'delivered'
        if(event.update.status == 4) type = 'read'

        const payload: PayloadEvent = {
            id: event.key.id,
            destination: event.key.remoteJid.split('@')[0],
            type ,
            payload: update

        }
        const body: MessageEvent = {
            company: whatsapp?.company?.name,
            app: whatsapp.name,
            timestamp: Number(Date.now()),
            date: new Date,
            version: 1,
            type: 'message-event',
            payload,
        }
        resultBody.push(body)
    })
    return resultBody;
}

export default messagesEvent;