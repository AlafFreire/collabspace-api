import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetViacepUseCase } from "./getViacepUseCase";

class GetViacepController {
  async handle(request: Request, response: Response) {
    const { cep } = request.params as { cep: string };

    const getViaceUseCase = container.resolve(GetViacepUseCase);

    const result = await getViaceUseCase.execute({
      cep,
    });

    return response.status(result.statusCode).json(result);
  }
}

export { GetViacepController };
