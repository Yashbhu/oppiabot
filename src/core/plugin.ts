import {ExecutionContext} from './execution_context';
import {Trigger} from './trigger';
import {ConfigSchema} from '../types/configSchema';

/**
 * PluginAction domain object.
 *
 * Represents a GitHub operation performed by a plugin. These values are
 * target-domain abstractions of operations required by the existing workflows;
 * they do not imply that the legacy implementations used the same enum names.
 */
export interface PluginAction {
  /**
   * The type of GitHub operation performed (for example adding a comment,
   * adding or removing a label, or assigning a reviewer).
   */
  readonly type: string;

  /**
   * Operation-specific payload, if any.
   */
  readonly payload?: Record<string, unknown>;
}

/**
 * PluginResult domain object.
 *
 * Represents the outcome of plugin execution returned by an Oppiabot plugin
 * after processing an execution context.
 */
export interface PluginResult {
  /**
   * GitHub operations performed during execution.
   */
  readonly actions: readonly PluginAction[];

  /**
   * Human-readable explanation of the plugin execution result.
   */
  readonly message: string;

  /**
   * Indicates whether plugin execution completed successfully.
   */
  readonly success: boolean;
}

/**
 * PluginRegistrationMetadata domain object.
 *
 * The registration information a plugin provides so the Plugin Registry can
 * store it and the Core Engine can resolve and execute it. Each registration
 * provides the plugin name, supported triggers, configuration schema, and
 * execution handler.
 */
export interface PluginRegistrationMetadata {
  /**
   * Unique identifier of the plugin.
   */
  readonly name: string;

  /**
   * The triggers this plugin supports. A plugin may support both webhook
   * events and scheduled executions.
   */
  readonly supportedTriggers: readonly Trigger[];

  /**
   * Schema definition used to validate plugin-specific configuration.
   */
  readonly configSchema: ConfigSchema;

  /**
   * The plugin's execution handler, invoked by the Core Engine with the
   * normalized execution context.
   */
  readonly execute: (context: ExecutionContext) => Promise<PluginResult>;
}

/**
 * OppiabotPlugin domain object.
 *
 * The common contract that all Oppiabot plugins implement. The Core Engine
 * requires a consistent way to initialize and execute independent plugins
 * defined under src/plugins, so every plugin exposes its registration
 * metadata and a single execution handler through this contract.
 *
 * Each plugin exposes a single execution handler through the common plugin
 * contract, allowing plugins to support both webhook-driven and scheduled
 * execution through the same interface.
 */
export interface OppiabotPlugin {
  /**
   * Unique identifier of the plugin.
   */
  readonly name: string;

  /**
   * The triggers this plugin supports. The cadence of scheduled executions is
   * defined by the GitHub Actions workflow cron configuration rather than by
   * plugin metadata.
   */
  readonly supportedTriggers: readonly Trigger[];

  /**
   * Schema definition used to validate plugin-specific configuration.
   */
  readonly configSchema: ConfigSchema;

  /**
   * Executes workflow-specific plugin logic for the current execution
   * context.
   *
   * @param context - The normalized execution context. Contains the trigger
   *   that caused the execution and, for webhook-driven executions, the
   *   GitHub event information.
   * @returns The result of the plugin execution, describing the actions
   *   performed, a message, and the execution status.
   * @throws Error if required plugin configuration is missing or invalid, or
   *   if plugin execution fails.
   */
  execute(context: ExecutionContext): Promise<PluginResult>;
}