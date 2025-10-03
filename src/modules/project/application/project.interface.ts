import { IntlBase } from "src/domain/entities/intl.type";
import { KeyProject, ProjectBase, TechProject, TimeProject } from "src/domain/entities/project";
import { DBBase, LucideIconNames } from "src/dynamic.types";

export type Project = {
  nameId: string;
  openSource: null | string;
  operative: null | string;
  ejemplo: boolean;
  image: null | string;
  icon: LucideIconNames;
  title: IntlBase;
  desc: IntlBase;
  lilDesc: IntlBase;
  time: (TimeProject & { id: string })[];
  keys: (KeyProject<LucideIconNames> & { id: string })[];
  techs: (TechProject & { id: string })[];
} & DBBase

export interface ProjectInterface 
// extends CRUI<ProjectBase>
 {
    populate(data:ProjectBase[]): Promise<(ProjectBase & DBBase) []>
    readEjemplo(): Promise<(ProjectBase & DBBase) []>
}