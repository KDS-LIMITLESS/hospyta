import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";
import ResponseMessages from "src/utils/response-messages";


@Injectable()
export class DatabaseService<T> {
  constructor(@InjectModel('') private readonly model: Model<T>) {}

  // CREATE NEW DATABASE RECORD
  async create(data: any): Promise<any> {
    try {
      const newData = new this.model(data)
      return newData.save();
    }
    catch(err: any) {
      throw new InternalServerErrorException(
        {
          message: {
            responseMessage: ResponseMessages.ServerError,
            cause: err.message
          }
        }
      )
    }
  }

  // FIND DOCUMENT WITH A DESIGNATED PROP KEY
  async findOneDocument(searchParam: any, value: string)  {
    try {
      let query = {[searchParam]: value}
      return await this.model.findOne(query).exec()
    }
    catch(err: any) {
      throw new InternalServerErrorException(
        {
          message: {
            responseMessage: ResponseMessages.ServerError,
            cause: err.message
          }
        }
      )
    }
  }

  // FIND SINGLE DOCUMENT WITH ID
  async findDocumentById(doc_id: string): Promise<any> {
    try {
      return this.model.findById(doc_id).exec()
    }
    catch(err: any) {
      throw new InternalServerErrorException(
        {
          message: {
            responseMessage: ResponseMessages.ServerError,
            cause: err.message
          }
        }
      )
    } 
  }

  // FIND MULTIPLE DOCUMENTS WITH ID
  async findDocumentsById(serachValue: any, value: string): Promise<any> {
    try {
      let query = {[serachValue]: value}
      return this.model.find(query).exec
    }
    catch(err: any) {
      throw new InternalServerErrorException(
        {
          message: {
            responseMessage: ResponseMessages.ServerError,
            cause: err.message
          }
        }
      )
    }
  }

  // DELETE DOCUMNTS WITH SPECIFIED ID
  async findAndDeleteDocumentById(doc_id: string): Promise<any> {
    try {
      return this.model.findByIdAndDelete(doc_id)
    }
    catch(err: any) {
      throw new InternalServerErrorException(
        {
          message: {
            responseMessage: ResponseMessages.ServerError,
            cause: err.message
          }
        }
      )
    }
  }

  async upvotePost(id: string): Promise<any> {
    try {
      return this.model.findByIdAndUpdate(id, { $inc: { upvotes: 1 } }, { new: true }).exec();
    }
    catch(err: any) {
      throw new BadRequestException({message: err.message})
    }

  }

  async downvotePost(id: string): Promise<any> {
    try {
      return this.model.findByIdAndUpdate(id, { $inc: { downvotes: 1 } }, { new: true }).exec();
    }
    catch(err: any) {
      throw new BadRequestException({message: err.message})
    }
  }
}