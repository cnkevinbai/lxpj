/**
 * 流式响应控制器 - SSE 端点
 */

import { Controller, Post, Req, Res, Body, Query } from '@nestjs/common';
import { Request, Response } from 'express';
import { StreamService } from '../services/stream.service';
import { Public } from '../api/auth/decorators/public.decorator';

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  /**
   * AI 流式响应端点
   * POST /api/stream/ai
   */
  @Post('ai')
  @Public()
  async streamAI(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: { prompt: string; agentId?: string; sessionId?: string; tools?: any[] },
    @Query('mode') mode?: 'simulate' | 'real'
  ): Promise<void> {
    const { prompt, agentId = 'main', sessionId, tools } = body;

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    // 创建 SSE 流
    this.streamService.createStream(res);

    // 调用真实 AI API (通过 OpenClaw Gateway)
    if (mode === 'simulate') {
      await this.streamService.simulateAIStream(res, prompt, { agentId });
    } else {
      await this.streamService.streamAI(res, prompt, { agentId, sessionId, tools });
    }

    // 结束响应
    res.end();
  }

  /**
   * 文本流式端点
   * POST /api/stream/text
   */
  @Post('text')
  @Public()
  async streamText(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: { content: string; agentId?: string; chunkSize?: number; delay?: number },
  ): Promise<void> {
    const { content, agentId = 'main', chunkSize = 5, delay = 30 } = body;

    if (!content) {
      res.status(400).json({ error: 'Content is required' });
      return;
    }

    // 创建 SSE 流
    this.streamService.createStream(res);

    // 流式发送
    await this.streamService.streamText(res, content, { agentId, chunkSize, delay });

    // 结束响应
    res.end();
  }

  /**
   * SSE 连接测试端点
   * GET /api/stream/test
   */
  @Post('test')
  @Public()
  async testStream(@Req() req: Request, @Res() res: Response): Promise<void> {
    this.streamService.createStream(res);

    // 发送测试事件
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      this.streamService.sendEvent(res, 'test', { 
        message: `Test message ${i + 1}`,
        index: i,
      });
    }

    this.streamService.sendEvent(res, 'complete', { message: 'Test completed' });
    res.end();
  }
}

export default StreamController;