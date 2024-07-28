import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel, Schema } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../user/user.schema";
import { Post } from "./post.schema";
import { CreatePostDto, PostIdDto, UpdatePostDto } from "./post.dto";
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
      let  {__v, time, ...post_details} = new_post._doc
      return post_details
    }
    catch(err: any) {
      throw new BadRequestException({message: err.message})
    }
  }

  async deleteUserPost(userId: string, postId: any) {
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

  // GET POSTS IN ASCENDINT OTHER 
  // THIS ENDPOINT IS NOT ATHENTICATED ANYONE CAN VIEW THIS ENDPOINT WITHOUT REGISTERING ON THE APPLICATION
  async getPosts(): Promise<any> {
    try {
      // include the post authors image and username in the post document
      return this.postModel.find()
      .populate('userId', 'user_image username' )
      .select('-__v -time')
      .sort({ createdAt: 1 })
      .exec()
    }
    catch(err: any) {
      throw new BadRequestException({message: err.message})
    }
  }

  async upvotePost(id: string): Promise<Post> {
    await this.postModel.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).exec()
    return await this.dbService.upvotePost(id)
  }

  async downvotePost(id: string): Promise<Post> {
    await this.postModel.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).exec()
    return await this.dbService.downvotePost(id)
  }

  async sortPostsByUpvotes(): Promise<Post[]> {
    return this.postModel.find()
    .sort({ upvotes: -1 })
    .select('-__v -time')
    .exec();
  }

  async getPostsByCategory(category: string): Promise<Post[]> {
    return this.postModel.find({ category })
    .sort({ upvotes: -1 })
    .exec();
  }
}