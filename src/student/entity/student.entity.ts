import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType() //used to specify what to be included in the schema
export class Student {
    
    @Field() // specifies fileds to be included in the table
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