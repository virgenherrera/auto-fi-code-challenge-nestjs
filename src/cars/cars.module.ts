import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CarsController } from './controllers/cars.controller';
import {
  CarService,
  ColumnDefinitionService,
  CsvParseService,
} from './services';

@Module({
  imports: [ConfigModule],
  controllers: [CarsController],
  providers: [CsvParseService, CarService, ColumnDefinitionService],
})
export class CarsModule {}
