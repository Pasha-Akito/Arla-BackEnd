import { Neo4jGraphQL } from '@neo4j/graphql';
import { ApolloServer } from 'apollo-server';
import dotenv from 'dotenv';
import neo4j from 'neo4j-driver';
import { typeDefs } from './schema.js';
import pkg from '@neo4j/graphql-plugin-auth';
const { Neo4jGraphQLAuthJWKSPlugin } = pkg;

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
    driver,
    plugins: {
        auth: new Neo4jGraphQLAuthJWKSPlugin({
            jwksEndpoint: 'https://dev-z5v8jnvt.us.auth0.com/.well-known/jwks.json'
        })
    }
});


neoSchema.getSchema().then((schema) => {
    neoSchema.assertIndexesAndConstraints({ options: { create: true } })
    const server = new ApolloServer({
        schema,
        context: ({ req }) => ({ req }),
    });

    server.listen().then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    });
})