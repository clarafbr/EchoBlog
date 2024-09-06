import { Router } from "express";
import { getAll } from "../controllers/postagemController.js";

const router = Router()

router.get("/", getAll)

export default router