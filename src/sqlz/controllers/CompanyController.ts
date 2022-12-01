import { Request, Response } from "express";
import AppError from "../errors/AppError";

import { Company } from "../models/Company";
import sequelize from "../database/index";

type IndexQuery = {
  searchParam: string;
  pageNumber: string;
};

export const all = async () => {
  let db = {};

  sequelize.authenticate().then(() => {
    // console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });
  
  const a = await Company.findAll()
  return a;
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const a = await Company.findAndCountAll()
  return res.status(200).json(a);
};


export const show = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.params;
  const company = await Company.findByPk(companyId);
  if (!company) {
    throw new AppError("ERR_NO_COMPANY_FOUND", 404);
  }

  return res.status(200).json(company);
};
