/**
 * 文档解析器
 * 支持 PDF, DOCX, HTML, MD, TXT 格式
 */

import { Logger } from '@nestjs/common';
import * as fs from 'fs/promises';

export interface ParseResult {
  content: string;
  metadata: {
    pageCount?: number;
    wordCount: number;
    charCount: number;
    title?: string;
    author?: string;
  };
}

export class DocumentParser {
  private readonly logger = new Logger(DocumentParser.name);

  async parse(filePath: string, mimeType: string): Promise<ParseResult> {
    switch (mimeType) {
      case 'application/pdf':
        return this.parsePDF(filePath);
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword':
        return this.parseWord(filePath);
      case 'text/html':
        return this.parseHTML(filePath);
      case 'text/markdown':
      case 'text/x-markdown':
        return this.parseMarkdown(filePath);
      case 'text/plain':
      default:
        return this.parseText(filePath);
    }
  }

  private async parsePDF(filePath: string): Promise<ParseResult> {
    try {
      // 使用 pdf-parse 解析 PDF
      const pdfParse = require('pdf-parse');
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer);
      
      return {
        content: data.text,
        metadata: {
          pageCount: data.numpages,
          wordCount: this.countWords(data.text),
          charCount: data.text.length,
        },
      };
    } catch (error: any) {
      this.logger.error('PDF parsing failed:', error?.message || 'Unknown error');
      throw new Error(`PDF 解析失败: ${error?.message || 'Unknown error'}`);
    }
  }

  private async parseWord(filePath: string): Promise<ParseResult> {
    try {
      // 使用 mammoth 解析 Word
      const mammoth = require('mammoth');
      const result = await mammoth.extractRawText({ path: filePath });
      
      return {
        content: result.value,
        metadata: {
          wordCount: this.countWords(result.value),
          charCount: result.value.length,
        },
      };
    } catch (error: any) {
      this.logger.error('Word parsing failed:', error?.message || 'Unknown error');
      throw new Error(`Word 解析失败: ${error?.message || 'Unknown error'}`);
    }
  }

  private async parseHTML(filePath: string): Promise<ParseResult> {
    try {
      const html = await fs.readFile(filePath, 'utf-8');
      
      // 简单提取文本 (移除 HTML 标签)
      const text = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      // 提取标题
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : undefined;
      
      return {
        content: text,
        metadata: {
          wordCount: this.countWords(text),
          charCount: text.length,
          title,
        },
      };
    } catch (error: any) {
      this.logger.error('HTML parsing failed:', error?.message || 'Unknown error');
      throw new Error(`HTML 解析失败: ${error?.message || 'Unknown error'}`);
    }
  }

  private async parseMarkdown(filePath: string): Promise<ParseResult> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      
      // 提取标题
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : undefined;
      
      return {
        content,
        metadata: {
          wordCount: this.countWords(content),
          charCount: content.length,
          title,
        },
      };
    } catch (error: any) {
      this.logger.error('Markdown parsing failed:', error?.message || 'Unknown error');
      throw new Error(`Markdown 解析失败: ${error?.message || 'Unknown error'}`);
    }
  }

  private async parseText(filePath: string): Promise<ParseResult> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      
      return {
        content,
        metadata: {
          wordCount: this.countWords(content),
          charCount: content.length,
        },
      };
    } catch (error: any) {
      this.logger.error('Text parsing failed:', error?.message || 'Unknown error');
      throw new Error(`文本解析失败: ${error?.message || 'Unknown error'}`);
    }
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
  }
}

// 文本分块器
export class TextChunker {
  private readonly logger = new Logger(TextChunker.name);

  chunk(
    text: string,
    options: {
      strategy: 'paragraph' | 'sentence' | 'fixed';
      chunkSize?: number;
      overlap?: number;
    },
  ): Array<{ index: number; content: string; tokenCount: number }> {
    switch (options.strategy) {
      case 'paragraph':
        return this.chunkByParagraph(text);
      case 'sentence':
        return this.chunkBySentence(text, options.chunkSize || 500);
      case 'fixed':
      default:
        return this.chunkBySize(text, options.chunkSize || 500, options.overlap || 50);
    }
  }

  private chunkByParagraph(text: string): Array<{ index: number; content: string; tokenCount: number }> {
    const paragraphs = text.split(/\n\n+/).filter(Boolean);
    
    return paragraphs.map((p, i) => ({
      index: i,
      content: p.trim(),
      tokenCount: this.estimateTokens(p),
    }));
  }

  private chunkBySentence(text: string, maxTokens: number): Array<{ index: number; content: string; tokenCount: number }> {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: Array<{ index: number; content: string; tokenCount: number }> = [];
    
    let currentChunk = '';
    let currentTokens = 0;
    let chunkIndex = 0;
    
    for (const sentence of sentences) {
      const sentenceTokens = this.estimateTokens(sentence);
      
      if (currentTokens + sentenceTokens > maxTokens && currentChunk) {
        chunks.push({
          index: chunkIndex++,
          content: currentChunk.trim(),
          tokenCount: currentTokens,
        });
        currentChunk = '';
        currentTokens = 0;
      }
      
      currentChunk += sentence + ' ';
      currentTokens += sentenceTokens;
    }
    
    if (currentChunk.trim()) {
      chunks.push({
        index: chunkIndex,
        content: currentChunk.trim(),
        tokenCount: currentTokens,
      });
    }
    
    return chunks;
  }

  private chunkBySize(
    text: string,
    chunkSize: number,
    overlap: number,
  ): Array<{ index: number; content: string; tokenCount: number }> {
    const chunks: Array<{ index: number; content: string; tokenCount: number }> = [];
    const words = text.split(/\s+/);
    
    for (let i = 0; i < words.length; i += chunkSize - overlap) {
      const chunkWords = words.slice(i, i + chunkSize);
      const content = chunkWords.join(' ');
      
      chunks.push({
        index: chunks.length,
        content,
        tokenCount: this.estimateTokens(content),
      });
    }
    
    return chunks;
  }

  private estimateTokens(text: string): number {
    // 简单估算：英文单词 * 1.3，中文 * 2
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
    const otherChars = text.length - chineseChars - englishWords;
    
    return Math.ceil(chineseChars * 2 + englishWords * 1.3 + otherChars * 0.5);
  }
}

export const documentParser = new DocumentParser();
export const textChunker = new TextChunker();