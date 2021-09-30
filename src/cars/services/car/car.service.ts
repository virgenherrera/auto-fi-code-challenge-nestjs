import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { Car } from '../../../entities/car.entity';
import { RecordCarDto } from '../../dtos';

@Injectable()
export class CarService {
  private batchSize = 7;
  private insertedCount = 0;
  private dtoBucket: RecordCarDto[] = [];

  async addCar(car: RecordCarDto) {
    this.dtoBucket.push(car);

    if (this.dtoBucket.length >= this.batchSize) {
      await this.bucketStore();
    }
  }

  async getInsertCount() {
    await this.bucketStore();

    return this.insertedCount;
  }

  private async bucketStore() {
    if (this.dtoBucket.length) {
      await this.insertBatch(this.dtoBucket);

      this.insertedCount += this.dtoBucket.length;
      this.dtoBucket = [];
    }
  }

  private async insertBatch(recordsBucket: RecordCarDto[]) {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Car)
      .values(recordsBucket)
      .execute();
  }
}
