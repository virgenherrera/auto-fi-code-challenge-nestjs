import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CsvFileInterceptor } from '../interceptors';

@Controller('cars')
export class CarsController {
  @Post('csv-upload')
  @UseInterceptors(CsvFileInterceptor)
  async postCsvUpload(@UploadedFile() file: Express.Multer.File) {
    Object.keys(file).forEach(key => console.log(key, file[key]));

    return true;
  }
}
