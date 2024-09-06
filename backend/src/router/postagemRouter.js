import { Router } from "express";
import { getAll, create, getPostagem } from "../controllers/postagemController.js";

const router = Router()

router.get("/", getAll)
router.post("/", create)
router.get("/:id", getPostagem)

export default router