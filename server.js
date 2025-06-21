const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'vendors.json');

const DEFAULT_VENDORS = [
  {
    id: '1',
    name: 'Crawfish Boss',
    price: 3.25,
    last: 3.40,
    history: [3.4, 3.35, 3.3, 3.28, 3.27, 3.26, 3.25]
  },
  {
    id: '2',
    name: 'Big EZ Seafood',
    price: 3.10,
    last: 3.00,
    history: [3.0, 3.05, 3.08, 3.1, 3.1, 3.1, 3.1]
  },
  {
    id: '3',
    name: 'Mudbug Masters',
    price: 3.50,
    last: 3.60,
    history: [3.6, 3.55, 3.52, 3.5, 3.51, 3.52, 3.5]
  }
];

app.use(express.json());
app.use(express.static(__dirname));

function readVendors(){
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
  writeVendors(DEFAULT_VENDORS);
  return DEFAULT_VENDORS;
}

function writeVendors(vendors){
  fs.writeFileSync(DATA_FILE, JSON.stringify(vendors, null, 2));
}

app.get('/api/vendors', (req,res)=>{
  res.json(readVendors());
});

app.post('/api/vendors', (req,res)=>{
  const vendors = readVendors();
  const vendor = req.body;
  vendor.id = Date.now().toString();
  vendor.history = vendor.history || [];
  vendors.push(vendor);
  writeVendors(vendors);
  res.json(vendor);
});

app.put('/api/vendors/:id', (req,res)=>{
  const vendors = readVendors();
  const index = vendors.findIndex(v => v.id === req.params.id);
  if(index === -1) return res.status(404).end();
  const vendor = vendors[index];
  if (req.body.name !== undefined) vendor.name = req.body.name;
  if (req.body.price !== undefined) {
    vendor.history.push(req.body.price);
    if (vendor.history.length > 7) vendor.history.shift();
    vendor.last = vendor.price;
    vendor.price = req.body.price;
  }
  if (req.body.last !== undefined) vendor.last = req.body.last;
  writeVendors(vendors);
  res.json(vendor);
});

app.delete('/api/vendors/:id', (req,res)=>{
  const vendors = readVendors();
  const index = vendors.findIndex(v => v.id === req.params.id);
  if(index === -1) return res.status(404).end();
  const [deleted] = vendors.splice(index,1);
  writeVendors(vendors);
  res.json(deleted);
});

app.get('/admin', (req,res)=>{
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));
