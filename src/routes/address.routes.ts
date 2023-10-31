import { CreateAddressController } from "@modules/address/useCases/createAddress/createAddressController";
import { UpdateAddressController } from "@modules/address/useCases/updateAddress/updateAddressController";
import { Router } from "express";

const addressRoutes = Router();

addressRoutes.post("/", new CreateAddressController().handle);
addressRoutes.put("/:id", new UpdateAddressController().handle);

export { addressRoutes };
