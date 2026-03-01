import dotenv from "dotenv";
dotenv.config(); // this loads the enviromment varial from th env file so that we can use it in our code using process.env

import express from "express";
import cors from "cors";
import http from "http";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import connectDB from "./config/db.js";
import typeDefs from "./graphql/schema.js";
import resolvers from "./graphql/resolvers/index.js";
import { verifyToken } from "./middleware/auth.js";

await connectDB();

const app = express();

app.use(cors());
app.use(express.json());

//Create instance apollo server
const server = new ApolloServer({
  typeDefs, //register a schema
  resolvers, // register a resolver
});

await server.start(); //start the server before we can use it as a middleware

app.use(
  "/graphql",
  cors(),
  express.json(), // data will come in parse formate
  // this is imortant because on every request it will read it, request the header , verify the token  and then add the user.
  expressMiddleware(server, {
    context: async ({ req }) => {
      const user = verifyToken(req);
      return { user };
    },
  }),
);

const httpServer = http.createServer(app); // creating a server

httpServer.listen(process.env.PORT, () => {
  console.log(
    `🚀 Server running at http://localhost:${process.env.PORT}/graphql`,
  );
});
