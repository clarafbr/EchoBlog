import { Router } from "express";
import { getAll, create, getPostagem, updatePostagem, deletePostagem} from "../controllers/postagemController.js";

const router = Router()

router.get("/", getAll)
router.post("/", create)
router.get("/:id", getPostagem)
router.put("/:id", updatePostagem)
router.delete("/:id", deletePostagem)

export default router