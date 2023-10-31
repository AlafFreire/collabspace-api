import { IRequestUpdateAddress } from "@modules/address/dtos/address";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateAddressUseCase } from "./updateAddressUseCase";

class UpdateAddressController {
  async handle(request: Request, response: Response) {
    const { usrId } = request;
    const { id } = request.params as { id: string };
    const { cep, country, province, city, street } =
      request.body as IRequestUpdateAddress;

    const updateAddressUseCase = container.resolve(UpdateAddressUseCase);

    const result = await updateAddressUseCase.execute({
      usrId,
      id,
      cep,
      country,
      province,
      city,
      street,
    });

    return response.status(result.statusCode).json(result);
  }
}

export { UpdateAddressController };
