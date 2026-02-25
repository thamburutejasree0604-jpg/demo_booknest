import admin from "./firebase-admin.js";

const checkAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  console.log("Authorization Header:", req.headers.authorization); 
  console.log("Token:", token);

  if (!token) {
    return res
      .status(401)
      .json({ message: "No authentication token found." });
  }

  try {
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userEmail = decodedToken.email;
    console.log('User email from token:', userEmail);

    // Check if the user is an admin
    if (userEmail && userEmail.endsWith("@booknest.com")) {
      req.user = decodedToken; // Attach the user information to the request
      next();
    } else {
      res.status(403).json({ message: "Forbidden. Admin access only." });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default checkAdmin;
