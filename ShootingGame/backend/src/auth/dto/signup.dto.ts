
import { IsString, IsEmail, IsNotEmpty, Matches, IsAlpha, MinLength, MaxLength } from 'class-validator';

export class SignUpDto {

    @IsNotEmpty({message:"Name is empty!"})
    @IsString({message:"Name must be a valid charaters string!"})
    @IsAlpha()
    @MinLength(6)
    @MaxLength(20)
    name: string;

    @IsNotEmpty({message:"Username is empty!"})
  @IsString({message:"Username must be mixture of characters and numbers!"})
  @Matches(/^[a-zA-Z0-9]*$/, { message: 'Username must contain only letters and numbers' })
  @MinLength(6)
  @MaxLength(10)
    username: string;

  @IsNotEmpty({message: "Password can not be empty!"})
  @IsString({message: "Password is not a string!"})
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&]*$/, { message: 'Password must be a mixture of letters and numbers, and symbols(optional)' })
  @MinLength(5)
  @MaxLength(20)
   password: string;
}
