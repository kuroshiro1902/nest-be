import { Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { TagService } from '../service/tag.service';
import { ZodBody, ZodQuery } from '@/modules/common/decorators';
import { CreateTagDto } from '../dto/create-tag.dto';
import { Request } from 'express';
import { SearchTagDto } from '../dto/search-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthTokenGuard } from '@/modules/auth/guard/auth-token.guard';

@Controller('tag')
@UseGuards(AuthTokenGuard)
@ApiTags('Tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tag' })
  async createOne(@Req() req: Request, @ZodBody(CreateTagDto) createTagDto: CreateTagDto) {
    return this.tagService.createOne({ ...createTagDto, userId: req.user.id });
  }

  @Get('search')
  @ApiOperation({ summary: 'Search tags' })
  async search(@Req() req: Request, @ZodQuery(SearchTagDto) searchTagDto: SearchTagDto) {
    return this.tagService.search(req.user.id, searchTagDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tag by ID' })
  async getOne(@Req() req: Request, @Param('id') id: string) {
    return this.tagService.findOneOrThrow({ where: { userId: req.user.id, id } });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tag' })
  async updateOne(@Req() req: Request, @Param('id') id: string, @ZodBody(UpdateTagDto) updateTagInput: UpdateTagDto) {
    return this.tagService.updateOne(req.user.id, id, updateTagInput);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tag' })
  async deleteOne(@Req() req: Request, @Param('id') id: string) {
    return this.tagService.deleteOne(req.user.id, id);
  }
}
