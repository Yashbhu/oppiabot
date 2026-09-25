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
 * @fileoverview Trigger domain object.
 */

/**
 * Represents the event that caused an Oppiabot execution.
 *
 * Runtime-specific entrypoints normalize platform events into this common
 * representation before invoking the Core Engine.
 */
export class Trigger {
  constructor(
    /** Canonical execution event. */
    public readonly event: string,
    /** Optional action/subtype associated with the event. */
    public readonly action?: string
  ) {}

  /**
   * Produces the exact canonical key for the trigger.
   *
   * @returns {string} The canonical trigger key. Example: "pull_request.opened"
   *   or "schedule.stale-sweep".
   */
  toKey(): string {
    if (this.action === undefined) {
      return this.event;
    }
    return `${this.event}.${this.action}`;
  }

  /**
   * Returns whether this trigger matches another trigger.
   *
   * A trigger matches another trigger when the event names are equal and
   * either this trigger has no action or its action equals the other trigger's
   * action. A registered trigger without an action therefore matches all
   * actions for its event.
   *
   * @param {Trigger} other - The trigger to compare against.
   * @returns {boolean} Whether this trigger matches the other trigger.
   */
  matches(other: Trigger): boolean {
    if (this.event !== other.event) {
      return false;
    }
    if (this.action === undefined) {
      return true;
    }
    return this.action === other.action;
  }

  /**
   * Validates the trigger domain object.
   *
   * @throws {TriggerValidationError} if the event is empty or the optional
   *   action is provided but empty.
   */
  validate(): void {
    if (this.event === '') {
      throw new TriggerValidationError(
        'The trigger event must be a non-empty string.'
      );
    }
    if (this.action !== undefined && this.action === '') {
      throw new TriggerValidationError(
        'The trigger action must be a non-empty string when provided.'
      );
    }
  }
}

/**
 * Error thrown when a Trigger is invalid.
 */
export class TriggerValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TriggerValidationError';
  }
}