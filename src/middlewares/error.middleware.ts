import { Request, Response, NextFunction } from 'express';

// 404 Not Found middleware
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404);
  // Passing error to the next middleware (errorHandler)
  next(new Error(`Not Found - ${req.originalUrl}`));
};

// General error handler middleware
export const errorHandler = (
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
