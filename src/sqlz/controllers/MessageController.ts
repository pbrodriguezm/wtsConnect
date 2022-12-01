import makeWASocket, { AnyMessageContent, delay, fetchLatestBaileysVersion, MessageRetryMap, useMultiFileAuthState } from "@adiwajshing/baileys";
import { Request, Response } from "express";
import { startSockOne, sendWebHook } from "../../Serve/wts";
import { makeCacheableSignalKeyStore } from "../../Utils";
import MAIN_LOGGER from '../../Utils/logger'

// import ListMessagesService from "../services/MessageServices/ListMessagesService";
// import ShowTicketService from "../services/TicketServices/ShowTicketService";
// import DeleteWhatsAppMessage from "../services/WbotServices/DeleteWhatsAppMessage";
// import SendWhatsAppMedia from "../services/WbotServices/SendWhatsAppMedia";
// import SendWhatsAppMessage from "../services/WbotServices/SendWhatsAppMessage";

type IndexQuery = {
  pageNumber: string;
};

type MessageData = {
  body: string;
  fromMe: boolean;
  read: boolean;
  quotedMsg?: any;
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { pageNumber } = req.query as IndexQuery;

  return res.json();
};

export const send = async (req: Request, res: Response): Promise<Response> => {
  
  const {source, destination, message} = req.body;
  const sock = await startSockOne(source)
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'open') {
      sock.onWhatsApp(destination) //Lagea mucho validacion de numero
        .then(validate => {
          if (validate[0].exists) {
            sock.sendMessage(destination + '@s.whatsapp.net', { text: message.text })
              .then(result => {
                const structResult = { "status": "submitted", "messageId": result?.key.id }
                return res.status(200).send(structResult);
              })
              .catch(error => {
                return res.status(500).send({ "status": "error", "detail": "server send message"});
              })
          }else {
               return res.status(400).send({ "status": "failed", "detail": "Number not exists"});
          }
        })
        .catch(error => {
          return res.status(500).send({ "status": "error", "detail": "server validate number"});
        })
    }
  })
};



export const store = async (req: Request, res: Response): Promise<Response> => {
  return res.send();
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {

  return res.send();
};
