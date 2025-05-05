import { Injectable } from '@nestjs/common';
import { MongooseBase } from '../types';
import { MongooseRpPattern } from '../patterns/rp.pattern';
import { PreTechRepository } from 'src/application/interfaces/entities/pre-tech.interface';
import { PreTechBase } from 'src/domain/entities/pre-tech';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { ReadMeta } from 'src/domain/interfaces/read';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseReadImpl } from '../implementations/read.impl';
import { MongoosePopulateImpl } from '../implementations/populate.impl';

type PreTechMeta = ReadMeta<
          PreTechBase, 
          MongooseBase, 
          FilterQuery<PreTechBase & MongooseBase> | undefined,
          ProjectionType<PreTechBase> | null | undefined,
          QueryOptions<PreTechBase> | null | undefined
          >

@Injectable()
export class MongoosePreTechRepo extends MongooseRpPattern<PreTechBase> implements PreTechRepository<PreTechBase, MongooseBase, PreTechMeta> {
  private mdUrl = 'https://raw.githubusercontent.com/simple-icons/simple-icons/master/slugs.md';
  private jsonUrl = 'https://raw.githubusercontent.com/simple-icons/simple-icons/master/_data/simple-icons.json';

  constructor(@InjectModel('PreTech') private readonly preTechModel: Model<PreTechBase & Document>,) {
    super(preTechModel, new MongooseReadImpl(preTechModel), new MongoosePopulateImpl(preTechModel));
  }

  async readByQuery(query: string): Promise<(PreTechBase & MongooseBase)[]> {
    await this.connect();
    const opt = {
      filter: {
        $or: [
          { nameId: { $regex: query, $options: 'i' } },
          { nameBadge: { $regex: query, $options: 'i' } },
        ],
      },
      projections: {},
      options: { limit: 50 },
    };
    return this.read(opt);
  }

  async updatePreTech(): Promise<void> {
    await this.connect();
    try {
      const mdResponse = await fetch(this.mdUrl);
      const mdContent = await mdResponse.text();
      const preTechData = this.parseMdContent(mdContent);

      const jsonResponse = await fetch(this.jsonUrl);
      const jsonData = await jsonResponse.json();

      const combinedData = preTechData
        .map((mdItem) => {
          const jsonItem = jsonData.find((item: any) => item.title === mdItem.nameId);
          if (jsonItem) {
            return {
              nameId: mdItem.nameId,
              nameBadge: mdItem.nameBadge,
              color: jsonItem.hex,
              web: jsonItem.source,
            };
          }
          return null;
        })
        .filter((item) => item !== null);

      const existingNameIds = new Set(await this.preTechModel.distinct('nameId'));
      const newTechs = combinedData.filter((item) => !existingNameIds.has(item.nameId));

      if (newTechs.length > 0) {
        await this.populate(newTechs as PreTechBase[]);
        console.log(`Inserted ${newTechs.length} new technologies`);
      } else {
        console.log('No new technologies to insert');
      }
    } catch (error) {
      console.error('Error fetching or parsing PreTech data:', error);
      throw error;
    }
  }

  private parseMdContent(content: string): Array<{ nameId: string; nameBadge: string }> {
    const lines = content.split('\n');
    const data: { nameId: string; nameBadge: string }[] = [];
    let tableStarted = false;

    for (const line of lines) {
      if (line.startsWith('| Brand name | Brand slug |')) {
        tableStarted = true;
        continue;
      }
      if (tableStarted && line.startsWith('| :--- | :--- |')) {
        continue;
      }
      if (tableStarted && line.startsWith('|') && line.includes('|')) {
        const [, brandName, brandSlug] = line.split('|').map((item) => item.trim());
        if (brandName && brandSlug) {
          data.push({
            nameId: brandName.replace(/`/g, ''),
            nameBadge: brandSlug.replace(/`/g, ''),
          });
        }
      }
    }

    return data;
  }
}
