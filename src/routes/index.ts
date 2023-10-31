import { Router } from "express";

import { addressRoutes } from "./address.routes";
import { commentRoutes } from "./comment.routes";
import { friendRoutes } from "./friend.routes";
import { postRoutes } from "./post.routes";
import { reactionRoutes } from "./reaction.routes";
import { sessionRoutes } from "./session.routes";
import { userRoutes } from "./user.routes";
import { viacepRoutes } from "./viacep.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/sessions", sessionRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);
router.use("/reactions", reactionRoutes);
router.use("/friends", friendRoutes);
router.use("/address", addressRoutes);
router.use("/viacep", viacepRoutes);

export { router };
