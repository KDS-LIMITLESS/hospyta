import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Comment } from './comment.schema'
import { CreateCommentDto } from './comment.Dto'
import { DatabaseService } from '../database/database.service'
import { Post } from '../post/post.schema'
import { ObjectId } from 'mongodb'
import ResponseMessages from 'src/utils/response-messages'

@Injectable()
export class CommentService {
  dbService: DatabaseService<Comment | Post>

  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) { this.dbService = new DatabaseService<Comment>(this.commentModel) }

  async addComment(userId: string, postId: string, createCommentDto: CreateCommentDto): Promise<Comment> {
    try {
      const find_post = await this.postModel.find({ postId })
      if (!find_post) {
        throw new NotFoundException({message: ResponseMessages.ResourceNotFound})
      }
      const newComment = await this.dbService.create(
        {
          userId: new ObjectId(userId), 
          postId: new ObjectId(postId), 
          ...createCommentDto
        })
      return newComment.save()
      }
    catch(err: any) {
      throw new BadRequestException({message: err.message})
    }
    
  }

  async getCommentsByPost(postId: string): Promise<Comment[]> {
    try {
      return await this.commentModel.find({ postId })
      .populate('userId', 'username')
      .exec()
    }
    catch(err: any) {
      throw new BadRequestException({message: err.message})
    }
    
  }
}

