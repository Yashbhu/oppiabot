// Copyright 2026 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Oppiabot Core Engine.
 */

import { ExecutionContext } from './execution_context';
import { OppiabotPlugin } from './plugin';
import { PluginResult } from './plugin';
import { PluginRegistry } from './pluginRegistry';

/**
 * The Oppiabot Core Engine is the central orchestration layer responsible for
 * coordinating repository automation.
 *
 * The Core Engine receives a normalized ExecutionContext from either a webhook
 * or a scheduled runtime entrypoint and executes the plugins applicable to the
 * current execution trigger. Plugin execution is coordinated independently of
 * the underlying runtime environment: the Core Engine does not branch based on
 * the runtime that invoked it.
 *
 * Responsibilities:
 * - Validate the execution context.
 * - Resolve plugins applicable to the execution trigger.
 * - Coordinate plugin execution.
 * - Aggregate plugin execution results.
 * - Apply the plugin failure-isolation policy.
 */
export class CoreEngine {
  constructor(
    private readonly pluginRegistry: PluginRegistry
  ) {}

  /**
   * Executes the plugins applicable to the current execution.
   *
   * Each applicable plugin is executed independently. Plugin execution
   * failures are isolated per plugin: a failure in one plugin does not prevent
   * other applicable plugins from executing. Failed plugin executions are
   * recorded as unsuccessful PluginResult objects in the aggregated results.
   *
   * @param {ExecutionContext} context - Initialized execution context
   *   containing trigger information, event data, and repository information.
   * @returns {Promise<PluginResult[]>} The aggregated results of all executed
   *   plugins.
   * @throws {ExecutionContextValidationError} if the execution context is
   *   invalid.
   */
  async execute(context: ExecutionContext): Promise<PluginResult[]> {
    context.validate();

    const plugins = this.pluginRegistry.resolvePlugins(context.trigger);
    const results: PluginResult[] = [];
    for (const plugin of plugins) {
      results.push(await this.executePlugin(plugin, context));
    }
    return results;
  }

  /**
   * Executes a single plugin, isolating any execution failure.
   *
   * @param {OppiabotPlugin} plugin - The plugin to execute.
   * @param {ExecutionContext} context - The execution context.
   * @returns {Promise<PluginResult>} The plugin execution result.
   */
  private async executePlugin(
    plugin: OppiabotPlugin,
    context: ExecutionContext
  ): Promise<PluginResult> {
    try {
      return await plugin.execute(context);
    } catch (err) {
      const errorMessage = (
        err instanceof Error ? err.message : String(err)
      );
      return {
        actions: [],
        success: false,
        message: (
          `Plugin '${plugin.name}' failed to execute: ${errorMessage}`
        ),
      };
    }
  }
}