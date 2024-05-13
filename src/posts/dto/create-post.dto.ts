import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: 'Test Description',
    description: 'Test Caption for the POST',
  })
  caption: string;

  @ApiProperty({ example: 1, description: 'User ID of the post creator' })
  userId: number;
}
