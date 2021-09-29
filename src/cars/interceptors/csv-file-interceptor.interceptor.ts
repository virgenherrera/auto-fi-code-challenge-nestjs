import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

export const CsvFileInterceptor = FileInterceptor('provider', {
  preservePath: true,
  fileFilter: (_req, file, cb) => {
    const argsMap = {
      ok: [null, true],
      error: [
        new BadRequestException(
          `file: '${file.originalname}' is not a valid CSV file.`,
        ),
        false,
      ],
    };
    const args = file.mimetype === 'text/csv' ? argsMap.ok : argsMap.error;

    return cb.apply(this, args);
  },
});
