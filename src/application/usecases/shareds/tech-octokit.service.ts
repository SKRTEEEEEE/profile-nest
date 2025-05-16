import { Injectable } from "@nestjs/common";
import { TechOctokitRepository } from "src/application/interfaces/shareds/tech-octokit.interface";
import { TechForm } from "src/domain/entities/tech";


// 
@Injectable()
export class TechOctokitCreateService {
    constructor(
        private readonly techOctokitRepository: TechOctokitRepository
    ){}
    async create(data: TechForm, owner?: string){
        return this.techOctokitRepository.create(data)
    }
}