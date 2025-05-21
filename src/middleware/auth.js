import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res.status(401).json({ message: req.__("auth.unauthorized") });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error in auth middleware:", err);
    return res.status(401).json("Invalid token");
  }
};
