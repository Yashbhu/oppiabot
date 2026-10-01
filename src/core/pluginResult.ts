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
 * @fileoverview Plugin execution result contract.
 */

import { PluginAction, PluginResult } from './plugin';

/**
 * All supported GitHub operation values.
 *
 * A PluginResult is valid only when every action it reports is one of these
 * values, so the Core Engine can map each reported action to a GitHub operation
 * without handling unrecognised values.
 */
const SUPPORTED_ACTIONS: ReadonlySet<string> = new Set<string>(
  Object.values(PluginAction)
);

/**
 * Validates a plugin result against the result contract.
 *
 * A plugin returns a PluginResult describing the GitHub operations it
 * performed, a human-readable explanation, and whether execution completed
 * successfully. An unsuccessful result is a valid result rather than an
 * exception, and a plugin that performs no GitHub operation reports an empty
 * action list. Validation confirms that a result can be reported and
 * aggregated by the Core Engine: the actions form a list, every reported action
 * is a supported GitHub operation, the message is non-empty, and the execution
 * status is a boolean.
 *
 * @param {PluginResult} result - The plugin result to validate.
 * @throws {PluginResultValidationError} if the result does not satisfy the
 *   result contract.
 */
export function validatePluginResult(result: PluginResult): void {
  if (!Array.isArray(result.actions)) {
    throw new PluginResultValidationError(
      'The plugin result must contain a list of actions.'
    );
  }
  for (const action of result.actions) {
    if (!SUPPORTED_ACTIONS.has(action)) {
      throw new PluginResultValidationError(
        `The plugin result contains an unsupported action: ${action}.`
      );
    }
  }
  if (typeof result.message !== 'string' || result.message === '') {
    throw new PluginResultValidationError(
      'The plugin result message must be a non-empty string.'
    );
  }
  if (typeof result.success !== 'boolean') {
    throw new PluginResultValidationError(
      'The plugin result success field must be a boolean.'
    );
  }
}

/**
 * Error thrown when a PluginResult does not satisfy the result contract.
 */
export class PluginResultValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PluginResultValidationError';
  }
}