import { inject, injectable } from "tsyringe";
import { ICommentsRepositories } from "@modules/comments/iRepositories/ICommentsRepositories";
import { IPostsRepositories } from "@modules/posts/iRepositories/IPostsRepositories";
import { IReactionsRepositories } from "@modules/reactions/iRepositories/IReactionsRepositories";
import { IUuidProvider } from "@shared/container/providers/uuidProvider/IUuidProvider";
import { IRequestCreateReaction } from "@modules/reactions/dtos/reactions";
import { AppResponse } from "@helpers/responseParser";
import { AppError } from "@helpers/errorsHandler";

interface IRequest extends IRequestCreateReaction {
  usrId: string;
}

@injectable()
class CreateReactionUseCase {
  constructor(
    @inject("ReactionRepository")
    private reactionRepository: IReactionsRepositories,
    @inject("PostRepository")
    private postRepository: IPostsRepositories,
    @inject("CommentRepository")
    private commentRepository: ICommentsRepositories,
    @inject("UuidProvider")
    private uuidProvider: IUuidProvider
  ) {}

  async execute({
    usrId,
    postId,
    commentId,
    entityType,
  }: IRequest): Promise<AppResponse> {
    if (postId && commentId) {
      throw new AppError({
        message: "Você nao pode reagir em duas coisas ao mesmo tempo!",
      });
    }

    if (!postId && !commentId) {
      throw new AppError({
        message: "Você precisa reagir a um post ou um comentário!",
      });
    }

    if (postId) {
      if (!this.uuidProvider.validateUUID(postId)) {
        throw new AppError({
          message: "PostID inválido!",
        });
      }

      const listPostById = await this.postRepository.listById(postId);

      if (!listPostById) {
        throw new AppError({
          message: "Post não encontrado!",
        });
      }
    }

    if (commentId) {
      if (!this.uuidProvider.validateUUID(commentId)) {
        throw new AppError({
          message: "CommentID inválido!",
        });
      }

      const listCommentById = await this.commentRepository.listById(commentId);

      if (!listCommentById) {
        throw new AppError({
          message: "Comentário não encontrado!",
        });
      }
    }

    const countReactionUserPost =
      await this.reactionRepository.countReactionUserPost(usrId, postId);

    const countReactionUserComment =
      await this.reactionRepository.countReactionUserComment(usrId, commentId);

    if (
      (postId && countReactionUserPost) ||
      (commentId && countReactionUserComment)
    ) {
      throw new AppError({
        message: "Você já reagiu a isto!",
      });
    }

    const createReaction = await this.reactionRepository.create({
      id: this.uuidProvider.createUUID(),
      userId: usrId,
      postId,
      commentId,
      entityType,
    });

    return new AppResponse({
      statusCode: 201,
      message: "Reagido com sucesso!",
      data: {
        id: createReaction.id,
        userId: createReaction.user_id,
        postId: createReaction.post_id,
        commentId: createReaction.comment_id,
        entityType: createReaction.entity_type,
        reactedAt: createReaction.reacted_at,
      },
    });
  }
}

export { CreateReactionUseCase };