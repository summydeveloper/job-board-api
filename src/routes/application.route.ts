import { Router, Request, Response, NextFunction, RequestHandler } from "express";
import { upload } from "../config/upload";
import { Application } from "../models/application.model";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { Types } from "mongoose";
import asyncHandler from "express-async-handler";

 
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}

const router = Router();

const applyToJob: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const typedReq = req as AuthenticatedRequest; 

    const applicantId = typedReq.user.id;
    const jobId = typedReq.params.jobId;

    if (!Types.ObjectId.isValid(jobId)) {
      res.status(400).json({ error: "Invalid job ID" });
      return;
    }

    const files = req.files as {
      resume?: Express.Multer.File[];
      coverLetter?: Express.Multer.File[];
    };

    const resumePath = files.resume?.[0]?.path;
    const coverLetterPath = files.coverLetter?.[0]?.path;

    if (!resumePath) {
      res.status(400).json({ error: "Resume is required" });
      return;
    }

    const existing = await Application.findOne({ applicantId, jobId });
    if (existing) {
      res.status(400).json({ error: "You already applied to this job" });
      return;
    }

    const application = new Application({
      applicantId: new Types.ObjectId(applicantId),
      jobId: new Types.ObjectId(jobId),
      resumePath,
      coverLetterPath,
    });

    await application.save();

    res.status(201).json({ message: "Application submitted successfully!" });
  }
);

router.post(
  "/apply/:jobId",
  authenticate,
  authorizeRoles("applicant"),
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
  ]),
  applyToJob
);

export default router;
