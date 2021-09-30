import {
  IsDefined,
  IsInt,
  IsNumber,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { maxCarYear, minCarYear, plateRegEx, zipCodeRegEx } from '../constants';

export class RecordCarDto {
  @IsDefined()
  @Matches(plateRegEx)
  vin: string;

  @IsDefined()
  @IsString()
  make: string;

  @IsDefined()
  @IsString()
  model: string;

  @IsDefined()
  @IsString()
  mileage: string;

  @IsDefined()
  @IsInt()
  @Min(minCarYear)
  @Max(maxCarYear)
  year: number;

  @IsDefined()
  @IsNumber()
  @Min(1)
  price: number;

  @IsDefined()
  @Matches(zipCodeRegEx)
  zipCode: string;
}
