# 🌊 Akanyaru Flood Mapping & Cropland Loss Assessment (2024)

This project leverages **Google Earth Engine (GEE)** to map flooding events in the **Akanyaru River Basin**, Rwanda, and assess their impact on cropland and ecosystem services. Using **Sentinel-1 SAR data** and **ESA WorldCover**, it identifies flooded areas, estimates cropland loss, and quantifies the economic value of ecosystem service loss.

---

## 📌 Project Overview

- **Region of Study**: Akanyaru River Basin, Rwanda
- **Timeframe**: Pre-flood (Jan 1–19, 2024) and During-flood (June 20–July 10, 2024)
- **Main Objective**: Assess the extent of cropland affected by flooding using satellite imagery and calculate potential economic loss from disrupted ecosystem services.

---

## 📊 Data Sources

| Dataset | Description | Source |
|--------|-------------|--------|
| **Sentinel-1 SAR (VV)** | Synthetic Aperture Radar (SAR) used to detect water surfaces | `COPERNICUS/S1_GRD` |
| **ESA WorldCover 2020** | Land cover classification; cropland class used | `ESA/WorldCover/v100` |
| **Akanyaru Study Area** | Custom shapefile defining the study boundary | Uploaded GEE asset |

---

## 🧠 Methodology

1. **Import and Clip Data**: Filter Sentinel-1 VV images to the study area.
2. **Define Time Periods**: Split analysis into pre-flood and during-flood time ranges.
3. **Flood Masking**: Apply threshold (-13 dB) to identify water-covered pixels.
4. **Cropland Overlay**: Isolate cropland pixels from WorldCover and identify flooded cropland.
5. **Area Calculation**: Use `ee.Image.pixelArea()` to estimate total and flooded areas.
6. **Economic Valuation**: Multiply cropland loss area (in ha) by estimated value per hectare.

---

## 🛠️ How to Use the Script

> 📂 Script file: [`akanyaru_flood_mapping.js`](./akanyaru_flood_mapping.js)

1. Open [Google Earth Engine Code Editor](https://code.earthengine.google.com/)
2. Create a new script and paste the contents of `akanyaru_flood_mapping.js`
3. Make sure the `akanyaru_study_area_cell` asset is uploaded to your account
4. Click "Run" to:
   - Display pre-flood and flood images
   - Show flood-affected cropland
   - Print cropland area values and ecosystem value loss in the console

---

## 📤 Output Examples

- 🟨 **Yellow**: Cropland (from ESA WorldCover)
- 🔵 **Blue**: Flooded areas
- 🔴 **Red**: Flooded cropland
- ✅ Console prints:
  - Total cropland (ha)
  - Flooded cropland (ha)
  - Remaining cropland
  - Estimated ecosystem value loss (USD)

---

## 📎 Citation and Contact

> **Developed by:** Dyna Uwambajimana  
> **Affiliation:** Climate Advocate Group Rwanda | Students For Liberty | GEOSAR  
> **Email:** dynamereki@gmail.com  
> **GitHub:** [@dynamerk](https://github.com/dynamerk)  
> **Year:** 2024

---

### 🔖 Citation (APA Style)

Uwambajimana, D. (2024). *Akanyaru Flood Mapping & Cropland Loss Assessment Using Google Earth Engine*. GitHub. https://github.com/dynamerk/akanyaru-flood-analysis

---

## 🌍 License

This project is for educational and research use only.  
Please cite appropriately if reused in academic work.

