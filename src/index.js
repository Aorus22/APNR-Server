const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
const PORT = 9000;

const serviceAccount = require("../credentials.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(cors({ origin: "http://localhost:3001", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.post("/auth/google", async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    res.cookie("token", idToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({ message: "Login successful", user: decodedToken });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Invalid ID token" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  return res.status(200).json({ message: "Logout successful" });
});

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

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
