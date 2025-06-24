const fs = require('fs');
const path = require('path');
const DATA_FILE = path.join(__dirname, '..', '..', 'vendors.json');

function readVendors() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      if (data.trim() !== '') {
        return JSON.parse(data);
      }
    } catch (err) {
      console.error('Failed to parse vendors.json:', err);
    }
  }
  return [];
}

function writeVendors(vendors) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(vendors, null, 2));
}

exports.handler = async (event) => {
  const vendors = readVendors();
  const method = event.httpMethod;

  if (method === 'GET') {
    return { statusCode: 200, body: JSON.stringify(vendors) };
  }

  if (method === 'POST') {
    const vendor = JSON.parse(event.body || '{}');
    vendor.id = Date.now().toString();
    vendor.history = vendor.history || [];
    vendors.push(vendor);
    writeVendors(vendors);
    return { statusCode: 200, body: JSON.stringify(vendor) };
  }

  const id = event.path.split('/').pop();
  const index = vendors.findIndex((v) => v.id === id);
  if (index === -1) return { statusCode: 404 };
  const vendor = vendors[index];

  if (method === 'PUT') {
    const body = JSON.parse(event.body || '{}');
    if (body.name !== undefined) vendor.name = body.name;
    if (body.price !== undefined) {
      vendor.history.push(body.price);
      if (vendor.history.length > 7) vendor.history.shift();
      vendor.last = vendor.price;
      vendor.price = body.price;
    }
    if (body.last !== undefined) vendor.last = body.last;
    writeVendors(vendors);
    return { statusCode: 200, body: JSON.stringify(vendor) };
  }

  if (method === 'DELETE') {
    const [deleted] = vendors.splice(index, 1);
    writeVendors(vendors);
    return { statusCode: 200, body: JSON.stringify(deleted) };
  }

  return { statusCode: 405 };
};
