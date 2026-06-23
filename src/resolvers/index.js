import { DateTimeResolver } from 'graphql-scalars'

import userResolvers from './user.js';
import messageResolvers from './message.js';

const customDateResolver = {
  Date: DateTimeResolver,
};

export default [
  customDateResolver,
  userResolvers,
  messageResolvers
];
