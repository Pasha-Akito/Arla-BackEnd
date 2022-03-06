const { Neo4jGraphQL } = require("@neo4j/graphql");
const { ApolloServer } = require("apollo-server");
const neo4j = require("neo4j-driver");
const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

// Loading type definitions from schema.graphql file
const typeDefs = fs
    .readFileSync(path.join(__dirname, "schema.graphql"))
    .toString("utf-8");

// Creating executable GraphQL schema 
// Neo4jGraphQL autogenerates resolvers

const neoSchema = new Neo4jGraphQL({
    typeDefs
});

// Neo4j driver instance
const driver = neo4j.driver(
    process.env.DATABASE_URL,
    neo4j.auth.basic(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD)
);

const server = new ApolloServer({
    context: { driver,  },
    schema: neoSchema.schema,
    introspection: true,
    playground: true
  });
  
  
// Starting Apollo Server
    server.listen().then(({ url }) => {
        console.log(`🚀 GraphQL Server ready at ${url}`);
    });