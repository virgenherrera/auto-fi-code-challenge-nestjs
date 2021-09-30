import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarsModule } from './cars/cars.module';
import { ServeStaticProvider } from './utils/serve-static.provider';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      name: 'default',
      logging: 'all',
      synchronize: true,
      database: 'db/cars-db',
      entities: ['dist/**/*.entity.js'],
    }),
    ServeStaticProvider.provider,
    CarsModule,
  ],
})
export class AppModule {}
