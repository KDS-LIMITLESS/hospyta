import { PickType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsEnum, IsOptional, IsString, IsMongoId } from "class-validator";

enum PostCategories {
  KIDNEY = 'Kidney',
  HEDACHE = 'Headache',
  STOMACH = 'Stomach'
}
export class CreatePostDto {

  image: string

  @IsNotEmpty()
  content: string

  @IsNotEmpty()
  subject: string

  @IsNotEmpty()
  @IsEnum(PostCategories)
  category: string

}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  image?: string

  @IsOptional()
  @IsString()
  content?: string

  @IsOptional()
  @IsString()
  subject?: string

  @IsOptional()
  @IsEnum(PostCategories)
  category?: String
}

export class PostIdDto {
  @IsMongoId()
  @IsNotEmpty()
  postId
}

export class CategoryDto extends PickType(CreatePostDto, ['category'] as const) {}