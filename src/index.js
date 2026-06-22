import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import models, { sequelize } from './models/index.js';
import resolvers from './resolvers/index.js';
import schema from './schema/index.js';

const app = express();

app.use(cors());

//const me = await models.User.findByLogin('nmassjou');
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async () => ({
    models,
    me: await models.User.findByLogin('nmassjou'),
    secret: process.env.SECRET,
  }),
});

await server.start();

server.applyMiddleware({ app, path: '/graphql' });

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }

  app.listen({ port: 8000 }, () => {
    console.log('Apollo Server is listening on http://localhost:8000/graphql');
  });
});

const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: 'nmassjou',
      email: 'naveed@foo.com',
      password: 'aaa',
      messages: [
        {
          text: 'Published the Road to learn React',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );

  await models.User.create(
    {
      username: 'ddavids',
      email: 'david@foo.com',
      password: 'bbb',
      messages: [
        {
          text: 'Happy to release ...',
        },
        {
          text: 'Published a complete ...',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};
