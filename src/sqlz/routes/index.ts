import { Router } from "express";

import whatsappRoutes from "./whatsappRoutes";
import messageRoutes from "./messageRoutes";
// import authRoutes from "./authRoutes";

const routes = Router();



// routes.use("/auth", authRoutes);
routes.use(whatsappRoutes);
routes.use(messageRoutes);
// routes.use("/api/messages", apiRoutes);

export default routes;
