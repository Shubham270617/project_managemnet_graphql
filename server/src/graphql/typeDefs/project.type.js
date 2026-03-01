const projectType = `#graphql

  enum ProjectStatus {
    NOT_STARTED
    IN_PROGRESS
    COMPLETED
  }

  type Project {
    id: ID!
    title: String!
    description: String!
    status: ProjectStatus!
    assignedTo: Client!
    createdBy: User!
  }

  extend type Query {
    getProjects: [Project!]!
  }

  extend type Mutation {
    createProject(
      title: String!
      description: String!
      assignedTo: ID!
    ): Project!

    updateProjectStatus(
      id: ID!
      status: ProjectStatus!
    ): Project!

    deleteProject(id: ID!): String!
  }

`;

export default projectType;
