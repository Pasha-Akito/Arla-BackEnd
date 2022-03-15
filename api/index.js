import { Neo4jGraphQL } from '@neo4j/graphql';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import neo4j from 'neo4j-driver';
import { typeDefs } from './graphql-schema.js';
import jwt from 'express-jwt';
import express from 'express';
import http from 'http';

dotenv.config();

// Neo4j driver instance
const driver = neo4j.driver(
    process.env.DATABASE_URL,
    neo4j.auth.basic(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD)
);

// Creating executable GraphQL schema 
// Neo4jGraphQL autogenerates resolvers
const neoSchema = new Neo4jGraphQL({
    typeDefs,
    config: {
        mutation: true,
        auth: {
            isAuthenticated: true,
            hasRole: true,
        },
    },
});

const app = express();

app.use(
    jwt({
        secret: process.env.JWT_SECRET,
        algorithms: ['RS256'],
        credentialsRequired: false,
    })
);

neoSchema.getSchema().then((schema) => {
    async function startApolloServer() {
        const httpServer = http.createServer(app);
        const server = new ApolloServer({
            schema,
            context: ({ req }) => {
                return {
                    driver,
                    req,
                    cypherParams: {
                        userId: req && req.user && req.user.sub,
                    },
                };
            },
            introspection: true,
            playground: true,
        });

        await server.start();

        server.applyMiddleware({ app, path: '/' });

        await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);


    }
    startApolloServer();
});

