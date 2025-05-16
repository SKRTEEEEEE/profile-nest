import { IsString, MaxLength, MinLength } from "class-validator";

export class QueryDto {
    @IsString()
    @MaxLength(50)
    @MinLength(2)
    q: string;
}