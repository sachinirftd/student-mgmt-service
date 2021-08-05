import { Scalar } from '@nestjs/graphql';
import { FileUpload } from 'graphql-upload'
import { GraphQLUpload } from 'graphql-upload';

@Scalar('Upload')
export class Upload {
  description = 'Upload custom scalar type';

  async parseValue(value: Promise<FileUpload>) {
    const upload = await value;
    return upload;
  }

  serialize(value: any) {
    return GraphQLUpload.serialize(value);
  }

  parseLiteral(ast) {
    return GraphQLUpload.parseLiteral(ast);
  }
}