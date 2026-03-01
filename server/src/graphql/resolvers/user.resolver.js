import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import generateToken from "../../utils/generateToken.js";

const userResolvers = {
  Query: {
    hello: () => "GraphQL Server is Working",

    getUsers: async () => {
      return await User.find();
    },
  },

  Mutation: {
    signup: async (_, { name, email, password }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User already exists");
      }

      const userCount = await User.countDocuments();

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: userCount === 0 ? "ADMIN" : "USER",
      });

      const token = generateToken(user);

      return { token, user };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      const token = generateToken(user);

      return {
        token,
        user,
      };
    },
  },
  User: {
    // Support both Mongoose docs (_id) and plain objects (id) so Project.assignedTo/createdBy work
    id: (parent) =>
      parent._id ? parent._id.toString() : parent.id || parent._id?.toString(),
  },
};

export default userResolvers;
