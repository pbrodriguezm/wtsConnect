import { Router } from "express";
import * as CompanyController from "../controllers/CompanyController";
import isAuth from "../middleware/isAuth";

const companyRoutes = Router();

companyRoutes.get("/company", CompanyController.index);

companyRoutes.get("/company/:companyId", isAuth, CompanyController.show);


export default companyRoutes;
