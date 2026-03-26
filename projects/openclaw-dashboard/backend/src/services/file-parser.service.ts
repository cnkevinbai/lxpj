import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as mammoth from 'mammoth';
import sharp from 'sharp';
import { JSDOM } from 'jsdom';
import * as cheerio from 'cheerio';
import { PDFDocument } from 'pdf-lib';

// 动态导入 pdf-parse
const loadPdfParse = async () => {
  const mod = await import('pdf-parse');
  return mod.default || mod;
};

@Injectable()
export class FileParserService {
  private readonly logger = new Logger(FileParserService.name);
  private pdfParseModule: any;

  constructor() {
    this.loadPdfParseModule();
  }

  private async loadPdfParseModule() {
    this.pdfParseModule = await loadPdfParse();
  }

  /**
   * 解析 PDF 文件
   */
  async parsePDF(buffer: Buffer): Promise<{
    text: string;
    pages: number;
    metadata: any;
  }> {
    try {
      const data = await this.pdfParseModule(buffer);
      
      return {
        text: data.text,
        pages: data.info.Pages || 1,
        metadata: data.info || {},
      };
    } catch (error) {
      this.logger.error('Failed to parse PDF:', (error as Error).message);
      throw new BadRequestException('Failed to parse PDF file');
    }
  }

  /**
   * 解析 Word 文档 (.docx)
   */
  async parseDocx(buffer: Buffer): Promise<{
    text: string;
    paragraphs: string[];
  }> {
    try {
      const result = await mammoth.extractRawText({ buffer });
      
      const paragraphs = result.value
        .split('\n')
        .map(p => p.trim())
        .filter(p => p.length > 0);

      return {
        text: result.value,
        paragraphs,
      };
    } catch (error) {
      this.logger.error('Failed to parse DOCX:', (error as Error).message);
      throw new BadRequestException('Failed to parse Word document');
    }
  }

  /**
   * 解析旧版 Word 文档 (.doc)
   */
  async parseDoc(buffer: Buffer): Promise<{
    text: string;
    paragraphs: string[];
  }> {
    try {
      // For .doc files, we can try to extract text using various methods
      // This is a simplified implementation
      const text = buffer.toString('latin1').replace(/[^\x20-\x7E]/g, '');
      const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

      return {
        text,
        paragraphs,
      };
    } catch (error) {
      this.logger.error('Failed to parse DOC:', (error as Error).message);
      throw new BadRequestException('Failed to parse Word document');
    }
  }

  /**
   * 分析图片
   */
  async analyzeImage(
    buffer: Buffer,
    mimeType: string,
  ): Promise<{
    width: number;
    height: number;
    format: string;
    metadata: any;
    thumbnail?: string;
  }> {
    try {
      const metadata = await sharp(buffer).metadata();
      
      // Generate thumbnail (max 200x200)
      const thumbnailBuffer = await sharp(buffer)
        .resize({
          width: 200,
          height: 200,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toBuffer();
      
      const thumbnail = `data:${mimeType};base64,${thumbnailBuffer.toString('base64')}`;

      return {
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || 'unknown',
        metadata: {
          ...metadata,
          mimeType,
          size: buffer.length,
        },
        thumbnail,
      };
    } catch (error) {
      this.logger.error('Failed to analyze image:', (error as Error).message);
      throw new BadRequestException('Failed to analyze image');
    }
  }

  /**
   * 解析 HTML 文件
   */
  async parseHTML(buffer: Buffer): Promise<{
    title: string;
    text: string;
    links: string[];
    images: string[];
  }> {
    try {
      const html = buffer.toString('utf-8');
      const dom = new JSDOM(html);
      const document = dom.window.document;
      
      // Extract title
      const titleElement = document.querySelector('title');
      const title = titleElement ? titleElement.textContent?.trim() || '' : '';

      // Extract text content
      const body = document.querySelector('body');
      const text = body ? body.textContent?.replace(/\s+/g, ' ').trim() || '' : '';

      // Extract links
      const links: string[] = [];
      const linkElements = document.querySelectorAll('a[href]');
      linkElements.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
          links.push(href);
        }
      });

      // Extract images
      const images: string[] = [];
      const imgElements = document.querySelectorAll('img[src]');
      imgElements.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
          images.push(src);
        }
      });

      return {
        title,
        text,
        links,
        images,
      };
    } catch (error) {
      this.logger.error('Failed to parse HTML:', (error as Error).message);
      throw new BadRequestException('Failed to parse HTML file');
    }
  }

  /**
   * 解析纯文本文件
   */
  async parseText(buffer: Buffer, mimeType: string): Promise<{
    text: string;
    lines: number;
    words: number;
  }> {
    try {
      const content = buffer.toString('utf-8');
      const lines = content.split('\n').length;
      const words = content.trim().split(/\s+/).length;

      return {
        text: content,
        lines,
        words,
      };
    } catch (error) {
      this.logger.error('Failed to parse text:', (error as Error).message);
      throw new BadRequestException('Failed to parse text file');
    }
  }

  /**
   * 解析 Markdown 文件
   */
  async parseMarkdown(buffer: Buffer): Promise<{
    text: string;
    html: string;
    headings: { level: number; text: string }[];
  }> {
    try {
      const content = buffer.toString('utf-8');
      
      // Extract headings
      const headings: { level: number; text: string }[] = [];
      const headingRegex = /^(#{1,6})\s+(.+)$/gm;
      let match;
      while ((match = headingRegex.exec(content)) !== null) {
        headings.push({
          level: match[1].length,
          text: match[2].trim(),
        });
      }

      return {
        text: content,
        html: '', // Could use marked library to convert to HTML
        headings,
      };
    } catch (error) {
      this.logger.error('Failed to parse markdown:', (error as Error).message);
      throw new BadRequestException('Failed to parse markdown file');
    }
  }

  /**
   * 根据 MIME 类型自动选择解析器
   */
  async parseFileByType(
    buffer: Buffer,
    mimeType: string,
  ): Promise<any> {
    switch (mimeType) {
      case 'application/pdf':
        return this.parsePDF(buffer);
      
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return this.parseDocx(buffer);
      
      case 'application/msword':
        return this.parseDoc(buffer);
      
      case 'text/html':
        return this.parseHTML(buffer);
      
      case 'text/plain':
      case 'text/markdown':
      case 'text/x-python':
      case 'text/javascript':
      case 'text/typescript':
        return this.parseText(buffer, mimeType);
      
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
      case 'image/svg+xml':
      case 'image/webp':
        return this.analyzeImage(buffer, mimeType);
      
      default:
        this.logger.warn(`Unknown file type: ${mimeType}, attempting text parse`);
        return this.parseText(buffer, mimeType);
    }
  }

  /**
   * 生成 PDF 预览
   */
  async generatePDFPreview(
    buffer: Buffer,
    pageNumbers: number[] = [0],
  ): Promise<{ dataUrl: string }[]> {
    try {
      const doc = await PDFDocument.load(buffer);
      const pages: { dataUrl: string }[] = [];
      
      for (const pageNum of pageNumbers) {
        if (pageNum < 0 || pageNum >= doc.getPageCount()) {
          continue;
        }
        
        const newDoc = await PDFDocument.create();
        const [page] = await newDoc.copyPages(doc, [pageNum]);
        newDoc.addPage(page);
        
        const pdfBytes = await newDoc.save();
        const dataUrl = `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;
        
        pages.push({ dataUrl });
      }
      
      return pages;
    } catch (error) {
      this.logger.error('Failed to generate PDF preview:', (error as Error).message);
      return [];
    }
  }
}
