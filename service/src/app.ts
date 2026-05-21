import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});



const PORT = process.env.PORT || 5000;



async function startServer() {

  // Await the server start
  await server.start();

  // Use Express middleware
  // Note: cors() and json() are required for the middleware to work
  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      // Optional: context function to pass user info, DBs, etc.
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();