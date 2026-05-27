import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';

@ApiTags('笔记')
@Controller('notes')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @Post()
  @ApiOperation({ summary: '发布笔记' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() dto: CreateNoteDto) {
    return this.noteService.create(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '笔记列表' })
  findAll(
    @Request() req,
    @Query('mine') mine: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.noteService.findAll(
      req.user?.userId,
      mine === '1',
      parseInt(page || '1', 10),
      parseInt(limit || '20', 10),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: '笔记详情' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.noteService.findOne(id, req.user?.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: '编辑笔记' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(@Request() req, @Param('id') id: string, @Body() dto: Partial<CreateNoteDto>) {
    return this.noteService.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除笔记' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Request() req, @Param('id') id: string) {
    return this.noteService.remove(id, req.user.userId);
  }
}
