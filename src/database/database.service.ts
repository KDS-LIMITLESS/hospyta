import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";


@Injectable()
export class DatabaseService<T> {
  constructor(@InjectModel('') private readonly model: Model<T>) {}

  async create(data: any): Promise<any> {
    const newData = new this.model(data)
    return newData.save();
  }
}