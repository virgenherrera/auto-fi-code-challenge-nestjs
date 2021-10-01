import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CsvFileInterceptor } from '../interceptors';
import { CsvParseService } from '../services';

@Controller('cars')
export class CarsController {
  constructor(private csvParseService: CsvParseService) {}
  @Post('csv-upload')
  @UseInterceptors(CsvFileInterceptor)
  async postCsvUpload(@UploadedFile() file: Express.Multer.File) {
    return await this.csvParseService.fromUploadedFile(file);
  }
}
