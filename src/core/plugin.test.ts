import {ExecutionContext} from './execution_context';
import {OppiabotPlugin, PluginResult} from './plugin';
import {Trigger} from './trigger';

const trigger: Trigger = {event: 'pull_request', action: 'opened'};
const context: ExecutionContext = {trigger};

describe('OppiabotPlugin contract', () => {
  it('defines a plugin through name, supportedTriggers, configSchema, and execute', () => {
    const successResult: PluginResult = {
      actions: [],
      message: 'No action required.',
      success: true
    };
    const plugin: OppiabotPlugin = {
      name: 'cla-check',
      supportedTriggers: [trigger],
      configSchema: {type: 'object'},
      execute: async (executionContext: ExecutionContext) => {
        expect(executionContext.trigger.event).toBe('pull_request');
        return successResult;
      }
    };

    expect(plugin.name).toBe('cla-check');
    expect(plugin.supportedTriggers).toEqual([trigger]);
    expect(plugin.configSchema).toEqual({type: 'object'});
  });

  it('returns a PluginResult with actions, message, and success', async () => {
    const result: PluginResult = {
      actions: [{type: 'add_comment', payload: {body: 'Welcome!'}}],
      message: 'Left a comment.',
      success: true
    };
    const plugin: OppiabotPlugin = {
      name: 'pr-onboarding',
      supportedTriggers: [{event: 'pull_request', action: 'opened'}],
      configSchema: {},
      execute: async () => result
    };

    const actualResult = await plugin.execute(context);
    expect(actualResult).toEqual(result);
    expect(actualResult.actions[0].type).toBe('add_comment');
    expect(actualResult.success).toBe(true);
  });
});