import fs from "fs";

export function readJsonFile(filePath) {
  if (fs.existsSync(filePath)) {
    try {
      const rawData = fs.readFileSync(filePath, "utf8");
      if (rawData) {
        return JSON.parse(rawData);
      }
    } catch (err) {
      console.log(`Couldn't open a file with path ${filePath}: ${err}`);
      return [];
    }
  }
  return [];
}

export function writeJsonFile(filePath, data) {
  if (fs.existsSync(filePath)) {
    try {
      fs.writeFileSync(filePath, data);
      return true;
    } catch (err) {
      console.log(
        `Couldn't write ${data} data into a file with path ${filePath}: ${err}`,
      );
      return false;
    }
  }
  return false;
}
