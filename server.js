const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const sendEmailRoutes = require("./routes/sendEmailRoutes");
const subscribeEmailRoute = require("./routes/subscribeEmailRoutes");
const blogsRoutes = require("./routes/blogsRoutes");
const bodyParser = require("body-parser");
const httpolyglot = require("httpolyglot");
const authorRoutes = require("./routes/authorRoutes");
const fs = require("fs");
const auth = require("./utils/middleware");
dotenv.config();
const app = express();

//   const privateKey = fs.readFileSync('/home/ec2-user/ssl/private.key', 'utf8');
//   const certificate = fs.readFileSync('/home/ec2-user/ssl/fullchain.pem', 'utf8');
// const certificate = fs.readFileSync('ssl\\fullchain.pem', 'utf8');
// const privateKey = fs.readFileSync('ssl\\private.key', 'utf8');
// const credentials = { key: privateKey, cert: certificate };

//let httpsServer = https.createServer(credentials,app);
// const server = httpolyglot.createServer(credentials, app);

// server.keepAliveTimeout = 20000;    // 65 seconds (default is 5s, which is low for modern apps)
// server.headersTimeout = 20000;      // Should be a bit more than keepAliveTimeout

// server.listen(process.env.PORT, () => {
//   console.log(
//     `HTTP/HTTPS Server running on port ${process.env.PORT}`
//   );
// });

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// MongoDB connection
mongoose.set("strictPopulate", false);
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME })
  .then((connection) => {
    console.log(`Connection Established with ${process.env.DB_NAME} database`);
  })
  .catch((error) => {
    console.log(error);
  });

// Routes
app.use("/api", auth, sendEmailRoutes);
app.use("/api", auth, subscribeEmailRoute);
app.use("/api", auth, blogsRoutes);
app.use("/api", auth, authorRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
