const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'vendors.json');

app.use(express.json());
app.use(express.static(__dirname));

function readVendors(){
  if (fs.existsSync(DATA_FILE)) {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  }
  return [];
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
  vendors[index] = { ...vendors[index], ...req.body };
  writeVendors(vendors);
  res.json(vendors[index]);
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
