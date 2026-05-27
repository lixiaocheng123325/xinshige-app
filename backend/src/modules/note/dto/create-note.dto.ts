import { IsString, IsEnum, IsInt, Min, Max, IsOptional } from 'class-validator';
import { NoteVisibility } from '../../../entities/note.entity';

export class CreateNoteDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum(NoteVisibility)
  visibility: NoteVisibility;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100000)
  price?: number;
}
