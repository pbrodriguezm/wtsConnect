import { Sequelize, Op } from "sequelize";
import { Company } from "../../models/Company";
// import Queue from "../../models/Queue";
// import User from "../../models/User";
import Whatsapp from "../../models/Whatsapp";

interface Request {
  searchParam?: string;
  pageNumber?: string | number;
  companyId?: string | number;
}

interface Response {
  users: any[];
  count: number;
  hasMore: boolean;
}
