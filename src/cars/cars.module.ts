import { Module } from '@nestjs/common';
import { CarsController } from './controllers/cars.controller';
import { CsvParseService } from './services';

@Module({
  controllers: [CarsController],
  providers: [CsvParseService],
})
export class CarsModule {}
