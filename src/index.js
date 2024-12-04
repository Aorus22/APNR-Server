import express, { json } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer, { memoryStorage } from 'multer';
import { handleLogin, handleLogout, authenticateUser } from "./auth.js";
import { handleDetect, handleGetDetail, handleGetList } from "./handler.js";

const app = express();
const PORT = 9000;
const FRONTEND_URL = "http://localhost:3000"
const upload = multer({ storage: memoryStorage() }); 

app.use(cors({ origin: true, credentials: true }));
app.use(json());
app.use(cookieParser());


app.post("/auth/google", handleLogin);
app.post("/logout", handleLogout);
app.get("/protected", (req, res) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  admin
  .auth()
  .verifyIdToken(token)
  .then((decodedToken) => res.status(200).json({ message: "Access granted", user: decodedToken }))
  .catch(() => res.status(401).json({ message: "Unauthorized" }));
});

app.post("/detect", upload.single("image"), handleDetect);
// app.post('/detect', authenticateUser, upload.single('image'), handleDetect);
app.post("/get-list/", handleGetList);
app.post("/get-vehicle-details/:plateDataId", handleGetDetail);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
