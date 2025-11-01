function errorHandler (err, req, res, next) {
  console.error(err);
  res.status(500).json({ message: 'Server error', details: err.message });
}
module.exports = { errorHandler };
