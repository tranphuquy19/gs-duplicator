export interface GitlabPipeline {
  id: number;
  scope: string;
  status: string;
  source: string;
  ref: string;
  sha: string;
  yaml_errors: string;
  username: string;
  updated_after: Date;
  updated_before: Date;
  order_by: string;
  sort: string;
}
