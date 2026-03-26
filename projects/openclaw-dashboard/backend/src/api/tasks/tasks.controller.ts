import { Controller, Get, Post, Body, Patch, Delete, Query, Param } from '@nestjs/common';
import { TasksService, Task } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getTasks(@Query() query?: TaskQueryDto) {
    return this.tasksService.findAll(query);
  }

  @Get('stats')
  async getStats() {
    return this.tasksService.getStats();
  }

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get(':id')
  async getTask(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  async updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }

  @Post(':id/complete')
  async completeTask(@Param('id') id: string) {
    return this.tasksService.complete(id);
  }
}
