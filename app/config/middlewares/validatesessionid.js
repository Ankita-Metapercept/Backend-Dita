const { sessionIdList } = require("../../services/appauth.js");
exports.validateSessionId = function (req, res, next) {
  if (
    req.headers.sessionid === undefined ||
    req.headers.sessionid === "undefined" ||
    req.headers.sessionid === "null" ||
    req.headers.sessionid === null
  ) {
    return next();
  } else {
    if (sessionIdList[req.headers.userid] === req.headers.sessionid && req.originalUrl!=="/api/generateSessionId") {
      return next();
    }
    throw "Another device has login with your account!";
  }
};
