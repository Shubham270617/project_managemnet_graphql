import clientResolvers from "./client.resolver.js";
import userResolvers from "./user.resolver.js";
import projectResolvers from "./project.resolver.js";

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...projectResolvers.Query,
    ...clientResolvers.Query,
  },

  Mutation: {
    ...userResolvers.Mutation,
    ...projectResolvers.Mutation,
    ...clientResolvers.Mutation,
  },

  User: {
    ...userResolvers.User,
  },

  Project: {
    ...projectResolvers.Project,
  },

  Client: {
    ...clientResolvers.Client,
  },
};

export default resolvers;
