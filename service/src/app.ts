import 'module-alias/register';

import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
// import { connectDB } from '@configs/db.config.js';
import { logSmartStockAI } from '@utils/log-app-name.util.js';
import { typeDefs, resolvers } from '@schemas/index.js';
import { authenticateUser } from '@middlewares/auth.middleware.js';
import requestLogger from '@middlewares/request-log.middleware.js';
import authRoutes from '@routes/auth.route.js';
import invoiceRoutes from '@routes/invoice.route.js';
import initializeInventoryMonitoring from '@schedulers/inventory-monitor.scheduler.js';


const app = express();

//* Global middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(requestLogger);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const PORT = process.env.PORT || 5000;
const BASE_PATH = process.env.BASE_PATH || '/api/v1';

async function startServer() {
  logSmartStockAI();

  //* Connect to the database
  // await connectDB();

  //* Await the server start
  await server.start();

  // Use Express middleware
  //? Note: cors() and json() are required for the middleware to work
  app.use(
    `${BASE_PATH}/graphql`,
    cors(),
    bodyParser.json(),
    helmet(),
    requestLogger,
    authenticateUser,
    expressMiddleware(server, {
      // Optional: context function to pass user info, DBs, etc.
      context: async ({ res }) => ({
        token: res.locals.accessToken,
        user: res.locals.authenticatedUser
      }),
    })
  );

  //* Mount routes
  app.use(`${BASE_PATH}/auth`,  authRoutes);
  app.use(`${BASE_PATH}/invoices`, invoiceRoutes);

  app.get(`${BASE_PATH}/health`, (req, res) => {
    res.send('GraphQL API is healthy');
  });

  initializeInventoryMonitoring();

  app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();