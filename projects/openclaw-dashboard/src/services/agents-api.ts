import { post, get } from '../config/api-client';

// Agent types
export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'offline' | 'busy';
  avatar: string;
  description?: string;
  skills?: string[];
}

export interface AgentSwitchRequest {
  agentId: string;
}

export interface AgentSwitchResponse {
  success: boolean;
  agentId: string;
  previousAgentId?: string;
}

export interface AgentListResponse {
  success: boolean;
  agents: Agent[];
  total: number;
}

class AgentsService {
  private basePath = '/agents';

  // Get all agents
  async getAgents(): Promise<Agent[]> {
    try {
      const response = await get<AgentListResponse>(this.basePath);
      return response.agents;
    } catch (error: any) {
      console.error('Failed to get agents:', error);
      throw error;
    }
  }

  // Switch active agent
  async switchAgent(agentId: string): Promise<AgentSwitchResponse> {
    try {
      const response = await post<AgentSwitchResponse>(
        `${this.basePath}/switch`,
        { agentId }
      );
      return response;
    } catch (error: any) {
      console.error('Failed to switch agent:', error);
      throw error;
    }
  }

  // Get agent by ID
  async getAgent(agentId: string): Promise<Agent> {
    try {
      const agents = await this.getAgents();
      return agents.find((a) => a.id === agentId) || agents[0];
    } catch (error: any) {
      console.error('Failed to get agent:', error);
      throw error;
    }
  }
}

export const agentsService = new AgentsService();
