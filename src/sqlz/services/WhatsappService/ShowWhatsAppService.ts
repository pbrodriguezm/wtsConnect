import Whatsapp from "../../models/Whatsapp";
import AppError from "../../errors/AppError";


export const ShowWhatsAppService = async (id: string | number): Promise<Whatsapp> => {
  const whatsapp = await Whatsapp.findByPk(id, {
    attributes: ["id", "name", "number", "webhook"],
  });

  if (!whatsapp) {
    throw new AppError("ERR_NO_WAPP_FOUND", 404);
  }

  return whatsapp;
};

export const ShowWhatsAppServiceNumber = async (number: string | number): Promise<Whatsapp> => {
  const whatsapp = await Whatsapp.findOne({
    where: { number, serverConnect: 'v2' },
    attributes: ["id", "name", "number", "webhook"],
  }
  );

  if (!whatsapp) {
    throw new AppError("ERR_NO_WAPP_FOUND", 404);
  }

  return whatsapp;
};
