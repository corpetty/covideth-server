import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import { AuthenticationError, UserInputError } from 'apollo-server';

import { isAdmin, isAuthenticated } from './authorization';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  return await jwt.sign({ id, email, username, role }, secret, {
    expiresIn,
  });
};

export default {
  Query: {
    users: async (parent, args, { models }) => {
      return await models.User.find();
    },
    user: async (parent, { id }, { models }) => {
      return await models.User.findById(id);
    },
    me: async (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }

      return await models.User.findById(me.id);
    },
  },

  Mutation: {
    signUp: async (
      parent,
      { username, email, password },
      { models, secret },
    ) => {
      const user = await models.User.create({
        username,
        email,
        password,
      });

      return { token: createToken(user, secret, '300m') };
    },

    signIn: async (
      parent,
      { login, password },
      { models, secret },
    ) => {
      const user = await models.User.findByLogin(login);

      if (!user) {
        throw new UserInputError(
          'No user found with this login credentials.',
        );
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }

      return { token: createToken(user, secret, '300m') };
    },

    updateUser: combineResolvers(
      isAuthenticated,
      async (parent, { 
        username,
        twitter,
        verified,
        recovered,
        testStatus,
        symptomsOnset,
        symptoms,
        country,
        isolated,
        eventsAttended,
        source,
        anonymized,
       }, { models, me }) => {
         console.log(me)
         console.log("symptomsOnset: ", Date.parse(symptomsOnset));
        let dateTime = Date.parse(symptomsOnset);
        const updatedUser = await models.User.findByIdAndUpdate(
          me.id,
          { username,
            twitter,
            verified,
            recovered,
            testStatus,
            symptomsOnset: dateTime,
            symptoms,
            country,
            isolated,
            eventsAttended,
            source,
            anonymized, },
          { new: true },
        ).then((result) => {
          console.log(result)
        });
        
        return updatedUser
        
      },
    ),

    deleteUser: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }) => {
        const user = await models.User.findById(id);

        if (user) {
          await user.remove();
          return true;
        } else {
          return false;
        }
      },
    ),
  },

  User: {
    messages: async (user, args, { models }) => {
      return await models.Message.find({
        userId: user.id,
      });
    },
  },
};
