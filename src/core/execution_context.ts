import {Trigger} from './trigger';

/**
 * ExecutionContext domain object.
 *
 * Represents the runtime information passed to a plugin when the Core Engine
 * executes it, including the trigger that caused the execution and, for
 * webhook-driven executions, the GitHub event details.
 *
 * The full ExecutionContext model (repository context, event payload, and
 * runtime execution state) is introduced in a later milestone. This file only
 * defines the minimal shape required by the plugin contract.
 */
export interface ExecutionContext {
  /**
   * The trigger that caused this execution.
   */
  readonly trigger: Trigger;
}