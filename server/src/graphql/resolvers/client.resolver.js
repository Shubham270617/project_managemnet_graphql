import Client from "../../models/Client.js";

const clientResolvers = {
  Query: {
    getClients: async (_, __, context) => {
      if (!context.user) throw new Error("Not authenticated");

      if (context.user.role !== "ADMIN")
        throw new Error("Only admin can view clients");

      return await Client.find();
    },

    getClient: async (_, { id }, context) => {
      if (!context.user) throw new Error("Not authenticated");

      if (context.user.role !== "ADMIN")
        throw new Error("Only admin can view client");

      return await Client.findById(id);
    },
  },

  Mutation: {
    createClient: async (_, { name, email, phone }, context) => {
      if (!context.user) throw new Error("Not authenticated");

      if (context.user.role !== "ADMIN")
        throw new Error("Only admin can create client");

      const existing = await Client.findOne({ email });
      if (existing) {
        throw new Error("Client already exists");
      }

      return await Client.create({
        name,
        email,
        phone,
      });
    },

    deleteClient: async (_, { id }, context) => {
      if (!context.user) throw new Error("Not authenticated");

      if (context.user.role !== "ADMIN")
        throw new Error("Only admin can delete client");

      await Client.findByIdAndDelete(id);
      return "Client deleted successfully";
    },
  },

  // This is field level resolver in mongo db the id is store in _id but in our schema we want to return it as id so we need to resolve it here
  Client: {
    id: (parent) => parent._id.toString(),
  },
};

export default clientResolvers;
