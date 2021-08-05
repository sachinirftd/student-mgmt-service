import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class DeleteStudentInput {
    @Field() 
    @IsNotEmpty()
    id: number;
}