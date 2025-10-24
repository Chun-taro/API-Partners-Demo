module.exports = function (req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (token === process.env.PARTNER_API_TOKEN) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};