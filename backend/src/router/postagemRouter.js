import { Router } from "express";
import { getAll, create, getPostagem, updatePostagem} from "../controllers/postagemController.js";

const router = Router()

router.get("/", getAll)
router.post("/", create)
router.get("/:id", getPostagem)
router.put("/:id", updatePostagem)

export default router