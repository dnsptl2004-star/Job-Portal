import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies?.token;

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
        success: false,
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Attach user ID (or any user info) to the request object
    req.id = decoded.userId;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({
      message: "Authentication failed",
      success: false,
    });
  }
};

export default isAuthenticated;
