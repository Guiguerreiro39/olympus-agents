import { env } from "@/env";
import { Client } from "@upstash/qstash";

type ScheduleParams = {
  url: string;
  cron: string;
};

const client = new Client({
  token: env.QSTASH_TOKEN,
});

export const scheduleTask = async ({ url, cron }: ScheduleParams) =>
  await client.schedules.create({
    destination: `${env.QSTASH_URL}/${url}`,
    cron,
  });
