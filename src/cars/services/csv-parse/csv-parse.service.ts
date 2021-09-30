import { Injectable } from '@nestjs/common';
import * as parse from 'csv-parse';
import {
  access,
  appendFile,
  constants,
  existsSync,
  mkdirSync,
  writeFile,
} from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { DtoValidate } from '../../../utils/dto-validate.util';
import { ServeStaticProvider } from '../../../utils/serve-static.provider';
import { RecordCarDto } from '../../dtos';
import { ErrorRecord } from '../../interfaces/error-record.interface';
import { CarService } from '../car/car.service';

@Injectable()
export class CsvParseService {
  private errorsFileName: string;
  private errorsFilePath: string;
  private lineCounter = 0;

  constructor(private carService: CarService) {}

  async fromUploadedFile({ buffer, originalname }: Express.Multer.File) {
    await this.prepareErrorsFile(originalname);
    await this.parseCsvBuffer(buffer);

    const { folderName } = ServeStaticProvider;
    const createdRows = await this.carService.getInsertCount();

    return {
      createdRows,
      errorsFile: `${folderName}/${this.errorsFileName}`,
    };
  }

  private async prepareErrorsFile(originalName: string) {
    const { publicPath } = ServeStaticProvider;
    const fileName = originalName.split('.').shift();

    this.errorsFileName = `${Date.now()}-${fileName}.csv`;
    this.errorsFilePath = join(publicPath, this.errorsFileName);

    if (!existsSync(publicPath)) {
      mkdirSync(publicPath, { recursive: true });
    }

    try {
      const accessPromise = promisify(access);

      await accessPromise(this.errorsFilePath, constants.R_OK | constants.W_OK);
    } catch (error) {
      const writeFilePromise = promisify(writeFile);
      await writeFilePromise(this.errorsFilePath, '', { encoding: 'utf-8' });
    }
  }

  private async parseCsvBuffer(buffer: Buffer) {
    const parser = parse(buffer, {
      columns: true,
      encoding: 'utf-8',
      skipEmptyLines: true,
    });

    for await (const rawRecord of parser) {
      try {
        const record = this.mapRecord(rawRecord);
        const recordCarDto: RecordCarDto = await DtoValidate.transform(
          record,
          RecordCarDto,
        );

        await this.carService.addCar(recordCarDto);
      } catch (error) {
        await this.handleCsvParseError(error);
      }
    }
  }

  private mapRecord(rawRecord: any) {
    const defaultValue: Record<string, string> = {};

    return Object.keys(rawRecord).reduce((acc, rawKey) => {
      const key = rawKey.trim();

      acc[key] = rawRecord[rawKey];

      return acc;
    }, defaultValue);
  }

  private async handleCsvParseError(error: ErrorRecord) {
    const delimiter = ', ';
    let data = '';

    if (this.lineCounter === 0) {
      const headersLine = Object.keys(error.value).join(delimiter);
      const headerChunk = `${headersLine}, errors`;

      data += headerChunk + '\n';
    }

    const appendFilePromise = promisify(appendFile);
    const originalLine = Object.values(error.value).join(delimiter);
    const errorsCell = error.errors.join('| *');
    const chunkLine = `${originalLine}${delimiter}"* ${errorsCell}"`;

    data += chunkLine + '\n';

    await appendFilePromise(this.errorsFilePath, data, { encoding: 'utf-8' });

    this.lineCounter++;
  }
}
