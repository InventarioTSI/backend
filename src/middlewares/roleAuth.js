export const roleRequired = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).send({
        status: "FAILED",
        data: "Access denied",
      });
    }
    next();
  };
};
