import { Injectable } from "@nestjs/common";
import { PreTechInterface } from "../application/pre-tech.interface";
import { MongooseBase } from "src/shareds/pattern/infrastructure/types";
import { DatabaseFindError } from "src/domain/flows/domain.error";
import { ResCodes } from "src/domain/flows/res.codes";

@Injectable()
export class MockPreTechRepo implements PreTechInterface<MongooseBase>{
    private preTechs: (PreTechBase & MongooseBase)[] = [{
        id: "idkjejkre",
        nameId: "Hola mundo",
        nameBadge: "Hola mundo 2",
        color: "blue",
        web: "idk",
        createdAt: "djsakjsak",
        updatedAt: "jfaksjfkassa",
    } ]
    async readByQuery(query: {q:string}): Promise<(PreTechBase & MongooseBase)[]>{
         
        const tech = this.preTechs.find(tech => tech.nameId == query.q)
        if(!tech) throw new DatabaseFindError({optionalMessage:"Not find in mock"})
            return await [tech]
        }
        async updatePreTech(){
            
        }
}