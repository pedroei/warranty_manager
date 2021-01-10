const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

const { ApolloServer, gql } = require('apollo-server-express');
// const { typeDefs, resolvers } = require('./schema');

dotenv.config({ path: './config/config.env' });

const app = express();

//graphql schemas
const typeDefs = gql`
  type Query {
    message: String!
  }
`;

const resolvers = {
  Query: {
    message: () => 'Hello World!! ;)',
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
