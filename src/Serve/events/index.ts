import { AnyMessageContent, delay, DisconnectReason } from "@adiwajshing/baileys"
import { Boom } from "@hapi/boom"
import sequelize from "../../sqlz/database"
import { QRGenerate , Payload } from "../modelEvents/ConnectionQR"
import { MessageIN, Payload as PayloadIN, Sender } from "../modelEvents/Messages"
import { startSock } from "../wts"
import messagesEvent from "./messages.update"
import messagesUpsert from "./messages.upsert"
import * as WhatsAppController from '../../sqlz/controllers/WhatsAppController'

import WebHooks from "node-webhooks"

// start a connection
const webHooks = new WebHooks({
	db: { "addPost": [""] },
})

export const sendWebHook = async (body: any, id: any) => {
	const whatsAppController = WhatsAppController
	sequelize.authenticate();
	
		const wtspp = await whatsAppController.getWhatsapp(id)
		if (wtspp.webhook) {
			webHooks.add('connectwts', wtspp.webhook)
				.then(function () {
					webHooks.trigger('connectwts', body, { header: 'header' })
				}).catch(function (err) {
					console.log('[webhook Error]', err)
				})
		}
}

export const events = async (sock, whatsapp) => {

		const sendMessageWTyping = async (msg: AnyMessageContent, jid: string) => {
			await sock.presenceSubscribe(jid)
			await delay(500)

			await sock.sendPresenceUpdate('composing', jid)
			await delay(2000)

			await sock.sendPresenceUpdate('paused', jid)

			await sock.sendMessage(jid, msg)
		}
        
    sock.ev.process(
        async (events) => {
            if (events['connection.update']) {
                const update = events['connection.update']
                const { connection, lastDisconnect } = update
                if (connection === 'close') {
                    if ((lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
                        startSock()
                    } else {
                        console.log('Connection closed. You are logged out.')
                    }
                }
                if (update.qr) {
                    const payload: Payload = { qr: update.qr, type: 'OPEN' }
                    const body: QRGenerate = {
                        type: 'qr-event',
                        company: whatsapp?.company?.name,
                        app: whatsapp.name,
                        timestamp: Date.now(),
                        date: new Date,
                        version: 1,
                        payload
                    }
                    sendWebHook(body, whatsapp.id)
                }
            }

            // // credentials updated -- save them
            // if (events['creds.update']) {
            //     await saveCreds()
                
            // }

            if (events.call) {
                // console.log('\n ***> recv call event', events.call)
            }

            // history received
            if (events['messaging-history.set']) {
                const { chats, contacts, messages, isLatest } = events['messaging-history.set']
                // console.log(`===> recv ${chats.length} chats, ${contacts.length} contacts, ${messages.length} msgs (is latest: ${isLatest})`)
            }

            // received a new message
            if (events['messages.upsert']) {
                const upsert = events['messages.upsert']
                //Construir mensajes In Out
                const body: MessageIN = await messagesUpsert(upsert, whatsapp);
                //enviar webhook si tuviera
                sendWebHook(body, whatsapp.id)

                //test Buttons

                //test Buttons
                upsert.messages.map(async message => {
                    if (message?.message?.conversation) {
                        if (message?.message?.conversation === 'hola') {
                            // send a buttons message!
                            const buttons = [
                                { buttonId: 'id0', buttonText: { displayText: 'Nuestra carta' }, type: 1 },
                                { buttonId: 'id1', buttonText: { displayText: 'Realizar pedido' }, type: 1 },
                                { buttonId: 'id2', buttonText: { displayText: 'Estado de pedido' }, type: 3 },
                                { buttonId: 'id3', buttonText: { displayText: 'Conversar con asesor' }, type: 2 }
                            ]

                            const buttonMessage = {
                                image: { url: 'https://media-exp1.licdn.com/dms/image/C4E16AQHW5b8J5UzPiQ/profile-displaybackgroundimage-shrink_200_800/0/1630508263077?e=2147483647&v=beta&t=8YMo9ZVYFF2Y_ipl-gl_lQLjYo71yBLF2wWTlNin32M' },
                                caption: "🚀Bienvenido a PRESTO ITALO PERUANA 🍝",
                                footer: 'Tenemos una atención perdonalizada, seleccione una opción.',
                                buttons: buttons,
                                headerType: 4
                            }
                            await sendMessageWTyping(buttonMessage, message.key.remoteJid!)
                        }
                    }
                    if (message?.message?.buttonsResponseMessage?.selectedButtonId === 'id0') {
                        await sendMessageWTyping({ text: 'Nuestra carta completa en PDF... https://t.ly/3iLr' }, message.key.remoteJid!)
                    }

                    if (message?.message?.buttonsResponseMessage?.selectedButtonId === 'id1') {
                        await sendMessageWTyping({ text: 'Seleccione los productos que desea aqui https://wa.me/c/16125403640' }, message.key.remoteJid!)
                    }

                    if (message?.message?.buttonsResponseMessage?.selectedButtonId === 'id3') {

                        const templateButtons = [
                            { index: 1, urlButton: { displayText: '⭐ Star Baileys on GitHub!', url: 'https://github.com/adiwajshing/Baileys' } },
                            { index: 2, callButton: { displayText: 'Call me!', phoneNumber: '+1 (234) 5678-901' } },
                            { index: 3, quickReplyButton: { displayText: 'This is a reply, just like normal buttons!', id: 'id-like-buttons-message' } },
                        ]
                        await sendMessageWTyping({ text: 'Lo estamos conectando con un asesor...' }, message.key.remoteJid!)
                    }

                    if (message?.message?.orderMessage) {
                        const buttons = [
                            { buttonId: 'p00', buttonText: { displayText: 'Efectivo' }, type: 1 },
                            { buttonId: 'p01', buttonText: { displayText: 'Tarjeta POS' }, type: 1 },
                            { buttonId: 'p02', buttonText: { displayText: 'Pago Link' }, type: 1 },
                            { buttonId: 'p03', buttonText: { displayText: 'Yape / Plin' }, type: 1 }
                        ]

                        const buttonMessage = {
                            text: "⭐ Hemos recibido su pedido! \n Se enviará " + message?.message?.orderMessage?.itemCount + " producto(s). \n Total de: S/ " + Number(message?.message?.orderMessage?.totalAmount1000) / 1000,
                            footer: '¿Como desea realizar su pago?',
                            buttons: buttons,
                            headerType: 4
                        }
                        await sendMessageWTyping(buttonMessage, message.key.remoteJid!)
                    }


                    if (message?.message?.buttonsResponseMessage?.selectedButtonId === 'p00' || message?.message?.buttonsResponseMessage?.selectedButtonId === 'p01' || message?.message?.buttonsResponseMessage?.selectedButtonId === 'p02' || message?.message?.buttonsResponseMessage?.selectedButtonId === 'p03') {
                        await sendMessageWTyping({ text: 'Ya casi esta listo... Finalmente indiquenos su durección y comparta su ubicación actual.' }, message.key.remoteJid!)
                    }
                    if (message?.message?.locationMessage) {
                        fetch('http://api.positionstack.com/v1/reverse?access_key=2d240dfd077fa8566e278eaf81d1fc3e&query=' + message?.message?.locationMessage.degreesLatitude + ',' + message?.message?.locationMessage.degreesLongitude)
                            .then((response) => response.json())
                            .then(async (data) => {
                                let finish = false
                                const value = data.data[0];
                                await sendMessageWTyping({ text: '🚀Pedido Registrado🚀\n👉🏻El costo por delivery será S/ 5.00  \n👉🏻Se enviara a la ubicación enviada cerca a _' + value.street + '_ referencia ' + value.label }, message.key.remoteJid!)
                                finish = true
                                // Encuesta
                                const sections = [
                                    {
                                        title: "Atención al cliente",
                                        rows: [
                                            { title: "⭐", rowId: "option3", description: "Mala Atención" },
                                            { title: "⭐⭐", rowId: "option4", description: "Regular Atención" },
                                            { title: "⭐⭐⭐", rowId: "option4", description: "Buena Atención" },
                                            { title: "⭐⭐⭐⭐", rowId: "option4", description: "Excelente atención" }
                                        ]
                                    },
                                ]

                                const listMessage = {
                                    text: "Encuesta de atención al cliente",
                                    footer: "Puede ingresar a, link: https://presto.com.pe",
                                    title: "Tu opinion es importante",
                                    buttonText: "RESPONDER ENCUESTA",
                                    sections
                                }
                                await sendMessageWTyping(listMessage, message.key.remoteJid!)


                            });
                    }
                })

            }


            // messages updated like status delivered, message deleted etc.
            if (events['messages.update']) {
                //Events messages "enqueued"|"failed"|"sent"|"delivered"|"read",
                const update = events['messages.update']
                const body = await messagesEvent(update, whatsapp);
                sendWebHook(body, whatsapp.id)
            }

            if (events['message-receipt.update']) {
                // console.log('==[message-receipt.update]==')//,events['message-receipt.update'])
            }

            if (events['messages.reaction']) {
                // console.log('==[messages.reaction]==')//,events['messages.reaction'])
            }

            if (events['presence.update']) {
                // console.log('==[presence.update]==')//,events['presence.update'])
            }

            if (events['chats.update']) {
                // console.log('==[chats.update]==',events['chats.update'],'<=====')
            }

            if (events['contacts.update']) {
                for (const contact of events['contacts.update']) {
                    if (typeof contact.imgUrl !== 'undefined') {
                        const newUrl = contact.imgUrl === null ? null : await sock!.profilePictureUrl(contact.id!)
                        // console.log(
                        //     `contact ${contact.id} has a new profile pic: ${newUrl}`,
                        // )
                    }
                }
            }

            if (events['chats.delete']) {
                // console.log('chats deleted ', events['chats.delete'])
            }
        }
    )
}