import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LogInDto {
    @IsNotEmpty({message:"Email must not be empty!"})
     username: string;
  
    @IsNotEmpty({message: "Password can not be empty!"})
    @IsString({message: "Password is not a string!"})
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&]*$/, { message: 'Password must be a mixture of letters and numbers, and symbols(optional)' })
    @MinLength(5)
    @MaxLength(20)
     password: string;
}
