import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested, IsObject } from "class-validator";

class FileUploadDto {
  @ApiProperty({
    description: "The name of the file to be uploaded, including the extension.",
    example: "example.pdf",
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({
    description: "The MIME type of the file to be uploaded. For a PDF, this should be application/pdf.",
    example: "application/pdf",
  })
  @IsString()
  @IsNotEmpty()
  contentType: string;

  @ApiProperty({
    description: "Optional. The subfolder within the S3 bucket where the file should be stored.",
    example: "user-documents/",
    required: false,
  })
  @IsString()
  @IsOptional()
  subfolder?: string;

  @ApiProperty({
    description: "Optional. Tags for the file, provided as any key-value pairs.",
    example: { Key1: "Value1", Key2: "Value2" },
    type: "object",
    additionalProperties: {
      type: "string",
    },
    required: false,
  })
  @IsObject()
  @IsOptional()
  tags?: Record<string, string>;
}

export class CreateFileServiceDto {
  @ApiProperty({
    type: [FileUploadDto],
    description: "List of files to be uploaded",
  })
  @ValidateNested({ each: true })
  @Type(() => FileUploadDto)
  @IsArray()
  @IsNotEmpty()
  files: FileUploadDto[];
}
