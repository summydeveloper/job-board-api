import { Request, Response } from "express";
import Application from "../models/application.model";
import Job, { IJob } from "../models/job.model";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role?: string;
  };
}
export const getApplicationsForJob = async (req: Request, res: Response) => {
  try {
    const typedReq = req as AuthenticatedRequest;
    const { jobId } = req.params;
    const employerId = typedReq.user.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      res.status(400).json({ error: "Invalid Job ID" });
      return;
    }

    const job = await Job.findById(jobId) as IJob | null;

    if (!job || job.createdBy.toString() !== employerId) {
      res.status(403).json({ error: "You do not have access to this job's applications." });
      console.log("Employer ID from token:", employerId);
console.log("Job createdBy:", job?.createdBy?.toString());

      return;
    }

    const applications = await Application.find({ jobId })
      .populate("applicantId", "name email")
      .lean()
      .exec();

    res.status(200).json({
      total: applications.length,
      data: applications,
    });
  } catch (error: any) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};

export const getMyApplications = async (req: Request, res: Response) => {
  try {
    const typedReq = req as AuthenticatedRequest;
    const applicantId = typedReq.user.id;

    const myApplications = await Application.find({ applicantId })
      .populate("jobId", "title company location salary")
      .lean()
      .exec();

    res.status(200).json({
      total: myApplications.length,
      data: myApplications,
    });
  } catch (error: any) {
    console.error("Error fetching my applications:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};
