import { Module } from '@nestjs/common';
import { CarsController } from './controllers/cars.controller';
import { CsvParseService } from './services';
import { CarService } from './services/car/car.service';

@Module({
  controllers: [CarsController],
  providers: [CsvParseService, CarService],
})
export class CarsModule {}
