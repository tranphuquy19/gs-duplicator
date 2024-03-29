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

export const getPipelineSchedulesQueryStr = `query getPipelineSchedulesQuery($projectPath: ID!, $status: PipelineScheduleStatus, $ids: [ID!] = null, $first: Int, $last: Int, $prevPageCursor: String = "", $nextPageCursor: String = "") {
  currentUser {
    id
    username
    __typename
  }
  project(fullPath: $projectPath) {
    id
    pipelineSchedules(
      status: $status
      ids: $ids
      first: $first
      last: $last
      after: $nextPageCursor
      before: $prevPageCursor
    ) {
      count
      nodes {
        id
        description
        cron
        cronTimezone
        ref
        forTag
        editPath
        refPath
        refForDisplay
        lastPipeline {
          id
          detailedStatus {
            id
            group
            icon
            label
            text
            detailsPath
            __typename
          }
          __typename
        }
        active
        nextRunAt
        realNextRun
        owner {
          id
          username
          avatarUrl
          name
          webPath
          __typename
        }
        variables {
          nodes {
            id
            variableType
            key
            value
            __typename
          }
          __typename
        }
        userPermissions {
          playPipelineSchedule
          updatePipelineSchedule
          adminPipelineSchedule
          __typename
        }
        __typename
      }
      pageInfo {
        ...PageInfo
        __typename
      }
      __typename
    }
    __typename
  }
}

fragment PageInfo on PageInfo {
  hasNextPage
  hasPreviousPage
  startCursor
  endCursor
  __typename
}
`;

export const getPipelineScheduleQueryStr = `query getPipelineSchedulesQuery($projectPath: ID!, $status: PipelineScheduleStatus, $ids: [ID!] = null) {
  currentUser {
    id
    username
    __typename
  }
  project(fullPath: $projectPath) {
    id
    pipelineSchedules(status: $status, ids: $ids) {
      count
      nodes {
        id
        description
        cron
        cronTimezone
        ref
        forTag
        editPath
        refPath
        refForDisplay
        lastPipeline {
          id
          detailedStatus {
            id
            group
            icon
            label
            text
            detailsPath
            __typename
          }
          __typename
        }
        active
        nextRunAt
        realNextRun
        owner {
          id
          username
          avatarUrl
          name
          webPath
          __typename
        }
        variables {
          nodes {
            id
            variableType
            key
            value
            __typename
          }
          __typename
        }
        userPermissions {
          playPipelineSchedule
          updatePipelineSchedule
          adminPipelineSchedule
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
}
`;

export const updatePipelineScheduleMutationStr = `mutation updatePipelineSchedule($input: PipelineScheduleUpdateInput!) {
  pipelineScheduleUpdate(input: $input) {
    clientMutationId
    errors
    __typename
  }
}
`;

export interface CiConfigVariablesQuery {
  fullPath: string;
  ref: string;
}
