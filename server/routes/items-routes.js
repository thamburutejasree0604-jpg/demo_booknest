import express from "express";
import ItemsController from "../controllers/items-controller.js";
import checkAdmin from "../firebase/checkAdmin.js";

const itemsRouter = express.Router();

itemsRouter.get("/:slug", ItemsController.getItemBySlug);
itemsRouter.post("/create", checkAdmin, ItemsController.createItem);
itemsRouter.patch("/:id", checkAdmin, ItemsController.updateItemById);
itemsRouter.delete("/:id", checkAdmin, ItemsController.deleteItemById);
itemsRouter.get("/", ItemsController.getItems);

export default itemsRouter;
