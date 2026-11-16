import { Router } from "express";
import {
  getCommunityMembers,
  createCommunityMember,
  deleteCommunityMember,
} from "../controllers/communityController.js";

const communityRouter = Router();

communityRouter.get("/", getCommunityMembers);
communityRouter.post("/", createCommunityMember);
communityRouter.delete("/:id", deleteCommunityMember);

export default communityRouter;
