import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { AdminUser } from './admin-user.entity';

export enum WithdrawalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('withdrawals')
export class Withdrawal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ type: 'int' })
  amount: number;

  @Column({ length: 50 })
  accountName: string;

  @Column({ length: 100 })
  accountNumber: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: WithdrawalStatus;

  @Column({ nullable: true })
  adminId: string;

  @Column({ length: 500, nullable: true })
  remark: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.withdrawals)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => AdminUser, (admin) => admin.withdrawals)
  @JoinColumn({ name: 'adminId' })
  admin: AdminUser;
}
