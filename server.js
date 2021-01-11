const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

const { ApolloServer, gql } = require('apollo-server-express');
// const { typeDefs, resolvers } = require('./schema');

dotenv.config({ path: './config/config.env' });

const app = express();

const { books, authors } = require('./testData');

const RootQueryType = Object({});

//graphql schemas
const typeDefs = gql`
  type Query {
    books: [Book!]!
    authors: [Author]
  }
  type Book {
    id: Int!
    name: String!
    authorId: Int!
    author: Author!
  }

  type Author {
    id: Int!
    name: String!
    books: [Book!]
  }
`;

//resolvers for graphql schemas
const resolvers = {
  Query: {
    books: () => books,
    authors: () => authors,
  },
  Book: {
    author: (parentBook) =>
      authors.find((author) => author.id === parentBook.authorId),
  },
  Author: {
    books: (parent) => books.filter((book) => book.authorId === parent.id),
  },
};

//init apollo graphql
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// connect to db
connectDB();

// middleware
server.applyMiddleware({ app });
app.use(express.json());

// routes
// app.use('/api/users', require('./routes/users'));
// app.use('/api/transactions', require('./routes/transactions'));
app.use((req, res) => {
  res.status(200);
  res.send('Hello!');
  res.end();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    `Server started on http://localhost:${PORT}\nGraphql on http://localhost:${PORT}${server.graphqlPath}`
  )
);
