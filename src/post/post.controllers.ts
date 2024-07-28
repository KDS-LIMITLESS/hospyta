import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put, Query, Req, Res } from "@nestjs/common"
import { PostService } from "./post.services"
import { CreatePostDto, UpdatePostDto } from "./post.dto"

@Controller('api.hospyta/v1/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  async createPost(@Res() res, @Body() payload: CreatePostDto, @Req()req) {
    return res.status(HttpStatus.OK).json(await this.postService.createPost(payload, req.user.userId))
  }

  @Delete('own/delete/') 
  async deleteOwnPost(@Req() req, @Query('id') postId: string, @Res() res) {
    return res.status(HttpStatus.OK).json(await this.postService.deleteUserPost(req.user.userId, postId))
  }

  @Put('edit')
  async editOwnPost( @Req() req, @Res() res, @Query() query, @Body() updatePostDto: UpdatePostDto) {
    return res.status(HttpStatus.OK).json(await this.postService.editUserPost(req.user.userId, query.postId, updatePostDto))
  }
  
  @SkipAuth()
  @Get('get')
  async getPosts(@Res() res): Promise<any> {
    return res.status(HttpStatus.OK).json(await this.postService.getPosts())
  }

  @Patch('upvote')
  async upvotePost(@Res() res, @Query() query): Promise<any> {
    return res.status(HttpStatus.OK).json(await this.postService.upvotePost(query.postId))
  }

  @Patch('downvote')
  async downvotePost(@Res() res, @Query() query): Promise<any> {
    return res.status(HttpStatus.OK).json(await this.postService.downvotePost(query.postId))
  }
}