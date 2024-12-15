import { Router } from "express";
import { addUser, editUser } from "../data/auth.js";

const router = Router();

router.route("/signup").post(async (req, res) => {
  console.log("Request received at /signup:", req.body);
  const userInfo = req.body;
  const userName = userInfo.name;
  const userEmail = userInfo.email;
  const userId = userInfo.fireId;

  try {
    const addInfo = await addUser(userName, userEmail, userId);
    return res.json(addInfo);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});

router.route("/").patch(async (req, res) => {
  console.log("Request received at /", req.body);
  const userInfo = req.body;
  const userName = userInfo.name;
  const fireId = userInfo.fireId;

  try {
    const update = await editUser(userName, fireId);
    return res.json(update);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

export default router;
