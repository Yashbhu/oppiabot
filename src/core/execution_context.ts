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
 * @fileoverview ExecutionContext domain object.
 */

import { Trigger } from './trigger';
import { RepositoryContext } from '../types/repository';
import { RepositoryConfiguration } from
  '../types/repository_configuration';

/**
 * Runtime-specific event payload supplied by the runtime entrypoint. Webhook
 * executions provide the corresponding GitHub event payload, while scheduled
 * executions provide the payload required by the scheduled workflow.
 */
export type RuntimeEventPayload = Record<string, unknown>;

/**
 * Represents the runtime information required for a single Oppiabot execution.
 *
 * The ExecutionContext is constructed by the runtime entrypoint and passed to
 * the Core Engine, which coordinates plugin execution using the trigger and
 * repository information it contains.
 */
export class ExecutionContext {
  constructor(
    /** Trigger that caused this execution. Derived from the runtime entrypoint. */
    public readonly trigger: Trigger,
    /** Runtime-specific event payload supplied by the runtime entrypoint. */
    public readonly payload: RuntimeEventPayload,
    /** Repository information required during Oppiabot execution. */
    public readonly repository: RepositoryContext,
    /**
     * Repository-specific Oppiabot configuration loaded from
     * .github/oppiabot.yml.
     */
    public readonly configuration?: RepositoryConfiguration,
    /**
     * Identifies the GitHub webhook delivery when execution originates from a
     * webhook. Scheduled executions do not provide a GitHub webhook delivery
     * ID.
     */
    public readonly deliveryId?: string
  ) {}

  /**
   * Validates the ExecutionContext domain object.
   *
   * @throws {ExecutionContextValidationError} if the execution context is
   *   invalid.
   */
  validate(): void {
    if (this.trigger === undefined || this.trigger === null) {
      throw new ExecutionContextValidationError(
        'The execution context must contain a structurally valid trigger.'
      );
    }
    try {
      this.trigger.validate();
    } catch (error) {
      const errorMessage = (
        error instanceof Error ? error.message : String(error)
      );
      throw new ExecutionContextValidationError(
        'The execution context contains an invalid trigger: ' + errorMessage
      );
    }
    if (this.repository === undefined || this.repository === null) {
      throw new ExecutionContextValidationError(
        'The execution context must contain repository information.'
      );
    }
    try {
      this.repository.validate();
    } catch (error) {
      const errorMessage = (
        error instanceof Error ? error.message : String(error)
      );
      throw new ExecutionContextValidationError(
        'The execution context contains an invalid repository: ' + errorMessage
      );
    }
  }
}

/**
 * Error thrown when an ExecutionContext is invalid.
 */
export class ExecutionContextValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExecutionContextValidationError';
  }
}