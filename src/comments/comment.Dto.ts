import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateCommentDto {
 
  @IsString()
  @IsNotEmpty()
  comment: string;
}