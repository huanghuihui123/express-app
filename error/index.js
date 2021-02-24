const createError = require("http-errors");

const status400 = createError(400, "BadRequest");
const status401 = createError(401, "Unauthorized");
const status403 = createError(403, "Forbidden");
const status404 = createError(404, "NotFound");
const status500 = createError(500, "InternalServerError");

module.exports = {
  status400,
  status401,
  status403,
  status404,
  status500,
};
