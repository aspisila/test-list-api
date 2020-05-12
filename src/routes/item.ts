import { Router } from "express";
import ItemController from "../controllers/ItemController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

router.get("/", [checkJwt, checkRole(["ADMIN"])], ItemController.listAll);
router.get(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN"])],
    ItemController.getOneById
);
router.post("/", [checkJwt, checkRole(["ADMIN"])], ItemController.newItem);
router.patch(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN"])],
    ItemController.editItem
);
router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN"])],
    ItemController.deleteItem
);
router.delete(
    "/deleteAll",
    [checkJwt, checkRole(["ADMIN"])],
    ItemController.deleteAll
);

export default router;