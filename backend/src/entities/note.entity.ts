import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { NotePurchase } from './note-purchase.entity';

export enum NoteVisibility {
  PRIVATE = 'private',
  PUBLIC = 'public',
  PAID = 'paid',
}

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'public',
  })
  visibility: NoteVisibility;

  @Column({ type: 'int', default: 0 })
  price: number;

  @Column()
  authorId: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.notes)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @OneToMany(() => NotePurchase, (purchase) => purchase.note)
  purchases: NotePurchase[];
}
