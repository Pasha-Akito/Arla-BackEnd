const { Neo4jGraphQL } = require("@neo4j/graphql");
const { ApolloServer, gql } = require("apollo-server");
const neo4j = require("neo4j-driver");

const typeDefs = gql`
type Country {
	name: String!
	peopleLivesIn: [Person!]! @relationship(type: "LIVES_IN", direction: IN)
}

type Course {
	name: String!
	peopleGraduated: [Person!]! @relationship(type: "GRADUATED", direction: IN, properties: "GraduatedProperties")
	year: String
}

interface GraduatedProperties @relationshipProperties {
	year: BigInt
}

type Interest {
	name: String!
	peopleInterestIn: [Person!]! @relationship(type: "INTEREST_IN", direction: IN)
}

type Person {
	bio: String
	email: String
	graduatedCourses: [Course!]! @relationship(type: "GRADUATED", direction: OUT, properties: "GraduatedProperties")
	id: String
	interestInInterests: [Interest!]! @relationship(type: "INTEREST_IN", direction: OUT)
	livesInCountries: [Country!]! @relationship(type: "LIVES_IN", direction: OUT)
	name: String!
	profile: String
	token: String
}
`;

const driver = neo4j.driver(
    "neo4j+s://f6ec99dd.databases.neo4j.io:7687",
    neo4j.auth.basic("neo4j", "RimrUr_ovCfoXxu3ty5IibqWaC0-sp4kjQqgg7JNWyM")
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

neoSchema.getSchema().then((schema) => {
    const server = new ApolloServer({
        schema,
    });
  
    server.listen().then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    });
  })