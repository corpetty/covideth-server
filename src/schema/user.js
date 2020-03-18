import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  extend type Mutation {
    signUp(
      username: String!
      email: String!
      password: String!
    ): Token!

    signIn(login: String!, password: String!): Token!

    updateUser(
      username: String!
      twitter: String
      verified: Boolean
      recovered: Boolean
      testStatus: String
      symptomsOnset: String
      symptoms: String
      country: String
      isolated: Boolean
      source: String
      eventsAttended: [ID]
      anonymized: Boolean!
    ): User!
    
    deleteUser(id: ID!): Boolean!
  }

  type Token {
    token: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    twitter: String
    verified: Boolean
    recovered: Boolean
    testStatus: String
    symptomsOnset: String
    symptoms: String
    country: String
    isolated: Boolean
    source: String
    eventsAttended: [ID!]
    anonymized: String
    role: String
    messages: [Message!]
    createdAt: Date!
  }
`;

