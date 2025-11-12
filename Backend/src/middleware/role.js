// middleware/roles.js
const isAgent = (req, res, next) => {
  if (req.user.role !== "agent") return res.status(403).json({ message: "Access denied" });
  next();
};

const isCommittee = (req, res, next) => {
  if (req.user.role !== "committee") return res.status(403).json({ message: "Access denied" });
  next();
};

module.exports = { isAgent, isCommittee };
