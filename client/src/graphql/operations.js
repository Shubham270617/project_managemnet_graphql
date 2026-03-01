import { gql } from "@apollo/client";

// Auth
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export const SIGNUP = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

// Clients
export const GET_CLIENTS = gql`
  query GetClients {
    getClients {
      id
      name
      email
      phone
    }
  }
`;

export const CREATE_CLIENT = gql`
  mutation CreateClient($name: String!, $email: String!, $phone: String!) {
    createClient(name: $name, email: $email, phone: $phone) {
      id
      name
      email
      phone
    }
  }
`;

export const DELETE_CLIENT = gql`
  mutation DeleteClient($id: ID!) {
    deleteClient(id: $id)
  }
`;

// Projects
export const GET_PROJECTS = gql`
  query GetProjects {
    getProjects {
      id
      title
      description
      status
      assignedTo {
        id
        name
      }
      createdBy {
        id
        name
        email
      }
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $title: String!
    $description: String!
    $assignedTo: ID!
  ) {
    createProject(
      title: $title
      description: $description
      assignedTo: $assignedTo
    ) {
      id
      title
      description
      status
      assignedTo {
        id
        name
      }
    }
  }
`;

export const UPDATE_PROJECT_STATUS = gql`
  mutation UpdateProjectStatus($id: ID!, $status: ProjectStatus!) {
    updateProjectStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`;
