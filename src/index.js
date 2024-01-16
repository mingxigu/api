// index.js
// This is the main entry point of our application``

const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

require('dotenv').config();
const db = require('./db');
const models = require('./models');

// Run the server on a port specified in our .env file or port 4000
const port = process.env.PORT || 4000;

// Store the DB_HOST value defiend in the .env file as a variable
const DB_HOST = process.env.DB_HOST;

// Temporary data to test API
let notes = [
    { id: '1', content: 'This is a note', author: 'MingXi Gu'},
    { id: '2', content: 'This is a another note', author: 'Adelina Dobromir'}, 
    { id: '1', content: 'OMG, another note!', author: 'Sofia McVetty'}
]

// Construct a schema using GraphQL schema language
const typeDefs = gql`
    type Note {
        id: ID!
        content: String!
        author: String!
    }

    type Query {
        hello: String
        notes: [Note!]!
        note(id: ID!): Note!
    }

    type Mutation {
        newNote(content: String!): Note!
    }
`;

// Provide resolver functions for our schema fields
const resolvers = {
    Query: {
        hello: () => 'Hello World',
        notes: async () => {
            return await models.Note.find();
        },
        note: (parent, args) => {
            return notes.find(note => note.id === args.id);
        }
    },
    Mutation: {
        newNote: (parent, args) => {
            let noteValue = {
                id: String(notes.length + 1),
                content: args.content,
                author: 'Fred Johnson'
            };
            notes.push(noteValue);
            return noteValue;
        }
    }
};



const app = express();

// Connect to the database
db.connect(DB_HOST);


// app.get('/', (req, res) => res.send ('Hello World!'));


// Apollo Server setup
const server = new ApolloServer({ typeDefs, resolvers });

// Apply the Apollo GraphQL middleware and set the path to /api
server.applyMiddleware({ app, path: '/api'});
app.listen({ port }, () => console.log('GraphQL Server running at http://localhost:${port}${server.graphqlPath'));