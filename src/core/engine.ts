import {ExecutionContext} from './execution_context';
import {PluginRegistry} from './pluginRegistry';

/**
 * Error thrown before the Core Engine execution pipeline is available.
 */
export class CoreEngineNotReadyError extends Error {
  constructor() {
    super(
      'Core Engine execution is not implemented yet. It is introduced in a ' +
        'later milestone; this commit only establishes the Core Engine ' +
        'package structure and the plugin contract.'
    );
    this.name = 'CoreEngineNotReadyError';
  }
}

/**
 * The Oppiabot Core Engine.
 *
 * The central orchestration layer responsible for coordinating repository
 * automation. It provides a common execution pipeline that initializes the
 * execution context, loads and validates repository configuration, resolves
 * applicable plugins, and coordinates plugin execution independently of the
 * underlying runtime environment. Install the current commit, this class is a
 * structural skeleton: it holds the plugin registry that execution will use
 * and documents the pipeline. The execution pipeline itself is introduced in
 * a later milestone.
 */
export class CoreEngine {
  private readonly registry: PluginRegistry;

  /**
   * Creates a Core Engine over the given plugin registry.
   *
   * @param registry - The plugin registry containing the plugins the engine
   *   will execute.
   */
  constructor(registry: PluginRegistry) {
    this.registry = registry;
  }

  /**
   * Returns the plugin registry managed by this engine.
   */
  getRegistry(): PluginRegistry {
    return this.registry;
  }

  /**
   * Executes the plugins applicable to the given execution context.
   *
   * The full pipeline (configuration loading, plugin resolution, execution
   * coordination, result aggregation, and failure isolation) is introduced in
   * a later milestone.
   *
   * @param context - The normalized execution context.
   * @throws CoreEngineNotReadyError until the execution pipeline is
   *   implemented.
   */
  execute(_context: ExecutionContext): Promise<void> {
    return Promise.reject(new CoreEngineNotReadyError());
  }
}