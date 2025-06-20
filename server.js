import express from 'express';
import fs from 'fs';
import basicAuth from 'express-basic-auth';

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = './data/vendors.json';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'password';

app.use(express.json());
app.use(express.static('.'));

function loadData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function calcAverageHistory(vendors) {
  const days = vendors[0].history.length;
  const avg = Array(days).fill(0);
  vendors.forEach(v => {
    v.history.forEach((p, i) => {
      avg[i] += p;
    });
  });
  return avg.map(v => v / vendors.length);
}

app.get('/api/vendors', (req, res) => {
  const data = loadData();
  res.json(data);
});

app.get('/api/average', (req, res) => {
  const data = loadData();
  const avg = calcAverageHistory(data.vendors);
  res.json({ average: avg });
});

const adminAuth = basicAuth({
  users: { [ADMIN_USER]: ADMIN_PASS },
  challenge: true
});

app.post('/api/vendors/:index', adminAuth, (req, res) => {
  const idx = parseInt(req.params.index, 10);
  const { price, active } = req.body;
  const data = loadData();
  if (!data.vendors[idx]) {
    return res.status(404).json({ error: 'Vendor not found' });
  }
  const vendor = data.vendors[idx];
  vendor.last = vendor.price;
  if (typeof price === 'number') {
    vendor.price = price;
    vendor.history.push(price);
    if (vendor.history.length > 7) vendor.history.shift();
  }
  if (typeof active === 'boolean') vendor.active = active;
  saveData(data);
  res.json({ success: true, vendor });
});

app.listen(PORT, () => {
  console.log(`Sack Tracker server running on http://localhost:${PORT}`);
});
