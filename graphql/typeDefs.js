const { gql } = require('apollo-server-express');

//graphql schemas
const typeDefs = gql`
  type Query {
    user(id: ID!): User!
    users: [User!]!
    invoice(id: ID!): Invoice!
    invoices: [Invoice!]!
    # login user
  }

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    invoices: [Invoice!]!
  }

  type Invoice {
    id: ID!
    title: String!
    storeName: String!
    storeUrl: String
    document: String
    warrantyFinalDate: String
    userID: ID!
    user: User!
  }

  type Mutation {
    addUser(name: String!, email: String!, password: String!): User!
    addInvoice(
      title: String!
      storeName: String!
      storeUrl: String
      document: String
      warrantyFinalDate: String
      userID: ID!
    ): Invoice!
    # edit invoice
    # delete invoice
  }
`;

module.exports = typeDefs;
