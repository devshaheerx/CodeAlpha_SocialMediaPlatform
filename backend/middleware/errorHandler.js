import multer from "multer";

export const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || "Server error";

  if (err instanceof multer.MulterError) {
    status = 400;
    message = err.code === "LIMIT_FILE_SIZE" ? "Image must be smaller than 2 MB" : err.message;
  } else if (err.message?.startsWith("Only JPG")) {
    status = 400;
  } else if (err.name === "CastError") {
    status = 404;
    message = "Resource not found";
  } else if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors)[0].message;
  } else if (err.code === 11000) {
    status = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `That ${field} is already taken`;
  }

  if (status === 500) console.error(err);
  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === "development" && status === 500 && { stack: err.stack }),
  });
};
