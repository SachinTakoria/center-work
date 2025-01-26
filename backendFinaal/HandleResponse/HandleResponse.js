const HandleResponse = (res, status, message, data = null, error = null) =>
  res.status(status).json({ message, data, error })

module.exports = HandleResponse;
