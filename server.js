const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

const { ApolloServer, gql } = require('apollo-server-express');
// const { typeDefs, resolvers } = require('./schema');

dotenv.config({ path: './config/config.env' });

const app = express();

// connect to db
connectDB();

//data to est graphql
const { books, authors } = require('./testData');

//graphql schemas
const typeDefs = gql`
  type Query {
    book(id: Int!): Book!
    author(id: Int!): Author!
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

  type Mutation {
    addBook(name: String!, authorId: Int!): Book!
    addAuthor(name: String!): Author!
  }
`;

//resolvers for graphql schemas
const resolvers = {
  Query: {
    book: (parent, args) => books.find((book) => book.id === args.id),
    author: (parent, args) => authors.find((author) => author.id === args.id),
    books: () => books,
    authors: () => authors,
  },

  Book: {
    author: (parentBook) =>
      authors.find((author) => author.id === parentBook.authorId),
  },

  Author: {
    books: (parentAuthor) =>
      books.filter((book) => book.authorId === parentAuthor.id),
  },

  Mutation: {
    addBook: (_, { name, authorId }) => {
      const book = {
        id: books.length + 1,
        name,
        authorId,
      };
      books.push(book);
      return book;
    },
    addAuthor: (_, { name }) => {
      const author = {
        id: authors.length + 1,
        name,
      };
      authors.push(author);
      return author;
    },
  },
};

//init apollo graphql
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

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
