import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class UpdateStudentInput {
    @Field() 
    @IsNotEmpty()
    id: number;
    @Field()
    name: string;
    @Field()
    age: number;
    @Field()
    dob: string;
    @Field()
    email: string;
}