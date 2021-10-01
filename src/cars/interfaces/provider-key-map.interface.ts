import { RecordCarDto } from '../dtos';

export type TargetKey = keyof RecordCarDto;
export type TargetKeys = TargetKey[];

type KeyValue = {
  [k in TargetKey]: string;
};

type ValueKey = {
  [k: string]: TargetKey;
};

export type ProviderKeysMap = KeyValue & ValueKey;
export type ProvidersKeysMap = {
  [k: string]: ProviderKeysMap;
};
