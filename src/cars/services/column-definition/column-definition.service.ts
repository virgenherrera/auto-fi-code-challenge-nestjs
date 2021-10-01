import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RecordCarDto } from '../../dtos';
import {
  ProviderKeysMap,
  ProvidersKeysMap,
  TargetKeys,
} from '../../interfaces/provider-key-map.interface';

@Injectable()
export class ColumnDefinitionService {
  private targetKeys: TargetKeys = [
    'vin',
    'make',
    'model',
    'mileage',
    'year',
    'price',
    'zipCode',
  ];
  private providersKeysMap: ProvidersKeysMap;

  constructor(private configService: ConfigService) {
    this.setProvidersKeysMap();
  }

  getProviderKeyMap(FileName: string) {
    const provider = Object.keys(this.providersKeysMap).reduce(
      (acc, providerKey) => {
        if (acc) return acc;

        const providerRegEx = new RegExp(providerKey, 'i');

        if (providerRegEx.test(FileName)) {
          acc = providerKey;
        }

        return acc;
      },
      '',
    );

    return provider ? this.providersKeysMap[provider] : null;
  }

  private setProvidersKeysMap() {
    const carProviders = this.getCarProviders();
    const initialValue = {} as ProvidersKeysMap;

    this.providersKeysMap = carProviders.reduce((acc, provider) => {
      acc[provider] = this.getProviderKeysMap(provider);

      return acc;
    }, initialValue);
  }

  private getProviderKeysMap(provider: string) {
    const initialValue = {} as ProviderKeysMap;

    return this.targetKeys.reduce((acc, key) => {
      const mappedKey = this.getProviderMappedKey(provider, key);

      acc[key] = mappedKey;
      acc[mappedKey] = key;

      return acc;
    }, initialValue);
  }

  private getProviderMappedKey(provider: string, key: keyof RecordCarDto) {
    const EnvKey = `${provider}_${key.toUpperCase()}`;
    const mappedKey = this.configService.get<string>(EnvKey);

    if (!mappedKey) {
      throw Error(`${EnvKey} not provided.`);
    }

    return mappedKey.trim();
  }

  private getCarProviders() {
    const CAR_PROVIDERS = this.configService.get<string>('CAR_PROVIDERS');

    if (!CAR_PROVIDERS) {
      throw Error(`CAR_PROVIDERS not provided.`);
    }

    return CAR_PROVIDERS.split(',').map(provider => provider.toUpperCase());
  }
}
