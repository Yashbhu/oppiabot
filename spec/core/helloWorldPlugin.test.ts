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
import { CoreEngine, PluginRegistry, Trigger } from '../../src/core';
import { HelloWorldPlugin } from '../../src/plugins/helloWorldPlugin';
import { createExecutionContext } from './testHelpers';

describe('HelloWorldPlugin', () => {
  it('executes successfully through the Core Engine for pull_request.opened', async () => {
    const registry = new PluginRegistry();
    const plugin = new HelloWorldPlugin();
    registry.register(plugin);

    const engine = new CoreEngine(registry);
    const results = await engine.execute(
      createExecutionContext(new Trigger('pull_request', 'opened'))
    );

    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].success, true);
    assert.strictEqual(results[0].message, 'hello world');
    assert.deepStrictEqual(results[0].actions, []);
  });

  it('is not resolved for unrelated triggers', async () => {
    const registry = new PluginRegistry();
    registry.register(new HelloWorldPlugin());

    const engine = new CoreEngine(registry);
    const results = await engine.execute(
      createExecutionContext(new Trigger('schedule', 'stale-sweep'))
    );

    assert.deepStrictEqual(results, []);
  });
});