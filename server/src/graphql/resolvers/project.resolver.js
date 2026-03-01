import Project from "../../models/Project.js";
import User from "../../models/User.js";
import Client from "../../models/Client.js";

const projectResolvers = {
  Query: {
    getProjects: async (_, __, context) => {
      if (!context.user) throw new Error("Not authenticated");

      // For this app we keep it simple:
      // any authenticated user (admin or client) sees all projects.
      return await Project.find();
    },
  },

  Mutation: {
    createProject: async (_, { title, description, assignedTo }, context) => {
      // console.log("Create project called");
      if (!context.user) throw new Error("Not authenticated");
      if (context.user.role !== "ADMIN")
        throw new Error("Only admin can create project");

      // assignedTo must be a valid Client id
      const client = await Client.findById(assignedTo);
      if (!client) {
        throw new Error(
          "Client not found. Use a valid Client id for assignedTo.",
        );
      }

      const existing = await Project.findOne({ title, description });
      if (existing) {
        throw new Error("Project already exists");
      }

      return await Project.create({
        title,
        description,
        assignedTo,
        createdBy: context.user.id,
      });
    },

    updateProjectStatus: async (_, { id, status }, context) => {
      if (!context.user) throw new Error("Not authenticated");

      const project = await Project.findById(id);
      if (!project) throw new Error("Project not found");

      // Allow any authenticated user (ADMIN or client/user) to update status
      project.status = status;
      await project.save();

      return project;
    },

    deleteProject: async (_, { id }, context) => {
      if (!context.user) throw new Error("Not authenticated");
      if (context.user.role !== "ADMIN")
        throw new Error("Only admin can delete project");

      await Project.findByIdAndDelete(id);
      return "Project deleted successfully";
    },
  },

  // Field resolvers: assignedTo is Client, createdBy is Admin
  Project: {
    id: (parent) => parent._id.toString(), //Mongo Db give _id butbut graphql expect id so we have mapped it and resolved it here

    assignedTo: async (parent) => {
      const client = await Client.findById(parent.assignedTo);

      if (!client) {
        throw new Error("Assigned client not found");
      }

      // Return client doc so Client type resolvers (e.g. id) work
      return client;
    },

    createdBy: async (parent) => {
      const user = await User.findById(parent.createdBy);

      if (!user) {
        throw new Error("CreatedBy user not found");
      }

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      };
    },
  },
};

export default projectResolvers;
