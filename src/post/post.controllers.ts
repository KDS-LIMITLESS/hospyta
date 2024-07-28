import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put, Query, Req, Res } from "@nestjs/common"
import { PostService } from "./post.services"
import { CreatePostDto, PostIdDto, UpdatePostDto } from "./post.dto"
import { SkipAuth } from "../auth/jwt.strategy"

@Controller('api.hospyta/v1/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  async createPost(@Res() res, @Body() payload: CreatePostDto, @Req()req) {
    return res.status(HttpStatus.OK).json(await this.postService.createPost(payload, req.user.userId))
  }

  @Delete('own/delete/') 
  async deleteOwnPost(@Req() req, @Query('postId') postId: PostIdDto, @Res() res) {
    return res.status(HttpStatus.OK).json(await this.postService.deleteUserPost(req.user.userId, postId))
  }

  @Put('edit')
  async editOwnPost( @Req() req, @Res() res, @Query() query:PostIdDto, @Body() updatePostDto: UpdatePostDto) {
    return res.status(HttpStatus.OK).json(await this.postService.editUserPost(req.user.userId, query.postId, updatePostDto))
  }
  
  @SkipAuth()
  @Get('get')
  async getPosts(@Res() res): Promise<any> {
    return res.status(HttpStatus.OK).json(await this.postService.getPosts())
  }

  @SkipAuth()
  @Get('sort-time')
  async sortPostsByTime(@Res() res): Promise<any> {
    return res.status(HttpStatus.OK).json(await this.postService.sortPostByTime())
  }

  @SkipAuth()
  @Get('sort-upvotes')
  async sortPostsByUpvotes(@Res() res): Promise<any> {
    return res.status(HttpStatus.OK).json(await this.postService.sortPostsByUpvotes())
  }

  @Patch('upvote')
  async upvotePost(@Res() res, @Query() query: PostIdDto): Promise<any> {
    return res.status(HttpStatus.OK).json(await this.postService.upvotePost(query.postId))
  }

  @Patch('downvote')
  async downvotePost(@Res() res, @Query() query:PostIdDto): Promise<any> {
    return res.status(HttpStatus.OK).json(await this.postService.downvotePost(query.postId))
  }
}