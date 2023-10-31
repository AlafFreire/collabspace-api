import { GetViacepController } from "@modules/viacep/useCases/getViacep/getViacepController";
import { Router } from "express";

const viacepRoutes = Router();

viacepRoutes.get("/:cep", new GetViacepController().handle);

export { viacepRoutes };
