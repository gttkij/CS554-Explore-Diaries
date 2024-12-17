//import routes
import postsRoutes from "./posts.js";
import authRoutes from "./auth.js";

const constructorMethod = (app) => {
  app.use('/api/posts', postsRoutes);
  app.use("/api/auth", authRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
  });
};

export default constructorMethod;
