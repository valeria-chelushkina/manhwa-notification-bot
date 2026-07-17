import fs from "fs";
import { parse } from "path";

export function readJsonFile(filePath, defaultData = null) {
  try {
    if (!fs.existsSync(filePath)) {
      return defaultData;
    }
    const rawData = fs.readFileSync(filePath, "utf8");
    if (!rawData) {
      return defaultData;
    }

    let parsedData = JSON.parse(rawData);
    if (!Array.isArray(parsedData)) {
      let tempData = [];
      tempData.push(parsedData);
      parsedData = tempData;
    }
    return parsedData;
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
