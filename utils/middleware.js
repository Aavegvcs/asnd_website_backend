const basicAuth = require("basic-auth");

// Username & Password from .env file (safer than hardcoding)
const USER = process.env.API_USER || "jagdish";
const PASS = process.env.API_PASS || "123";

function auth(req, res, next) {
  const user = basicAuth(req);

  if (!user || user.name !== USER || user.pass !== PASS) {
    res.set("WWW-Authenticate", 'Basic realm="Secure Area"');
    return res.status(401).json({ message: "Unauthorized: Invalid credentials" });
  }

  next();
}

module.exports = auth;
