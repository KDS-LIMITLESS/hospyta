
import { Controller, Post, Get, Body, Req, Res, Query, HttpStatus, Patch } from '@nestjs/common'
import { CommentService } from './comment.services'
import { CreateCommentDto } from './comment.Dto';
import { PostIdDto } from 'src/post/post.dto';

@Controller('api.hospyta/v1/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('create')
  async createComment(@Req() req, @Res() res, @Query() query: PostIdDto, @Body() payload: CreateCommentDto): Promise<any> {
    return res.status(HttpStatus.OK).json(await this.commentService.addComment(req.user.userId, query.postId, payload))
  }

  @Get('get-post-comment')
  async getCommentsByPost(@Res() res, @Query() query: PostIdDto): Promise<any> {
    return res.status(HttpStatus.OK).json(await this.commentService.getCommentsByPost(query.postId))
  }

  @Patch('upvote')
  async upvotePost(@Res() res, @Query() query: PostIdDto): Promise<any> {
    return res.status(HttpStatus.OK).json(await this.commentService.upvoteComment(query.postId))
  }

  @Patch('downvote')
  async downvotePost(@Res() res, @Query() query:PostIdDto): Promise<any> {
    return res.status(HttpStatus.OK).json(await this.commentService.downvoteComment(query.postId))
  }
}