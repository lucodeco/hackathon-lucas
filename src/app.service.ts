import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import 'dotenv/config';
import zod from 'zod';
import { createClient } from '@clickhouse/client';
import { prompt } from './prompts/queryGenerator';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const responseFormat = zod.object({
  executable_sql: zod
    .string()
    .describe('The SQL query to be executed against ClickHouse'),
  query_description: zod
    .string()
    .describe('A human-readable description of what the query does'),
  assumptions: zod
    .string()
    .describe('Any assumptions made when generating the query'),
});

const clickhouse = createClient({
  url: process.env.CLICKHOUSE_URL,
  username: 'default',
  password: process.env.CLICKHOUSE_PASSWORD,
});

@Injectable()
export class AppService {
  async getAmplitudeData(dataDescription: string): Promise<unknown> {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: dataDescription },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response content received from OpenAI');
    }

    const output = responseFormat.parse(JSON.parse(content));

    const queryResult = await clickhouse.query({
      query: output.executable_sql,
      format: 'JSON',
    });

    // Extract the actual data from the query result
    const { data } = await queryResult.json();

    return {
      data,
      sql: output.executable_sql,
      description: output.query_description,
      assumptions: output.assumptions,
    };
  }
}
