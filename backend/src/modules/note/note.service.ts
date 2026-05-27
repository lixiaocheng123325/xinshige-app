import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note, NoteVisibility } from '../../entities/note.entity';
import { NotePurchase } from '../../entities/note-purchase.entity';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private noteRepo: Repository<Note>,
    @InjectRepository(NotePurchase)
    private purchaseRepo: Repository<NotePurchase>,
  ) {}

  async create(userId: string, dto: CreateNoteDto) {
    const note = this.noteRepo.create({
      ...dto,
      authorId: userId,
    });
    return this.noteRepo.save(note);
  }

  async findAll(userId?: string, mine?: boolean, page = 1, limit = 20) {
    const query = this.noteRepo.createQueryBuilder('note')
      .leftJoinAndSelect('note.author', 'author')
      .orderBy('note.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (mine) {
      if (userId) {
        query.where('note.authorId = :userId', { userId });
      } else {
        query.where('1 = 0');
      }
    } else {
      query.where('note.visibility IN (:...visibilities)', {
        visibilities: [NoteVisibility.PUBLIC, NoteVisibility.PAID],
      });
      query.andWhere('note.isActive = true');
    }

    const [items, total] = await query.getManyAndCount();
    return { items, total, page, limit };
  }

  async findOne(id: string, userId?: string) {
    const note = await this.noteRepo.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!note) {
      throw new NotFoundException('笔记不存在');
    }

    const isAuthor = note.authorId === userId;

    if (note.visibility === NoteVisibility.PRIVATE && !isAuthor) {
      throw new ForbiddenException('无权查看该笔记');
    }

    const result: any = {
      id: note.id,
      title: note.title,
      visibility: note.visibility,
      price: note.price,
      author: {
        id: note.author.id,
        nickname: note.author.nickname,
        avatar: note.author.avatar,
      },
      createdAt: note.createdAt,
    };

    if (note.visibility === NoteVisibility.PAID && !isAuthor) {
      const purchase = userId ? await this.purchaseRepo.findOne({
        where: { userId, noteId: id },
      }) : null;

      if (purchase) {
        result.content = note.content;
        result.isPurchased = true;
      } else {
        result.summary = note.content.substring(0, 100) + (note.content.length > 100 ? '...' : '');
        result.isPurchased = false;
      }
    } else {
      result.content = note.content;
      result.isPurchased = true;
    }

    return result;
  }

  async update(id: string, userId: string, dto: Partial<CreateNoteDto>) {
    const note = await this.noteRepo.findOne({ where: { id } });
    if (!note || note.authorId !== userId) {
      throw new ForbiddenException('无权编辑该笔记');
    }
    await this.noteRepo.update(id, dto);
    return this.noteRepo.findOne({ where: { id } });
  }

  async remove(id: string, userId: string) {
    const note = await this.noteRepo.findOne({ where: { id } });
    if (!note || note.authorId !== userId) {
      throw new ForbiddenException('无权删除该笔记');
    }
    await this.noteRepo.update(id, { isActive: false });
    return { message: '删除成功' };
  }
}
