/**
 * 文件上传服务
 */
import { Injectable, BadRequestException, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name)
  private readonly uploadDir: string

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR') || './uploads'
    this.ensureUploadDir()
  }

  private ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true })
    }
  }

  async uploadFile(file: Express.Multer.File, subDir?: string): Promise<{ url: string; filename: string }> {
    if (!file) throw new BadRequestException('请选择要上传的文件')
    const maxSize = this.configService.get<number>('MAX_FILE_SIZE') || 10 * 1024 * 1024
    if (file.size > maxSize) throw new BadRequestException('文件大小超过限制')

    const ext = path.extname(file.originalname)
    const filename = `${Date.now()}${Math.random().toString(36).substring(2, 8)}${ext}`
    const targetDir = subDir ? path.join(this.uploadDir, subDir) : this.uploadDir
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })

    fs.writeFileSync(path.join(targetDir, filename), file.buffer)
    const url = subDir ? `/uploads/${subDir}/${filename}` : `/uploads/${filename}`
    return { url, filename }
  }
}