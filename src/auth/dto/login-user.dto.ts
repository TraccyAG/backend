import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
  @ApiProperty({ example: "user@email.com", description: "email" })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "password12345", description: "password" })
  @IsString()
  @Length(2, 20)
  @IsNotEmpty()
  public password: string;
}
