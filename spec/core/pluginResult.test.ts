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

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  PluginAction,
  PluginResultValidationError,
  validatePluginResult
} from '../../src/core';
import { PluginResult } from '../../src/core/plugin';

/**
 * Creates a plugin result to validate.
 *
 * @param {Object} [overrides] - Optional field overrides.
 * @returns {PluginResult} The plugin result under test.
 */
function createResult(overrides: Partial<PluginResult> = {}): PluginResult {
  return {
    actions: [],
    message: 'No action was required.',
    success: true,
    ...overrides
  };
}

describe('validatePluginResult', () => {
  it('accepts a successful result that performed supported actions', () => {
    const result = createResult({
      actions: [PluginAction.COMMENT, PluginAction.LABEL],
      message: 'Commented on the pull request.'
    });
    assert.doesNotThrow(() => validatePluginResult(result));
  });

  it('accepts an unsuccessful result that performed no actions', () => {
    const result = createResult({
      success: false,
      message: 'The pull request was already labelled.'
    });
    assert.doesNotThrow(() => validatePluginResult(result));
  });

  it('accepts a result reporting every supported action', () => {
    const result = createResult({
      actions: [
        PluginAction.COMMENT,
        PluginAction.LABEL,
        PluginAction.CLOSE,
        PluginAction.STATUS,
        PluginAction.ASSIGN,
        PluginAction.REMOVE_LABEL,
        PluginAction.REQUEST_REVIEW
      ],
      message: 'All supported actions.'
    });
    assert.doesNotThrow(() => validatePluginResult(result));
  });

  it('rejects a result whose actions are not a list', () => {
    const result = createResult({
      actions: 'not-a-list' as unknown as PluginAction[]
    });
    assert.throws(
      () => validatePluginResult(result),
      (err: Error) => (
        err instanceof PluginResultValidationError &&
        err.message.includes('list of actions')
      )
    );
  });

  it('rejects a result reporting an unsupported action', () => {
    const result = createResult({
      actions: ['MERGE' as PluginAction]
    });
    assert.throws(
      () => validatePluginResult(result),
      (err: Error) => (
        err instanceof PluginResultValidationError &&
        err.message.includes('unsupported action: MERGE')
      )
    );
  });

  it('rejects a result with an empty message', () => {
    const result = createResult({ message: '' });
    assert.throws(
      () => validatePluginResult(result),
      (err: Error) => (
        err instanceof PluginResultValidationError &&
        err.message.includes('non-empty string')
      )
    );
  });

  it('rejects a result whose success field is not a boolean', () => {
    const result = createResult({
      success: 'yes' as unknown as boolean
    });
    assert.throws(
      () => validatePluginResult(result),
      (err: Error) => (
        err instanceof PluginResultValidationError &&
        err.message.includes('must be a boolean')
      )
    );
  });
});