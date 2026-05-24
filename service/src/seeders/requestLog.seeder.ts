import RequestLog from '@models/request_log.model.js';

export default async function seedRequestLogs() {
  const count = await RequestLog.countDocuments();
  if (count > 0) {
    console.log('RequestLogs already seeded');
    return await RequestLog.find({});
  }

  const now = new Date();
  const logs = [
    {
      method: 'GET',
      direction: 'inbound',
      endpoint: '/api/v1/health',
      status_code: 200,
      duration: 5,
      request_timestamp: now,
      response_timestamp: now,
      request_headers: { host: 'localhost' },
      request_body: {},
      response_headers: { 'content-type': 'text/plain' },
      response_body: { message: 'ok' }
    }
  ];

  const created = await RequestLog.insertMany(logs as any[]);
  console.log(`Seeded ${created.length} request logs`);
  return created;
}
