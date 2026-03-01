import jwt from "jsonwebtoken";

/*
  This function verifies JWT token
  and returns decoded user data
*/

export const verifyToken = (req) => {
  try {
    // Authorization header format:
    // "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return null; // no token
    }

    const token = authHeader.split(" ")[1]; //header formate means we will split the string b space and take the second part which is the token here [1] index real token

    if (!token) {
      return null;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // here the token is checked using the scerete key

    return decoded; // { id, role }
  } catch (error) {
    return null; // invalid token
  }
};
