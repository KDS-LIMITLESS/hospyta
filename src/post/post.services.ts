import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel, Schema } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../user/user.schema";
import { Post } from "./post.schema";
import { CreatePostDto, UpdatePostDto } from "./post.dto";
import { DatabaseService } from "src/database/database.service";
import { ObjectId } from "mongodb";
import ResponseMessages from "../utils/response-messages";

@Injectable()
export class PostService {

  dbService: DatabaseService<Post>
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {
    this.dbService = new DatabaseService<Post>(this.postModel)
  }

  async createPost(post: CreatePostDto, userId: string): Promise<Post> {
    try {
      let new_post = await this.dbService.create({userId: new ObjectId(userId), ...post})
      return new_post
    }
    catch(err: any) {
      throw new BadRequestException({message: err.message})
    }
  }

  async deleteUserPost(userId: string, postId: string) {
    try {
      let find_post = await this.dbService.findDocumentById(postId) 
    
      // CHECK IF POST IN DATABASE
      if (!find_post) {
        throw new NotFoundException({message: ResponseMessages.ResourceNotFound})
      }
        // CHECK IF POST AUTHOR IS CURRENT USER
      if (find_post.userId.toString() !== userId) {
        throw new ForbiddenException({message: ResponseMessages.Request_Forbidden})
      }
      return this.dbService.findAndDeleteDocumentById(postId)
    }
    catch(err: any) {
      throw new BadRequestException({message: err.message})
    }
  }

  async editUserPost(userId: string, postId: string, updatePostData: UpdatePostDto) {
    try {
      let find_post = await this.dbService.findDocumentById(postId) 
    
      // CHECK IF POST IN DATABASE
      if (!find_post) {
        throw new NotFoundException({message: ResponseMessages.ResourceNotFound})
      }
        // CHECK IF POST AUTHOR IS CURRENT USER
      if (find_post.userId.toString() !== userId) {

        throw new ForbiddenException({message: ResponseMessages.Request_Forbidden})
      }
      // COPY NEW FIELDS TO THE EISTING ONE AND SAVE
      Object.assign(find_post, updatePostData)
      return find_post.save()
    }
    catch(err: any) {
      throw new BadRequestException({message: err.message})
    }
    
  }

  async getPosts(): Promise<any> {
    try {
      return this.postModel.find()
      .populate('userId', 'username user_image' )
      .select('-__v')
      .exec()
    }
    catch(err: any) {
      throw new BadRequestException({message: err.message})
    }
  }

  async upvotePost(id: string): Promise<Post> {
    try {
      return this.postModel.findByIdAndUpdate(id, { $inc: { upvotes: 1 } }, { new: true }).exec();
    }
    catch(err: any) {
      throw new BadRequestException({message: err.message})
    }

  }

  async downvotePost(id: string): Promise<Post> {
    try {
      return this.postModel.findByIdAndUpdate(id, { $inc: { downvotes: 1 } }, { new: true }).exec();
    }
    catch(err: any) {
      throw new BadRequestException({message: err.message})
    }
  }
}