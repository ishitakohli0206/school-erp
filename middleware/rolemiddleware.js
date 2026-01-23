// roleCheck(roleName) -> returns middleware that verifies numeric role_id
module.exports = (roleName) => {
  return (req, res, next) => {
    if (!req.user || typeof req.user.role_id === "undefined") {
      return res.status(401).json({ message: "No role information" });
    }

    const roleId = Number(req.user.role_id);
    const requiredId =
      roleName === "admin" ? 1 :
      roleName === "student" ? 2 :
      null;

    if (requiredId === null) {
      return res.status(400).json({ message: "Invalid role check" });
    }

    if (roleId !== requiredId) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};
