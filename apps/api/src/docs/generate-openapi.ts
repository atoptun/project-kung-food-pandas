import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import YAML from 'yaml';

import { generateOpenApiDocument } from './openapi';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '../../openapi.yaml');

const document = generateOpenApiDocument();
const yamlContent = YAML.stringify(document);

fs.writeFileSync(outputPath, yamlContent, 'utf8');
console.log(`Generated OpenAPI specification at ${outputPath}`);
