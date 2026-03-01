import userType from "./user.type.js";
import clientType from "./client.type.js";
import projectType from "./project.type.js";

/*
  Base Query and Mutation types required for extend to work
*/

const baseSchema = `#graphql
  type Query {
    _empty: String
    hello:String
  }

  type Mutation {
    _empty: String
  }
`;

const typeDefs = [baseSchema, userType, clientType, projectType];

export default typeDefs;
