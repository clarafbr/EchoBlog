import {Router} from "express"
import { create, updateUsuario, getUsuarioPorFiltro } from "../controllers/usuarioControllers.js"

const router = Router()

router.post("/registro", create)
router.put("/:id", updateUsuario)
router.get("/:filtro", getUsuarioPorFiltro)

export default router