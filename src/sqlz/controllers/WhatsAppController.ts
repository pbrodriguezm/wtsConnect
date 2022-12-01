import { Request, Response } from "express";
import CreateWhatsAppService from "../services/WhatsappService/CreateWhatsAppService";
import DeleteWhatsAppService from "../services/WhatsappService/DeleteWhatsAppService";
import ListWhatsAppsService from "../services/WhatsappService/ListWhatsAppsService";
import {ShowWhatsAppService, ShowWhatsAppServiceNumber} from "../services/WhatsappService/ShowWhatsAppService";
import UpdateWhatsAppService from "../services/WhatsappService/UpdateWhatsAppService";
import sequelize from "../database/index";

interface WhatsappData {
  name: string;
  greetingMessage?: string;
  farewellMessage?: string;
  status?: string;
  isDefault?: boolean;
  companyId: string; 
  serverConnect: string;
  number?: string;
}

export const getAllV2 = async (): Promise<Response> => {
  const whatsapps = await ListWhatsAppsService();
  return whatsapps;
};

export const getWhatsapp = async (id: string | number): Promise<Response> => {
  const whatsapps = await ShowWhatsAppService(id);
  return whatsapps;
};


export const getWhatsappNumber = async (number: string | number): Promise<Response> => {
  const whatsapps = await ShowWhatsAppServiceNumber(number);
  return whatsapps;
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.query;
  const whatsapps = await ListWhatsAppsService();

  return res.status(200).json(whatsapps);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const {
    name,
    status,
    serverConnect,
    isDefault,
    greetingMessage,
    farewellMessage,
    companyId,
    number
  }: WhatsappData = req.body;

  const { whatsapp, oldDefaultWhatsapp } = await CreateWhatsAppService({
    name,
    status,
    isDefault,
    greetingMessage,
    farewellMessage,
    companyId,
    serverConnect,
    number
  });


  // const io = getIO();
  // io.emit("whatsapp", {
  //   action: "update",
  //   whatsapp
  // });

  // if (oldDefaultWhatsapp) {
  //   io.emit("whatsapp", {
  //     action: "update",
  //     whatsapp: oldDefaultWhatsapp
  //   });
  // }

  return res.status(200).json(whatsapp);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { whatsappId } = req.params;

  const whatsapp = await ShowWhatsAppService(whatsappId);

  return res.status(200).json(whatsapp);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { whatsappId } = req.params;
  const whatsappData = req.body;
  const { whatsapp, oldDefaultWhatsapp } = await UpdateWhatsAppService({
    whatsappData,
    whatsappId
  });

  // const io = getIO();
  // io.emit("whatsapp", {
  //   action: "update",
  //   whatsapp
  // });

  // if (oldDefaultWhatsapp) {
  //   io.emit("whatsapp", {
  //     action: "update",
  //     whatsapp: oldDefaultWhatsapp
  //   });
  // }

  return res.status(200).json(whatsapp);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { whatsappId } = req.params;

  // await DeleteWhatsAppService(whatsappId);
  // removeWbot(+whatsappId);

  // const io = getIO();
  // io.emit("whatsapp", {
  //   action: "delete",
  //   whatsappId: +whatsappId
  // });

  return res.status(200).json({ message: "Whatsapp deleted." });
};
