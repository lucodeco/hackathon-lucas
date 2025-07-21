import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { EntityManager } from 'typeorm';
import 'dotenv/config';
import zod from 'zod';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const responseFormat = zod.object({
  executable_sql: zod.string(),
  query_description: zod.string(),
});

@Injectable()
export class AppService {
  constructor(private readonly manager: EntityManager) {}

  async getAmplitudeData(dataDescription: string): Promise<unknown> {
    // const users = await this.manager.getRepository(UserLog).find();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages: [
        {
          role: 'system',
          content: `Generate a SQL Postgres query based on the user query and return it as a JSON object with the following structure:

          WARNING: ALWAYS use ilike for string comparisons when looking for specific values (e.g. organization, country, etc.)

          ALWAYS FILTER BY ORGANIZATION if a company is mentioned.

           {
             "executable_sql": "your SQL query here",
             "query_description": "description of what the query does"
           }
           
           This is the schema of the database:
           CREATE TABLE "user_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "city" character varying, "country" character varying, "organization" character varying, "region" character varying, "event" character varying, "date" TIMESTAMP, "event_properties" jsonb DEFAULT '{}', "project_id" character varying, "interview_id" character varying, "transcript_id" character varying, "button_id" character varying, CONSTRAINT "PK_eca046d4b8c20d9309b35f07b69" PRIMARY KEY ("id"))`,
        },
        { role: 'user', content: dataDescription },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response content received from OpenAI');
    }

    const output = responseFormat.parse(JSON.parse(content));

    const result: unknown = await this.manager.query(output.executable_sql);

    return {
      result,
      sql: output.executable_sql,
      description: output.query_description,
    };
  }
}
