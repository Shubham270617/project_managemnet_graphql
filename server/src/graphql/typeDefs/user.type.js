const userType = `#graphql

  enum Role { 
    ADMIN
    USER
  }
    

  type User {
    id: ID!
    name: String!
    email: String!
    role: Role!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  extend type Query {
    getUsers: [User!]!
  }

  extend type Mutation {
    signup(
      name: String!
      email: String!
      password: String!
      role: Role
    ): AuthPayload!

    login(
      email: String!
      password: String!
    ): AuthPayload!
  }

`;

export default userType;
