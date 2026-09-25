import {CoreEngine, CoreEngineNotReadyError} from './engine';
import {PluginRegistry} from './pluginRegistry';
import {ExecutionContext} from './execution_context';

describe('CoreEngine', () => {
  it('holds the plugin registry it was constructed with', () => {
    const registry = new PluginRegistry();
    const engine = new CoreEngine(registry);

    expect(engine.getRegistry()).toBe(registry);
  });

  it('rejects execution until the execution pipeline is implemented', async () => {
    const engine = new CoreEngine(new PluginRegistry());
    const context: ExecutionContext = {
      trigger: {event: 'pull_request', action: 'opened'}
    };

    await expect(engine.execute(context)).rejects.toBeInstanceOf(
      CoreEngineNotReadyError
    );
    await expect(engine.execute(context)).rejects.toThrow(
      'Core Engine execution is not implemented yet.'
    );
  });
});