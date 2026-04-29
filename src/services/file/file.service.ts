import { Injectable } from '@nestjs/common';
import fs, { createReadStream, ReadStream } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

@Injectable()
export class FileService {
  constructor() {}

  private async checkIfFileOrDirectoryExists(path: string): Promise<boolean> {
    const exists = promisify(fs.exists);
    return await exists(path);
  }

  public async createFile(
    path: string,
    file: Express.Multer.File,
  ): Promise<void> {
    if (!(await this.checkIfFileOrDirectoryExists(path))) {
      const mkdir = promisify(fs.mkdir);
      await mkdir(path, { recursive: true });
    }

    const writeFile = promisify(fs.writeFile);
    await writeFile(`${path}/${file.filename}`, file.buffer, 'utf8');
  }

  public getFile(path: string): ReadStream {
    return createReadStream(join(process.cwd(), path));
  }

  public async deleteFile(path: string): Promise<void> {
    if (!path.includes('uploads')) {
      return;
    }

    const unlink = promisify(fs.unlink);
    await unlink(path);
  }
}
