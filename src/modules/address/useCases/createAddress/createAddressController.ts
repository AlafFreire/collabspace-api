import { IRequestCreateAddress } from "@modules/address/dtos/address";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateAddressUseCase } from "./createAddressUseCase";

class CreateAddressController {
  async handle(request: Request, response: Response) {
    const { usrId } = request;
    const { cep, country, province, city, street } =
      request.body as IRequestCreateAddress;

    const createAddressUseCase = container.resolve(CreateAddressUseCase);

    const result = await createAddressUseCase.execute({
      usrId,
      cep,
      country,
      province,
      city,
      street,
    });
    return response.status(result.statusCode).json(result);
  }
}

export { CreateAddressController };
