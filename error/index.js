const createError = require("http-errors");

const status400 = createError(400, "BadRequest");
const status403 = createError(403, "Forbidden");
const status404 = createError(404, "NotFound");
const status500 = createError(500, "InternalServerError");

module.exports = {
  status400,
  status403,
  status404,
  status500,
};
