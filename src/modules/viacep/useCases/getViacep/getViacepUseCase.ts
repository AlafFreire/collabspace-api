import { AppResponse } from "@helpers/responseParser";
import axios from "axios";
import { injectable } from "tsyringe";

interface IRequest {
  cep: string;
}

@injectable()
class GetViacepUseCase {
  constructor() {}

  async execute({ cep }: IRequest): Promise<AppResponse> {
    const url = "https://viacep.com.br/ws/{cep}/json/";

    const response = await axios.get(url.replace("{cep}", cep));

    return new AppResponse({
      data: {
        address: response.data,
      },
    });
  }
}

export { GetViacepUseCase };
