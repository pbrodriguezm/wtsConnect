import { Company } from "../models/Company";
import User from "../models/User";
import Whatsapp from "../models/Whatsapp";

interface SerializedUser {
  id: number;
  name: string;
  email: string;
  profile: string;
  whatsapp: Whatsapp;
  companyId: number;
  company: Company
}


export const SerializeUser = (user: User): SerializedUser => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profile: user.profile,
    whatsapp: user.whatsapp,
    companyId: user.companyId,
    company: user.company 
  };
};
