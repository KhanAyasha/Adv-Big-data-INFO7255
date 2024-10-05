import crypto from 'crypto';  // To generate ETag
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { Validator } from "jsonschema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const validateJson = (data) => {
    
    const schemaPath = resolve(__dirname, "./schema.json");
    const schemaData = readFileSync(schemaPath, "utf-8");
    const jsonSchema = JSON.parse(schemaData);

    const validator = new Validator();
    const validationResult = validator.validate(data, jsonSchema);

    
    if (validationResult.errors.length > 0) {
        return validationResult.errors;
    }
    return null;  // No errors
};

// Function to generate ETag or hash of the plan
export const generateETag = (data) => {
    return `"${crypto.createHash('md5').update(JSON.stringify(data)).digest('hex')}"`;
};


