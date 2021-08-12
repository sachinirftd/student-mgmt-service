import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreateStudentInput {
    @Field((type) => Int) 
    id: number;
    @Field()
    name: string;
    @Field()
    age?: number;
    @Field()
    dob: Date;
    @Field()
    email: string;
}