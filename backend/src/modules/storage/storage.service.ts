import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  constructor(private configService: ConfigService) {}

  buildUrl(filename: string): string {
    const backendUrl = this.configService.get<string>('BACKEND_URL', 'http://localhost:3000');
    return `${backendUrl}/uploads/${filename}`;
  }
}
