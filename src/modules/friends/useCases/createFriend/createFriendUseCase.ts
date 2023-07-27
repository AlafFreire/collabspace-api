import { inject, injectable } from "tsyringe";
import { IFriendsRepositories } from "@modules/friends/iRepositories/IFriendsRepositories";
import { IUuidProvider } from "@shared/container/providers/uuidProvider/IUuidProvider";
import { AppResponse } from "@helpers/responseParser";
import { IUsersRepositories } from "@modules/users/iRepositories/IUsersRepositories";
import { AppError } from "@helpers/errorsHandler";
import { EnumFriendActions } from "src/enums/friendActions";

interface IRequest {
  usrId: string;
  targetId: string;
}

@injectable()
class CreateFriendUseCase {
  constructor(
    @inject("FriendRepository")
    private friendRepository: IFriendsRepositories,
    @inject("UserRepository")
    private userRepository: IUsersRepositories,
    @inject("UuidProvider")
    private uuidProvider: IUuidProvider
  ) {}

  async execute({ usrId, targetId }: IRequest): Promise<AppResponse> {
    if (!this.uuidProvider.validateUUID(targetId)) {
      throw new AppError({
        message: "ID inválido!",
      });
    }

    if (usrId === targetId) {
      throw new AppError({
        message:
          "Não é possível enviar uma solicitação a você mesmo. Procure um psicólogo!",
      });
    }

    const listUserById = await this.userRepository.listById(targetId);

    if (!listUserById) {
      throw new AppError({
        message: "Usuário alvo não encontrado!",
      });
    }

    const listFrienshipAlreadyExists =
      await this.friendRepository.listAlreadyExists(usrId, targetId);

    if (listFrienshipAlreadyExists) {
      if (
        listFrienshipAlreadyExists.action_id_1 ===
          EnumFriendActions.requested &&
        !listFrienshipAlreadyExists.action_id_2
      ) {
        throw new AppError({
          message: "Solicitação já enviada!",
        });
      }

      if (
        listFrienshipAlreadyExists.action_id_1 === EnumFriendActions.canceled ||
        listFrienshipAlreadyExists.action_id_2 === EnumFriendActions.refused
      ) {
        await this.friendRepository.updateActionStatus({
          id: listFrienshipAlreadyExists.id,
          actionId1: EnumFriendActions.requested,
          actionId2: null,
        });
        return new AppResponse({
          message: "Solicitação enviada",
        });
      }

      if (
        listFrienshipAlreadyExists.action_id_2 === EnumFriendActions.accepted
      ) {
        throw new AppError({
          message: "Solicitação já aceita!",
        });
      }
    }

    const createFriend = await this.friendRepository.create({
      id: this.uuidProvider.createUUID(),
      userId1: usrId,
      userId2: targetId,
    });
    return new AppResponse({
      statusCode: 201,
      message: "Solicitação enviada!",
      data: {
        id: createFriend.id,
        userId1: createFriend.user_id_1,
        usrId2: createFriend.user_id_2,
        actionId1: createFriend.action_id_1,
        actionId2: createFriend.action_id_2,
        createdAt: createFriend.created_at,
      },
    });
  }
}

export { CreateFriendUseCase };
