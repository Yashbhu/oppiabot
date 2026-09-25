/**
 * Trigger domain object.
 *
 * Represent the execution conditions that cause the Core Engine to resolve
 * and execute plugins. A trigger is constructed either from an incoming
 * GitHub webhook event (event + optional action) or from a scheduled
 * GitHub Actions execution.
 *
 * Note on scheduled executions: the cadence of a scheduled execution is
 * defined by the GitHub Actions workflow cron configuration rather than by
 * the Trigger. The Trigger only identifies which scheduled execution a
 * plugin supports.
 *
 * The full Trigger model (construction, validation, and canonical key
 * generation) is introduced in a later milestone. This file only defines
 * the minimal shape required by the plugin contract.
 */
export interface Trigger {
  /**
   * The GitHub event name (e.g. "pull_request", "issues") or "schedule" for
   * scheduled executions.
   */
  readonly event: string;

  /**
   * The optional event action. A trigger without an action matches all
   * actions for the event; a trigger with an action matches only that
   * combination.
   */
  readonly action?: string;
}