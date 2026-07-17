import fs from 'fs';

export function readJsonFile(filePath, defaultData = null) {
  try {
    if (!fs.existsSync(filePath)) {
      return defaultData;
    }
    const rawData = fs.readFileSync(filePath, "utf8");
    if (!rawData) {
      return defaultData;
    }
    return JSON.parse(rawData);
  } catch (err) {
    console.error(`Error reading JSON file at ${filePath}:`, err);
    return defaultData;
  }
}

export function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error(`Error writing JSON file at ${filePath}:`, err);
    return false;
  }
}
