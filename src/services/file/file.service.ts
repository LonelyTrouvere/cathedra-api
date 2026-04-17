import { Injectable } from '@nestjs/common';
import fs from 'fs';
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

  public async getFile(path: string): Promise<string | Buffer> {
    const readFile = promisify(fs.readFile);

    return await readFile(path, 'utf8');
  }
}
