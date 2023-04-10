export const getCiConfigVariablesQueryStr = `query ciConfigVariables($fullPath: ID!, $ref: String!) {
  project(fullPath: $fullPath) {
    id
    ciConfigVariables(ref: $ref) {
      description
      key
      value
      valueOptions
      __typename
    }
    __typename
  }
}
`;

export interface CiConfigVariablesQuery {
  fullPath: string;
  ref: string;
}
