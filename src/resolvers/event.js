import { combineResolvers } from 'graphql-resolvers';

import pubsub, { EVENTS } from '../subscription';
import { isAuthenticated, isEventOwner } from './authorization';
import { interfaces } from 'mocha';

const toCursorHash = string => Buffer.from(string).toString('base64');

const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    events: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
        ? {
            createdAt: {
              $lt: fromCursorHash(cursor),
            },
          }
        : {};
      const events = await models.Event.find(
        cursorOptions,
        null,
        {
          sort: { createdAt: -1 },
          limit: limit + 1,
        },
      );

      const hasNextPage = events.length > limit;
      const edges = hasNextPage ? events.slice(0, -1) : events;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(
            edges[edges.length - 1].createdAt.toString(),
          ),
        },
      };
    },
    event: async (parent, { id }, { models }) => {
      return await models.Event.findById(id);
    },
  },

  Mutation: {
    createEvent: combineResolvers(
      isAuthenticated,
      async (parent, { name, date, numAttendees, list, address, foodAndDrinks }, { models, me }) => {
        const dateTime = Date.parse(date);
        const event = await models.Event.create({
          name, 
          date: dateTime, 
          numAttendees: parseInt(numAttendees), 
          list, 
          address, 
          foodAndDrinks,
          userId: me.id,
        });

        pubsub.publish(EVENTS.EVENT.CREATED, {
          eventCreated: { event },
        });

        return event;
      },
    ),

    deleteEvent: combineResolvers(
      isAuthenticated,
      isEventOwner,
      async (parent, { id }, { models }) => {
        const event = await models.Event.findById(id);

        if (event) {
          await event.remove();
          return true;
        } else {
          return false;
        }
      },
    ),
  },

  Event: {
    user: async (event, args, { loaders }) => {
      return await loaders.user.load(event.userId);
    },
  },

  Subscription: {
    eventCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.EVENT.CREATED),
    },
  },
};
