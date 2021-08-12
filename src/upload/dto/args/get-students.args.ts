import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsArray, IsNotEmpty } from "class-validator";

@ArgsType()
export class GetStudentArgs {
    @Field((type) => Int)
    @IsNotEmpty() //class validator
    id: number;
    @Field()
    name: string;
    @Field()
    age: number;
    @Field()
    dob: string;
    @Field()
    email: string;

    // @Field()
    // @IsArray()
    // students: Student[]
}