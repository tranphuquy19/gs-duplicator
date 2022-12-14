export interface GitlabBranch {
  can_push: boolean;
  commit: any;
  default: boolean;
  developers_can_merge: boolean;
  developers_can_push: boolean;
  merged: boolean;
  name: string;
  protected: boolean;
  web_url: string;
}
