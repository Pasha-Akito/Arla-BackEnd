import { gql } from 'apollo-server';

export const typeDefs = gql`

type Query {
  userCount(tokenId: String!): Int
    @cypher(
      statement: """
        MATCH (u:User {tokenId: $tokenId})
        RETURN count(*)
      """
    )
  userInterestCount(tokenId: String!, name: String!): Int
    @cypher(
      statement: """
        MATCH (u:User {tokenId: $tokenId})-[:IS_PERSON]-(p:Person)-[interest:INTEREST_IN]-(i:Interest {name: $name}) 
        RETURN count(interest)
      """
    )
}

type User {
  tokenId: String! @unique
  permissions: [String]
  email: String
  profile: Person! @relationship(type: "IS_PERSON", direction: OUT)
  friends: [Person!]! @relationship(type: "FRIENDS_WITH", direction: OUT)
}

type Person {
  name: String!
  bio: String
  image: String
  id: ID! @id
  country: String
  user: User! @relationship(type: "IS_PERSON", direction: IN)
  graduatedCourses: [Course!]! @relationship(type: "GRADUATED", direction: OUT, properties: "Graduated")
  interests: [Interest!]! @relationship(type: "INTEREST_IN", direction: OUT)
  posts: [Post!]! @relationship(type: "POSTED_BY", direction: OUT, properties: "PostedAt")
  friends: [User!]! @relationship(type: "FRIENDS_WITH", direction: IN)
}

type Interest {
  name: String!
  bio: String
  id: ID! @id
  peopleInterested: [Person!]! @relationship(type: "INTEREST_IN", direction: IN)
}

type Course {
  name: String!
  bio: String
  id: ID! @id
  peopleGraduated: [Person!]! @relationship(type: "GRADUATED", direction: IN, properties: "Graduated")
}

type Post {
  id: ID! @id
  content: String!
  creator: Person! @relationship(type: "POSTED_BY", direction: IN, properties: "PostedAt")
  createdAt: DateTime!
}

interface Graduated {
  year: Int
}

interface PostedAt {
    date: DateTime
}

`;

