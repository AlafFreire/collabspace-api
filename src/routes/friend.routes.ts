import { AcceptRequestController } from "@modules/friends/useCases/acceptRequest/acceptRequestController";
import { CancelRequestController } from "@modules/friends/useCases/cancelRequest/cancelRequestController";
import { CreateFriendController } from "@modules/friends/useCases/createFriend/createFriendController";
import { DeleteFriendController } from "@modules/friends/useCases/deleteFriend/deleteFriendController";
import { ListAllFriendsByUserController } from "@modules/friends/useCases/listAllFriendsByUser/listAllFriendsByUserController";
import { ListAllRequestByUserController } from "@modules/friends/useCases/listAllRequestsByUser/listAllRequestsByUserController";
import { RecuseRequestController } from "@modules/friends/useCases/recuseRequest/recuseRequestController";
import { Router } from "express";
import { authentication } from "src/middlewares/authentication";

const friendRoutes = Router();

friendRoutes.use(authentication);

friendRoutes.get(
  "/listAllFriends",
  new ListAllFriendsByUserController().handle
);

friendRoutes.get(
  "listAllRequests",
  new ListAllRequestByUserController().handle
);

friendRoutes.post("/:targetId", new CreateFriendController().handle);
friendRoutes.patch("/cancelRequest/:id", new CancelRequestController().handle);
friendRoutes.patch("/acceptRequest/:id", new AcceptRequestController().handle);
friendRoutes.patch("/recuseRequest/:id", new RecuseRequestController().handle);
friendRoutes.delete("/deleteFriend/:id", new DeleteFriendController().handle);

export { friendRoutes };