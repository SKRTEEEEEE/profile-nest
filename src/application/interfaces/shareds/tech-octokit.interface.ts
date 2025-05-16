import { TechBase, TechForm } from "src/domain/entities/tech";

export abstract class TechOctokitRepository {
    abstract create(data: TechForm, owner ?:string): Promise<{
    success: boolean;
    message: string;
}>
}