import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreateStudentInput {
    @Field() 
    id: number;
    @Field()
    name: string;
    @Field()
    age: number;
    @Field()
    dob: Date;
    @Field()
    email: string;
}