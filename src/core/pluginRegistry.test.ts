import {PluginRegistrationError, PluginRegistry} from './pluginRegistry';
import {OppiabotPlugin, PluginResult} from './plugin';
import {ExecutionContext} from './execution_context';

function createPlugin(name: string): Required<OppiabotPlugin> {
  return {
    name,
    supportedTriggers: [{event: 'pull_request'}],
    configSchema: {},
    execute: async (_context: ExecutionContext): Promise<PluginResult> => ({
      actions: [],
      message: 'Done.',
      success: true
    })
  };
}

describe('PluginRegistry', () => {
  it('registers a plugin and allows lookup by name', () => {
    const registry = new PluginRegistry();
    const plugin = createPlugin('cla-check');

    registry.register(plugin);

    expect(registry.getRegistration('cla-check')).toEqual(plugin);
    expect(registry.isRegistered('cla-check')).toBe(true);
    expect(registry.size()).toBe(1);
  });

  it('returns undefined for a plugin that is not registered', () => {
    const registry = new PluginRegistry();
    expect(registry.getRegistration('missing')).toBeUndefined();
    expect(registry.isRegistered('missing')).toBe(false);
  });

  it('rejects registering the same plugin twice', () => {
    const registry = new PluginRegistry();
    const plugin = createPlugin('cla-check');

    registry.register(plugin);

    expect(() => registry.register(plugin)).toThrow(PluginRegistrationError);
    expect(() => registry.register(plugin)).toThrow(
      'Plugin cla-check is already registered.'
    );
  });

  it('lists all registered plugins as a snapshot', () => {
    const registry = new PluginRegistry();
    const first = createPlugin('cla-check');
    const second = createPlugin('pr-template');

    registry.register(first);
    registry.register(second);

    const registrations = registry.getAllRegistrations();
    expect(registrations).toHaveLength(2);
    expect(registrations).toContain(first);
    expect(registrations).toContain(second);
  });
});