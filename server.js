const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

dotenv.config({ path: './config/config.env' });

const app = express();

// connect to db
connectDB();

//start apollo sever for graphql
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// middleware
app.use(express.json({ limit: '500mb' })); // needen a higher limit to make the base64 pdf post request (500mb is too much)
server.applyMiddleware({ app });

// routes
app.use((req, res) => {
  res.status(200).send('Hello!').end();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    `Server started on http://localhost:${PORT}\nGraphql on http://localhost:${PORT}${server.graphqlPath}`
  )
);
