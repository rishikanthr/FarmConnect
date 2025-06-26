const authenticateConsumer = (req, res, next) => {
  if (req.user?.role !== "consumer") {
    return res.status(403).json({ message: "Access denied: Consumers only" });
  }
  next();
};

export default authenticateConsumer;
