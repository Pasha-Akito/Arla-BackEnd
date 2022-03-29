import { gql } from 'apollo-server';

export const typeDefs = gql`

type User {
  tokenId: String!
  permissions: [String]
  email: String
  profile: Person @relationship(type: "IS_PERSON", direction: OUT)
}

type Person {
  name: String!
  bio: String
  image: String
  id: ID! @id
  country: String
  user: User @relationship(type: "IS_PERSON", direction: IN)
  graduatedCourses: [Course!]! @relationship(type: "GRADUATED", direction: OUT, properties: "Graduated")
  interests: [Interest!]! @relationship(type: "INTEREST_IN", direction: OUT)
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

interface Graduated {
  year: Int
}

enum Role {
  User
  ADMIN
}

`;

