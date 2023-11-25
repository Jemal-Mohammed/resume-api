import ErrorHandller from "./errorHandller.js";

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errorMessage: err.message,
      stack: err.stack,  // Corrected property name
    });
  }

  if (process.env.NODE_ENV === 'PRODUCTION') {
    let error = { ...err };
    err.message = err.message;

    // Handle specific error types
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid :${err.path}`;
      err = new ErrorHandller(message, 400);
    }

    if (err.code == 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
      err = new ErrorHandller(message, 400);
    }

    if (err.name == "JsonWebTokenError") {
      const message = "Invalid token error";
      err = new ErrorHandller(message, 400);
    }

    if (err.name == "TokenExpiredError") {
      const message = "Token expired error";
      err = new ErrorHandller(message, 400);
    }

    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((value) => value.message);
      err = new ErrorHandller(message, 400);
    }

    res.status(err.statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

export default errorMiddleware;
