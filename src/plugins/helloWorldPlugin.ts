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
 * @fileoverview Dummy plugin used to validate the plugin architecture
 * end-to-end.
 */

import { ConfigSchema } from '../types';
import { ExecutionContext, PluginResult, Trigger } from '../core';
import { OppiabotPlugin } from '../core';

/**
 * Temporary dummy plugin that exercises the complete plugin execution path.
 *
 * The plugin responds to pull_request.opened events and returns a successful
 * PluginResult without performing any repository mutation. It validates the
 * Plugin Framework and Core Engine end-to-end before the first real plugin is
 * implemented.
 */
export class HelloWorldPlugin implements OppiabotPlugin {
  /** Unique identifier of the plugin. */
  readonly name = 'hello-world';
  /** Execution triggers supported by the plugin. */
  readonly supportedTriggers: Trigger[] = [
    new Trigger('pull_request', 'opened'),
  ];
  /** Schema definition used to validate plugin-specific configuration. */
  readonly configSchema: ConfigSchema = new ConfigSchema({}, []);

  /**
   * Executes the dummy plugin logic for the given execution context.
   *
   * @param {ExecutionContext} _context - The execution context.
   * @returns {Promise<PluginResult>} A successful PluginResult.
   */
  async execute(_context: ExecutionContext): Promise<PluginResult> {
    return {
      actions: [],
      message: 'hello world',
      success: true,
    };
  }
}