import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @IsString()
  @Length(2, 10)
  @ApiProperty({ example: "username" })
  public firstName?: string;
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  public email: string;
  public title?: string;
  public city?: string;
  public surName?: string;
  public gender?: string;
  public interest?: string;
  public tokenSumSub?: string;
  @IsString()
  @Length(2, 20)
  @IsNotEmpty()
  public password: string;
}
