import {PluginRegistrationMetadata} from './plugin';

/**
 * Error thrown when a plugin registration is invalid (for example when a
 * plugin is registered more than once).
 */
export class PluginRegistrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PluginRegistrationError';
  }
}

/**
 * PluginRegistry domain object.
 *
 * Maintains the list of available Oppiabot plugins. Plugins are explicitly
 * registered during application initialization; each registration provides
 * the plugin metadata (name, supported triggers, configuration schema, and
 * execution handler). The registry stores these registrations so the Core
 * Engine can look plugins up.
 *
 * Trigger-based plugin resolution is introduced in a later milestone; this
 * registry only provides registration and lookup.
 */
export class PluginRegistry {
  private readonly registrationsByName: Map<string, PluginRegistrationMetadata> =
    new Map();

  /**
   * Registers a plugin in the registry.
   *
   * @param plugin - The plugin to register.
   * @throws PluginRegistrationError if a plugin with the same name is already
   *   registered.
   */
  register(plugin: PluginRegistrationMetadata): void {
    if (this.registrationsByName.has(plugin.name)) {
      throw new PluginRegistrationError(
        `Plugin ${plugin.name} is already registered.`
      );
    }
    this.registrationsByName.set(plugin.name, plugin);
  }

  /**
   * Returns the registration for the plugin with the given name, or undefined
   * if no such plugin is registered.
   *
   * @param name - Unique identifier of the plugin.
   */
  getRegistration(name: string): PluginRegistrationMetadata | undefined {
    return this.registrationsByName.get(name);
  }

  /**
   * Returns a snapshot of all registered plugin registrations.
   */
  getAllRegistrations(): readonly PluginRegistrationMetadata[] {
    return Array.from(this.registrationsByName.values());
  }

  /**
   * Returns whether a plugin with the given name is registered.
   *
   * @param name - Unique identifier of the plugin.
   */
  isRegistered(name: string): boolean {
    return this.registrationsByName.has(name);
  }

  /**
   * Returns the number of registered plugins.
   */
  size(): number {
    return this.registrationsByName.size;
  }
}