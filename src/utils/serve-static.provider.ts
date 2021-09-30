import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

export class ServeStaticProvider {
  static folderName = '/public';
  static publicPath = join(process.cwd(), ServeStaticProvider.folderName);
  static provider = ServeStaticModule.forRoot({
    rootPath: ServeStaticProvider.publicPath,
    serveRoot: ServeStaticProvider.folderName,
  });
}
