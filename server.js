const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");

// security packages
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

const dbContext = require("./src/config/database");
const appError = require("./src/utils/appError");

// Routes
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const teamRoutes = require("./src/routes/teamRoutes");
const bugRoutes = require("./src/routes/bugRoutes");
const rolesRoutes = require("./src/routes/rolesRoutes");

dotenv.config({ path: "./src/config/config.env" });
dbContext();

// Sanitize data
app.use(mongoSanitize());

// Set security haeders
app.use(helmet());

// Prevent xss attacks
app.use(xss());

// Rate liimit
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 minutes
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable cors
app.use(cors());

// serving static files
app.use(express.static(path.join(__dirname, "src/public")));

app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/teams", teamRoutes);
app.use("/api/v1/bugs", bugRoutes);
app.use("/api/v1/roles", rolesRoutes);

app.all("*", (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res
    .status(err.statusCode)
    .json(
      { status: err.status, message: err.message } || "Unknown error occured"
    );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
