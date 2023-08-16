export interface GitlabCiConfigVariable {
  description: string;
  key: string;
  value: string;
  valueOptions?: any;
  __typename?: string;
}

export interface GitlabProject {
  id: string;
  ciConfigVariables: GitlabCiConfigVariable[] | null;
  __typename: string;
}

export interface GlGetCiConfigVariableResponse {
  data: { project: GitlabProject };
}
