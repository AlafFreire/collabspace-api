import { AppResponse } from "@helpers/responseParser";
import { IRequestCreateAddress } from "@modules/address/dtos/address";
import { IAddressRepositories } from "@modules/address/iRepositories/IAddressRepositories";
import { IUuidProvider } from "@shared/container/providers/uuidProvider/IUuidProvider";
import { inject, injectable } from "tsyringe";

interface IRequest extends IRequestCreateAddress {
  usrId: string;
}

@injectable()
class CreateAddressUseCase {
  constructor(
    @inject("AddressRepository")
    private addressRepository: IAddressRepositories,
    @inject("UuidProvider")
    private uuidProvider: IUuidProvider
  ) {}

  async execute({
    usrId,
    cep,
    country,
    province,
    city,
    street,
  }: IRequest): Promise<AppResponse> {
    const createAddress = await this.addressRepository.create({
      id: this.uuidProvider.createUUID(),
      usrId,
      cep,
      country,
      province,
      city,
      street,
    });
    return new AppResponse({
      statusCode: 201,
      message: "Endereço adicionado!",

      data: {
        id: createAddress.id,
        cep: createAddress.cep,
        country: createAddress.country,
        province: createAddress.province,
        city: createAddress.city,
        street: createAddress.street,
      },
    });
  }
}

export { CreateAddressUseCase };
