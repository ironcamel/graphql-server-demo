import cors from 'cors';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import models from './models/index.js';
import resolvers from './resolvers/index.js';
import schema from './schema/index.js';

const app = express();

app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    models,
    me: models.users[1],
  },
});

await server.start();

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});
