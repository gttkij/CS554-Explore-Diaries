//import routes

import authRoutes from "./auth.js";

const constructorMethod = (app) => {
  // app.use('/api/blogs', blogRoutes); One or more routes if needed
  app.use("/api/auth", authRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
  });
};

export default constructorMethod;
