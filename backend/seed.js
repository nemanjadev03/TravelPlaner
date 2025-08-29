
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const City = require('./models/City');
const Route = require('./models/Route');

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/travel_planner';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB for seeding');

  await Promise.all([User.deleteMany({}), City.deleteMany({}), Route.deleteMany({})]);

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@example.com',
    password: await bcrypt.hash('admin123', 10),
    role: 'admin'
  });

  const names = [
    'Beograd','Novi Sad','Niš','Subotica','Kragujevac','Zrenjanin','Zaječar','Novi Pazar','Kikinda','Pirot',
    'Kraljevo','Čačak','Jagodina','Užice','Sombor','Požarevac','Leskovac','Vranje','Pančevo','Smederevo',
    'Valjevo','Bor','Prokuplje','Loznica','Šabac','Sremska Mitrovica','Zlatibor','Vrbas','Bačka Palanka','Paraćin'
  ];

  const coords = [
    [44.8,20.5],[45.26,19.84],[43.32,21.89],[46.1,19.66],[44.02,20.92],[45.38,20.39],[43.9,22.29],[43.14,20.51],[45.83,20.46],[43.15,22.59],
    [43.73,20.69],[43.89,20.35],[43.98,21.26],[43.86,19.85],[45.77,19.11],[44.62,21.19],[42.99,21.95],[42.55,21.90],[44.87,20.64],[44.66,20.93],
    [44.27,19.89],[44.08,22.10],[43.23,21.59],[44.53,19.23],[44.74,19.69],[44.98,19.61],[43.72,19.72],[45.57,19.65],[45.25,19.39],[43.87,21.41]
  ];

  const cityDocs = [];
  for (let i=0;i<names.length;i++) {
    cityDocs.push(await City.create({ name: names[i], description: 'Grad', location: { lat: coords[i][0], lng: coords[i][1] }, createdBy: admin._id }));
  }
  console.log('Cities inserted:', cityDocs.length);

  const idByName = Object.fromEntries(cityDocs.map(c => [c.name, c._id]));
  function addRoute(a,b,d) { return { from: idByName[a], to: idByName[b], distance: d, bidirectional: true, createdBy: admin._id }; }

  const baseRoutes = [
    addRoute('Beograd','Novi Sad',85),
    addRoute('Beograd','Pančevo',20),
    addRoute('Novi Sad','Subotica',100),
    addRoute('Beograd','Kragujevac',140),
    addRoute('Beograd','Niš',240),
    addRoute('Niš','Leskovac',45),
    addRoute('Leskovac','Vranje',60),
    addRoute('Novi Sad','Sombor',97),
    addRoute('Zrenjanin','Novi Sad',60),
    addRoute('Kraljevo','Čačak',35),
    addRoute('Čačak','Užice',55),
    addRoute('Jagodina','Paraćin',15),
    addRoute('Požarevac','Smederevo',30),
    addRoute('Valjevo','Šabac',40),
    addRoute('Sremska Mitrovica','Novi Sad',55),
    addRoute('Zaječar','Bor',25),
    addRoute('Prokuplje','Niš',45),
    addRoute('Loznica','Šabac',60),
    addRoute('Vrbas','Novi Sad',45),
    addRoute('Bačka Palanka','Novi Sad',45),
    addRoute('Kikinda','Zrenjanin',66),
    addRoute('Pirot','Niš',75),
    addRoute('Beograd','Smederevo',45),
    addRoute('Beograd','Valjevo',90)
  ];

  await Route.insertMany(baseRoutes);
  console.log('Routes inserted:', baseRoutes.length);

  console.log('Seed complete. Admin: admin@example.com / admin123');
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });