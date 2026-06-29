import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';

import models, { sequelize } from './models/index.js';
import resolvers from './resolvers/index.js';
import schema from './schema/index.js';

const app = express();

app.use(cors());

const getMe = async (req) => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      return jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.');
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async ({ req }) => {
    const me = await getMe(req);
    return { models, me, secret: process.env.SECRET };
  },
});

await server.start();

const path = process.env.BASE_PATH || '/graphql';
const eraseDatabaseOnSync = process.env.RESET_DB === 'true';

server.applyMiddleware({ app, path });

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages(new Date());
  }

  const port = process.env.NODE_PORT || 8000;
  app.listen({ port }, () => {
    console.log('Apollo Server is listening on http://localhost:8000/graphql');
  });
});

const createUsersWithMessages = async (now) => {
  await models.User.create(
    {
      username: 'naveed',
      email: 'naveed@foo.com',
      password: 'aaa',
      role: 'ADMIN',
      messages: [
        {
          text: 'Published the Road to learn React',
          createdAt: now.setSeconds(now.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Message],
    },
  );

  await models.User.create(
    {
      username: 'david',
      email: 'david@foo.com',
      password: 'bbb',
      messages: [
        {
          text: 'Happy to release ...',
          createdAt: now.setSeconds(now.getSeconds() + 2),
        },
        {
          text: 'Published a complete ...',
          createdAt: now.setSeconds(now.getSeconds() + 3),
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};
