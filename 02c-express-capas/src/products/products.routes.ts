// Rutas: qué función del controlador atiende cada método y URL.

import { Router } from "express";
import * as productsController from "./products.controller";

const router = Router();

router.get("/", productsController.list);
router.get("/:id", productsController.getOne);
router.post("/", productsController.create);
router.patch("/:id", productsController.update);
router.delete("/:id", productsController.remove);

export default router;
