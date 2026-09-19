import {
  ExecutionContext,
  Trigger
} from '../../src/core';
import {
  RepositoryConfiguration,
  RepositoryContext
} from '../../src/types';

/**
 * Creates an initialized ExecutionContext for use in tests.
 *
 * @param {Trigger} trigger - The trigger to associate with the context.
 * @param {Object} [overrides] - Optional field overrides.
 * @returns {ExecutionContext} A valid ExecutionContext.
 */
export function createExecutionContext(
  trigger: Trigger,
  overrides: Partial<
    Pick<ExecutionContext, 'payload' | 'repository' | 'configuration'>
  > = {}
): ExecutionContext {
  const repository = overrides.repository || (
    new RepositoryContext('oppia', 'oppiabot', 'develop')
  );
  const configuration = overrides.configuration || (
    new RepositoryConfiguration('1.0', {})
  );
  return new ExecutionContext(
    trigger,
    overrides.payload || {},
    repository,
    configuration
  );
}