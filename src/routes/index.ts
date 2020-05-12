import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./user";
import item from "./item";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/item", item);

export default routes;