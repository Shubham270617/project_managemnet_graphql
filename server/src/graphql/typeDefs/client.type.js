const clientType = `#graphql

  type Client {
    id: ID!
    name: String!
    email: String!
    phone: String!
  }

  extend type Query {
    getClients: [Client!]!
    getClient(id: ID!): Client
  }
    
  extend type Mutation {
    createClient(
      name: String!
      email: String!
      phone: String!
    ): Client!

    deleteClient(id: ID!): String!
  }

`;

export default clientType;
