import { AuthTokenGuard } from '@/modules/auth/guard/auth-token.guard';
import { NotebookService } from '../service/notebook.service';
import { Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CreateNotebookDto } from '../dto/create-notebook.dto';
import { Request } from 'express';
import { ZodBody, ZodQuery } from '@/modules/common/decorators';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchNotebookDto } from '../dto/search-notebook.dto';
import { UpdateNoteBookDto } from '../dto/update-notebook.dto';

@Controller('notebook')
@UseGuards(AuthTokenGuard)
@ApiTags('Notebook')
export class NotebookController {
  constructor(private readonly notebookService: NotebookService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notebook' })
  async createOne(@Req() req: Request, @ZodBody(CreateNotebookDto) createNotebookInput: CreateNotebookDto) {
    return this.notebookService.createOne(req.user.id, createNotebookInput);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search notebooks' })
  async search(@Req() req: Request, @ZodQuery(SearchNotebookDto) searchNotebookInput: SearchNotebookDto) {
    return this.notebookService.search(req.user.id, searchNotebookInput);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a notebook by id' })
  async getOne(@Req() req: Request, @Param('id') id: string) {
    return this.notebookService.findOneOrThrow({ where: { userId: req.user.id, id } });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a notebook' })
  async updateOne(
    @Req() req: Request,
    @Param('id') id: string,
    @ZodBody(UpdateNoteBookDto) updateNotebookInput: UpdateNoteBookDto,
  ) {
    return this.notebookService.updateOne(req.user.id, id, updateNotebookInput);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notebook' })
  async deleteOne(@Req() req: Request, @Param('id') id: string) {
    return this.notebookService.deleteOne(req.user.id, id);
  }
}
