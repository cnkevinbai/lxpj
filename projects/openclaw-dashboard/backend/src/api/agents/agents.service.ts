import { Injectable } from '@nestjs/common';
import { OpenClawService } from '../../cli/openclaw.service';

@Injectable()
export class AgentsService {
  constructor(private readonly openClawService: OpenClawService) {}

  async getAgentList() {
    const result = await this.openClawService.execute('openclaw agents list --json');
    if (!result.stdout || result.stdout.trim() === '') {
      return [];
    }
    return JSON.parse(result.stdout);
  }

  async switchAgent(agentId: string) {
    const result = await this.openClawService.execute(`openclaw agent switch ${agentId}`);
    return { success: true, agentId };
  }
}
