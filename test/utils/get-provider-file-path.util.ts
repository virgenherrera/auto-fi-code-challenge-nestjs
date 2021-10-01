import { join, resolve } from 'path';

export type FileFixture =
  | 'provider_a'
  | 'provider_b'
  | 'provider_c'
  | 'non-registered-provider';

export function getProviderFilePath(provider: FileFixture) {
  return resolve(join(__dirname, '../fixtures', `${provider}.csv`));
}
