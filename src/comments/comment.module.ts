import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentController } from './comment.controllers';
import { CommentService } from './comment.services';
import { Comment, CommentSchema } from './comment.schema';
import { PostSchema, Post } from 'src/post/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Post.name, schema: PostSchema }
    ])
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}