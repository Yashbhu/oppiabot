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
  RepositoryContext,
  RepositoryContextValidationError
} from '../../src/types';

describe('RepositoryContext', () => {
  describe('getFullName', () => {
    it('returns the repository identifier', () => {
      const repository = new RepositoryContext('oppia', 'oppiabot', 'develop');
      assert.strictEqual(repository.getFullName(), 'oppia/oppiabot');
    });
  });

  describe('validate', () => {
    it('accepts a repository with all fields populated', () => {
      const repository = new RepositoryContext('oppia', 'oppiabot', 'develop');
      assert.doesNotThrow(() => repository.validate());
    });

    it('rejects a repository with an empty owner', () => {
      const repository = new RepositoryContext('', 'oppiabot', 'develop');
      assert.throws(
        () => repository.validate(),
        (err: Error) => (
          err instanceof RepositoryContextValidationError &&
          err.message.includes('owner')
        )
      );
    });

    it('rejects a repository with an empty name', () => {
      const repository = new RepositoryContext('oppia', '', 'develop');
      assert.throws(
        () => repository.validate(),
        (err: Error) => (
          err instanceof RepositoryContextValidationError &&
          err.message.includes('name')
        )
      );
    });

    it('rejects a repository with an empty default branch', () => {
      const repository = new RepositoryContext('oppia', 'oppiabot', '');
      assert.throws(
        () => repository.validate(),
        (err: Error) => (
          err instanceof RepositoryContextValidationError &&
          err.message.includes('default_branch')
        )
      );
    });

    it('lists all empty fields in the error message', () => {
      const repository = new RepositoryContext('', '', '');
      assert.throws(
        () => repository.validate(),
        (err: Error) => (
          err instanceof RepositoryContextValidationError &&
          err.message.includes('owner') &&
          err.message.includes('name') &&
          err.message.includes('default_branch')
        )
      );
    });
  });
});