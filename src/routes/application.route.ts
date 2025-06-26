import { Router } from "express";
import { getApplicationsForJob, getMyApplications } from "../controllers/application.controller";
import {  authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { upload } from "../config/upload";
import asyncHandler from "express-async-handler";
import Application from "../models/application.model";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { Types } from "mongoose";

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}

const router = Router();

// Controller for applying to a job
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

// GET applications for a job (employer only)
router.get("/jobs/:jobId/applications", authenticate, authorizeRoles("employer"), getApplicationsForJob);

// GET my applications (applicant only)
router.get("/my-applications", authenticate, authorizeRoles("applicant"), getMyApplications);

// POST apply to a job (applicant only)
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
