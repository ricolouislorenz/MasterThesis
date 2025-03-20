// src/generateNodes.js
import fs from 'fs';
import { geoContains } from 'd3-geo';
import * as topojson from 'topojson-client';

// Hilfsfunktion, um einen Zufallswert zwischen min und max zu erhalten
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Lese die world.topojson Datei aus dem public/assets-Ordner
const topojsonData = JSON.parse(fs.readFileSync('public/assets/world.topojson', 'utf8'));

// Konvertiere das TopoJSON in GeoJSON-Features (hier wird davon ausgegangen, dass die Länder unter 'countries' liegen)
const countriesGeo = topojson.feature(topojsonData, topojsonData.objects.countries).features;

// Anzahl der zu generierenden Knoten (hier 1.000)
const count = 1000;
const nodes = [];

// Erzeuge 1.000 Knoten mit zufälligen Koordinaten (über den gesamten Globus)
for (let i = 0; i < count; i++) {
  const longitude = randomInRange(-180, 180);
  const latitude = randomInRange(-90, 90);
  let countryName = "Unknown";
  // Bestimme, in welchem Land der Punkt liegt (falls er auf Land ist)
  for (const country of countriesGeo) {
    if (geoContains(country, [longitude, latitude])) {
      countryName = country.properties.name;
      break;
    }
  }
  nodes.push({
    id: `node-${i}`,
    name: countryName,
    latitude,
    longitude,
    fixed: false
  });
}

const output = { nodes };
fs.writeFileSync('public/assets/nodes_generated.json', JSON.stringify(output, null, 2));
console.log(`${count} nodes generated in public/assets/nodes_generated.json`);
