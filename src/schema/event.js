import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    events(cursor: String, limit: Int): EventConnection!
    event(id: ID!): Event!
  }

  extend type Mutation {
    createEvent(
        name: String!
        date: String!
        list: String
        address: String
        foodAndDrinks: String
        numAttendees: Int
    ): Event!

    deleteEvent(id: ID!): Boolean!
  }

  type EventConnection {
    edges: [Event!]!
    pageInfo: PageInfo!
  }

  extend type Subscription {
    eventCreated: EventCreated!
  }

  type EventCreated {
    event: Event!
  }

  type Event {
    id: ID!
    name: String!
    date: String!
    list: String!
    address: String!
    foodAndDrinks: String!
    numAttendees: Int!
    user: User!
    createdAt: Date!
  }
`;