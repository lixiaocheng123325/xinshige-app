import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { Note } from '../../entities/note.entity';
import { NotePurchase } from '../../entities/note-purchase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Note, NotePurchase])],
  providers: [NoteService],
  controllers: [NoteController],
  exports: [NoteService],
})
export class NoteModule {}
