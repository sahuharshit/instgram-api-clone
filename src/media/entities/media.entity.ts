import { Post } from 'src/posts/entities/post.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  postId: number;

  @ManyToOne(() => Post, (post) => post.media, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column()
  url: string;

  @Column({
    type: 'enum',
    enum: MediaType,
  })
  mediaType: MediaType;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
