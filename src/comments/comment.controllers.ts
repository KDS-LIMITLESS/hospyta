
import { Controller, Post, Get, Body, Req, Res, Query, HttpStatus } from '@nestjs/common'
import { CommentService } from './comment.services'
import { CreateCommentDto } from './comment.Dto';

@Controller('api.hospyta/v1/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('create')
  async createComment(@Req() req, @Res() res, @Query('postId') query, @Body() payload: CreateCommentDto): Promise<any> {
    return res.status(HttpStatus.OK).json(await this.commentService.addComment(req.user.userId, query, payload))
  }

  @Get('get-post-comment')
  async getCommentsByPost(@Res() res, @Query('postId') postId: string): Promise<any> {
    return res.status(HttpStatus.OK).json(await this.commentService.getCommentsByPost(postId))
  }
}