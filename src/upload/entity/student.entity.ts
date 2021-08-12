import { Directive, Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType() //used to specify what to be included in the schema
// @Directive('@key(fields: "id")')
export class Student {
    
    @Field((type) => Int) // specifies fileds to be included in the table
    id: number;
    @Field()
    name: string;
    @Field((type) => Int, { nullable: true })
    age?: number;
    @Field()
    dob: string;
    @Field()
    email: string;
}