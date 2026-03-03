export type StructuredError = {
  code: string;
  message: string;
  details?: string;
};

type OptionalString = string | undefined;

export function getOptionalEnv(name: string): OptionalString {
  const raw = process.env[name];
  if (!raw) return undefined;
  const value = raw.trim();
  return value.length ? value : undefined;
}

export function getRequiredEnv(name: string): string {
  const value = getOptionalEnv(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getBooleanEnv(name: string, defaultValue: boolean): boolean {
  const value = getOptionalEnv(name);
  if (!value) return defaultValue;
  const lowered = value.toLowerCase();
  if (lowered === "true") return true;
  if (lowered === "false") return false;
  return defaultValue;
}

export function makeError(code: string, message: string, details?: string): StructuredError {
  return { code, message, details };
}

