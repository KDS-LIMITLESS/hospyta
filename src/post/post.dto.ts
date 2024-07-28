import { IsNotEmpty, IsEnum, IsOptional, IsString } from "class-validator";

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