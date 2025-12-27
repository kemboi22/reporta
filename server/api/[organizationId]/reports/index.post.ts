import { createReport } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  const report = await createReport(body);
  
  setResponseStatus(event, 201);
  return report;
});
