import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Comment } from './comment.schema'
import { CreateCommentDto } from './comment.Dto'
import { DatabaseService } from '../database/database.service'
import { Post } from '../post/post.schema'
import { ObjectId } from 'mongodb'
import ResponseMessages from '../utils/response-messages'
import { Console } from 'console'

@Injectable()
export class CommentService {
  dbService: DatabaseService<Comment | Post>

  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) { this.dbService = new DatabaseService<Comment>(this.commentModel) }

  async addComment(userId: string, postId: any, createCommentDto: CreateCommentDto): Promise<Object> {
    try {
      const find_post = await this.postModel.find({ _id: postId })
      // CHECK IF POST EXISTS
      console.log(find_post)
      if (find_post.length === 0) {
        throw new NotFoundException({message: ResponseMessages.ResourceNotFound})
      }
      const newComment = await this.dbService.create(
        {
          userId: new ObjectId(userId), 
          postId: new ObjectId(postId), 
          ...createCommentDto
        })
        // UPDATE POST REPLY COUNT
      await this.postModel.findByIdAndUpdate(postId, { $inc: { replycount: 1 } }).exec()
      return newComment.save()
      }
    catch(err: any) {
      throw new BadRequestException({message: err.message})
    }
    
  }

  // GET COMMENT ON A POST IN ASCENDING OTHER (lATEST ONES FIRST)
  async getCommentsByPost(postId: string): Promise<Comment[]> {
    try {
      return await this.commentModel.find({ postId })
      .populate('userId', 'username user_image')
      .select('-_id -__v -postId -updatedAt')
      .sort({ createdAt: 1 })
      .exec()
    }
    catch(err: any) {
      throw new BadRequestException({message: err.message})
    }
  }

  async upvoteComment(id: string): Promise<Comment> {
    return await this.dbService.upvotePost(id)
  }

  async downvoteComment(id: string): Promise<Comment> {
    return await this.dbService.downvotePost(id)
  }
}

