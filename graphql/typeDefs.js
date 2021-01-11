const { gql } = require('apollo-server-express');

//graphql schemas
const typeDefs = gql`
  type Query {
    user(id: ID!): User
    users: [User!]!
    invoice(id: ID!): Invoice
    invoices: [Invoice!]!
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

  interface MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  type UserResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    user: User
  }

  type InvoiceResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    invoice: Invoice
  }

  type Mutation {
    addUser(name: String!, email: String!, password: String!): UserResponse!
    addInvoice(
      title: String!
      storeName: String!
      storeUrl: String
      document: String
      warrantyFinalDate: String
      userID: ID!
    ): InvoiceResponse!
    loginUser(email: String!, password: String!): UserResponse!
    # edit invoice
    # delete invoice
  }
`;

module.exports = typeDefs;
