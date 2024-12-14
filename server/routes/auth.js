import { Router } from "express";
import { addUser } from "../data/auth.js";

const router = Router();

router.route("/signup").post(async (req, res) => {
  console.log("Request received at /signup:", req.body);
  const userInfo = req.body;
  const userName = userInfo.name;
  const userEmail = userInfo.email;
  // const userId = userInfo.uid;

  try {
    const addInfo = await addUser(userName, userEmail);
    return res.json(addInfo);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});

export default router;
