export const ORCHESTRATOR_DEFAULTS = {
  connectorTimeoutMs: 15_000,
  connectorRetries: 0,
  defaultConcurrency: 12,
  maxQueryTasks: {
    normal: 360,
    aggressive: 720,
  },
  minimumQueries: {
    normal: 4,
    aggressive: 6,
  },
};

export const GRAPH_LIMITS = {
  maxDomainGroup: 20,
  maxEmailDomainGroup: 20,
  maxUsernameGroup: 30,
};
