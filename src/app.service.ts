import { Injectable } from '@nestjs/common';
import { UserLog } from 'src/entities/userLog.entity';
import OpenAI from 'openai';
import { EntityManager } from 'typeorm';
import 'dotenv/config';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

@Injectable()
export class AppService {
  constructor(private readonly manager: EntityManager) {}

  async getHello(userQuery: string): Promise<string> {
    const users = await this.manager.getRepository(UserLog).find();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Generate a SQL Postgres query based on the user query.
           this is the schema of the database:
           
           CREATE TABLE "user_log" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, CONSTRAINT "PK_eca046d4b8c20d9309b35f07b69" PRIMARY KEY ("id"))`,
        },
        { role: 'user', content: userQuery },
      ],
    });

    const sql = response.choices[0].message.content;
    return sql + `\n\nHello World! Found ${users.length} users.`;
  }
}
