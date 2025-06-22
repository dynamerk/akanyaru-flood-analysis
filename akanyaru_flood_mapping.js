// Load study area shapefile
var studyArea = ee.FeatureCollection('projects/ee-dynamereki/assets/akanyaru_study_area_cell');

// Center map on study area
Map.centerObject(studyArea, 10);

// Style boundary in red with transparent fill
var studyAreaOutline = studyArea.style({
  color: 'red',
  fillColor: '00000000',
  width: 2
});
Map.addLayer(studyAreaOutline, {}, 'Study Area Boundary');

// Load Sentinel-1 VV (SAR)
var sentinel1 = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(studyArea)
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING'))
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .map(function(image) {
    return image.select('VV').clip(studyArea);
  });

// Default flood dates
var preFloodStartDate = '2024-01-01';
var preFloodEndDate = '2024-01-19';
var duringFloodStartDate = '2024-06-20';
var duringFloodEndDate = '2024-07-10';

// Process dates
var preFloodStart = ee.Date(preFloodStartDate);
var preFloodEnd = ee.Date(preFloodEndDate);
var duringFloodStart = ee.Date(duringFloodStartDate);
var duringFloodEnd = ee.Date(duringFloodEndDate);

// Filter Sentinel-1 images and calculate median VV
var preFlood = sentinel1.filterDate(preFloodStart, preFloodEnd).median().select('VV');
var duringFlood = sentinel1.filterDate(duringFloodStart, duringFloodEnd).median().select('VV');

// Create flood mask (threshold -13 dB)
var floodMask = duringFlood.lt(-13).selfMask();

// Load ESA WorldCover cropland class (40)
var landcover = ee.Image('ESA/WorldCover/v100/2020').select('Map').clip(studyArea);
var cropland = landcover.eq(40).selfMask();

// Flooded cropland
var floodedCropland = floodMask.updateMask(cropland).clip(studyArea);

// Calculate areas (m²)
var pixelArea = ee.Image.pixelArea();

var totalAreaImage = pixelArea.updateMask(cropland);
var floodedAreaImage = pixelArea.updateMask(floodedCropland);

var totalArea = totalAreaImage.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e10
});

var floodedArea = floodedAreaImage.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e10
});

// Print area results (converted to hectares)
ee.Dictionary(totalArea).get('area').evaluate(function(tot) {
  ee.Dictionary(floodedArea).get('area').evaluate(function(flood) {
    var totalHa = tot / 10000;
    var floodHa = flood / 10000;
    var afterFloodHa = totalHa - floodHa;
    var ecoValuePerHa = 1000; // Ecosystem service value per hectare USD
    var lossUSD = floodHa * ecoValuePerHa;

    print('✅ Total Cropland Area (ha):', totalHa);
    print('✅ Flooded Cropland Area (ha):', floodHa);
    print('✅ Remaining Cropland (ha):', afterFloodHa);
    print('✅ Ecosystem Service Value Lost (USD):', lossUSD);
  });
});

// Map Layers
Map.clear();
Map.setOptions('SATELLITE');
Map.centerObject(studyArea, 9);
Map.addLayer(studyAreaOutline, {}, 'Study Area Boundary');
Map.addLayer(preFlood, {min: -25, max: 0}, 'Pre-Flood VV (Sentinel-1)');
Map.addLayer(duringFlood, {min: -25, max: 0}, 'During-Flood VV (Sentinel-1)');
Map.addLayer(floodMask, {palette: ['blue']}, 'Flooded Areas');
Map.addLayer(cropland, {palette: ['yellow']}, 'Cropland (2020)');
Map.addLayer(floodedCropland, {palette: ['red']}, 'Flooded Cropland');

// Create legend panel on top-right side WITHOUT box styling
var legendPanel = ui.Panel({
  style: {
    position: 'top-right',
    margin: '10px',
    // No background, border, or padding for transparent look
    backgroundColor: '00000000',
    border: 'none',
    padding: '0px',
    fontSize: '14px',
    fontWeight: 'bold',
  }
});

legendPanel.add(ui.Label('Legend', {margin: '0 0 8px 0', fontWeight: 'bold', color: 'black'}));

function makeLegendRow(color, name) {
  var colorBox = ui.Label('', {
    backgroundColor: color,
    padding: '8px',
    margin: '0 8px 0 0',
    width: '30px',
    height: '15px'
  });
  var description = ui.Label(name, {color: 'black'});
  return ui.Panel([colorBox, description], ui.Panel.Layout.Flow('horizontal'), {margin: '2px 0'});
}

legendPanel.add(makeLegendRow('yellow', 'Cropland'));
legendPanel.add(makeLegendRow('blue', 'Flooded Zone'));
legendPanel.add(makeLegendRow('red', 'Flooded Cropland'));

ui.root.insert(0, legendPanel);
// Style boundary in black with transparent fill
var studyAreaOutline = studyArea.style({
  color: 'black',       // changed from 'red' to 'black'
  fillColor: '00000000',
  width: 2
});
