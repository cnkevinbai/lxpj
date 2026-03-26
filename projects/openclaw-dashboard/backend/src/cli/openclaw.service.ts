import { Injectable } from '@nestjs/common';

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

@Injectable()
export class OpenClawService {
  private readonly allowedCommands = [
    'openclaw chat',
    'openclaw chat send',
    'openclaw session list',
    'openclaw session show',
    'openclaw session delete',
    'openclaw agent list',
    'openclaw agent switch',
    'openclaw system status',
    'openclaw system restart',
    'openclaw system logs',
    'openclaw system diagnose',
    'openclaw task list',
    'openclaw task create',
    'openclaw task update',
    'openclaw task delete',
    'openclaw file list',
    'openclaw file delete',
    'openclaw file upload',
    'openclaw file download',
  ];

  private sanitizeCommand(command: string): boolean {
    return this.allowedCommands.some(allowed => 
      command.trim().startsWith(allowed)
    );
  }

  async execute(command: string): Promise<CommandResult> {
    const { exec } = require('child_process');
    
    return new Promise((resolve) => {
      if (!this.sanitizeCommand(command)) {
        resolve({
          stdout: '',
          stderr: 'Command not allowed',
          exitCode: 1,
        });
        return;
      }

      exec(command, (error: Error, stdout: string, stderr: string) => {
        resolve({
          stdout,
          stderr,
          exitCode: error ? 1 : 0,
        });
      });
    });
  }
}
