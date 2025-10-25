import { MongoosePopulateImpl } from "src/shareds/pattern/infrastructure/implementations/populate.impl";
import { Injectable } from "@nestjs/common";
import { ProjectInterface } from "../application/project.interface";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ProjectBase } from "src/domain/entities/project";

//🧠🔎parseOpt -- ejemplo
const extractId = (item: any, index: number) => {
    const { _id, ...rest } = item;
    return { ...rest, id:  _id.toString()};}
const parseOpt = {
    time: (value:any) => value?.map((item: any, index:number) => extractId(item, index)),
    keys: (value: any) => value?.map((item:any, index:number) => extractId(item, index)),
    techs: (value:any) => value?.map((item: any, index:number) => extractId(item, index))
  }


@Injectable()
export class MongooseProjectRepo 
extends MongoosePopulateImpl<ProjectBase> 
implements ProjectInterface {
    constructor(
        @InjectModel("Project")
        private readonly projectModel: Model<ProjectBase>
    ){
        super(projectModel,parseOpt)
    }

    async readEjemplo() {
        const res = await this.projectModel.find({ejemplo:true})  
        this.resArrCheck(res)
        return res.map((doc) => this.documentToPrimary(doc))
    }

    async readById(id: string): Promise<(ProjectBase & import("src/dynamic.types").DBBase) | null> {
        try {
            const res = await this.projectModel.findById(id)
            if (!res) {
                return null
            }
            return this.documentToPrimary(res)
        } catch (error) {
            console.error(`Error finding project by id ${id}:`, error)
            return null
        }
    }
}
