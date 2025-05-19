import { Injectable } from '@nestjs/common';

import { Document, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { PreTechInterface } from '../application/pre-tech.interface';
import { MongooseRpPattern } from 'src/shareds/pattern/infrastructure/patterns/rp.pattern';
import { MongooseBase } from 'src/shareds/pattern/infrastructure/types';
import { MongooseReadI, MongooseReadImpl } from 'src/shareds/pattern/infrastructure/implementations/read.impl';
import { MongoosePopulateI, MongoosePopulateImpl } from 'src/shareds/pattern/infrastructure/implementations/populate.impl';


@Injectable()
export class MongoosePreTechRepo 
extends MongooseRpPattern<PreTechBase> 
implements PreTechInterface<MongooseBase>, 
MongooseReadI<PreTechBase>,
MongoosePopulateI<PreTechBase>
{
  private mdUrl = 'https://raw.githubusercontent.com/simple-icons/simple-icons/master/slugs.md';
  private jsonUrl = 'https://raw.githubusercontent.com/simple-icons/simple-icons/master/_data/simple-icons.json';

  constructor(
    @InjectModel('PreTech') private readonly preTechModel: Model<PreTechBase & Document>,
  ) {
    super(
      preTechModel, 
      new MongooseReadImpl(preTechModel), 
      new MongoosePopulateImpl(preTechModel));
  }

  async readByQuery(query: { q: string }): Promise<(PreTechBase & MongooseBase)[]> {
  const opt = {
    filter: {
      $or: [
        { nameId: { $regex: query.q, $options: 'i' } },
        { nameBadge: { $regex: query.q, $options: 'i' } },
      ]
    },
    projections: {},
    options: { limit: 50 },
  };
  return this.read(opt);
}



  async updatePreTech(): Promise<void> {
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
