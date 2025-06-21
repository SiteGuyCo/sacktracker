const test = require('node:test');
const assert = require('node:assert');
const app = require('../server');
let server;

test('GET /api/vendors returns array', async (t) => {
  server = app.listen(0);
  await new Promise(r => server.once('listening', r));
  const port = server.address().port;
  const res = await fetch(`http://localhost:${port}/api/vendors`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data));
  server.close();
});
