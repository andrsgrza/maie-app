var fs = require("fs");
const path = require("path");

// Define the path to your JSON file
const jsonFilePath = path.join(__dirname, 'yourfile.json');

// Function to read JSON file
const readJsonFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      try {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      } catch (parseErr) {
        reject(parseErr);
      }
    });
  });
};

// Function to write JSON file
const writeJsonFile = (filePath, data) => {
  return new Promise((resolve, reject) => {
    const jsonString = JSON.stringify(data, null, 2); // Pretty-print JSON with 2 spaces
    fs.writeFile(filePath, jsonString, 'utf8', (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

// Function to read all files in a directory
const readFilesInDirectory = (dirPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        return reject(err);
      }

      // Filter out directories, if needed
      const filePaths = files
        .filter(file => fs.lstatSync(path.join(dirPath, file)).isFile())
        .map(file => path.join(dirPath, file));

      resolve(filePaths);
    });
  });
};

// Function to update JSON file
const updateJsonFile = async (filePath) => {
  try {
    const data = await readJsonFile(filePath);
    
    // Modify the JSON data as needed
    data.newKey = "newValue";

    await writeJsonFile(filePath, data);
    console.log('JSON file updated successfully');
  } catch (error) {
    console.error('Error updating JSON file:', error);
  }
};

// Call the update function
updateJsonFile(jsonFilePath);

module.exports = {
  readJsonFile,
  writeJsonFile,
  readFilesInDirectory,
  updateJsonFile
};
