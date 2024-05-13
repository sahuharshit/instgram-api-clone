// src/media/media.entity.ts

import { Post } from 'src/posts/entities/post.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  postId: number;

  @ManyToOne(() => Post, (post) => post.media)
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column()
  url: string;

  @Column()
  mediaType: string; // 'image' or 'video'

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
