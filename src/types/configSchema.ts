/**
 * ConfigSchema type.
 *
 * Schema definition used by a plugin to validate its plugin-specific
 * configuration in the repository configuration file (.github/oppiabot.yml).
 *
 * The configuration loader that interprets this schema is introduced with the
 * configuration model in a later milestone. This file only defines the minimal
 * structural type used by the plugin contract.
 */
export type ConfigSchema = Record<string, unknown>;