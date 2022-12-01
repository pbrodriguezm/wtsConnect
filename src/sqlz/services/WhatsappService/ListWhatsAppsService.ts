import { Company } from "../../models/Company";
import Whatsapp from "../../models/Whatsapp";

const ListWhatsAppsService = async (): Promise<Whatsapp[]> => {

    const whatsapps = await Whatsapp.findAll({
      where: {
        serverConnect: 'v2'
      },
      include: [
        {
          model: Company,
          as: "company",
          // attributes: ["id", "name", "color", "greetingMessage", "companyId"]
        }
      ]
    });
    return whatsapps;
  }


export default ListWhatsAppsService;
