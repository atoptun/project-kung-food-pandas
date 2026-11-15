import * as path from 'node:path';

import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import * as fs from 'fs';
import winston from 'winston';

import { PrismaClient } from '../src/generated/prisma/client.js';

// 🛠️ Настройка логгера через Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] [${level}]: ${message}`;
    }),
  ),
  transports: [
    new winston.transports.Console(),
    // Optional: logging everything to a file
    // new winston.transports.File({ filename: 'logs/import.log' }),
  ],
});

const envPath = path.resolve(process.cwd(), '../../.env');

const result = dotenv.config({ path: envPath });

if (result.error) {
  throw result.error;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({ adapter });

const TARGET_DIRECTORY = './data';

// Simple script to import reference data from CSV files into PostgreSQL using Prisma ORM.
function parseCSV(filePath: string): Record<string, string>[] {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split(/\r?\n/).filter((line) => line.trim() !== '');

  if (lines.length === 0) return [];

  // Parse headers from the first line
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const results: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const row: string[] = [];
    let insideQuotes = false;
    let currentValue = '';

    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      const char = line[charIndex];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        row.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    row.push(currentValue.trim());

    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      let val = row[index] !== undefined ? row[index] : '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }
      obj[header] = val;
    });
    results.push(obj);
  }

  return results;
}

async function main() {
  logger.info('🚀 Begining import dictionaries from CSV in PostgreSQL...');

  const rootDir = process.cwd();
  const dirPath = path.resolve(rootDir, TARGET_DIRECTORY);

  if (!fs.existsSync(dirPath)) {
    logger.error(`❌ Erorr: Folder "${dirPath}" not exist!`);
    process.exit(1);
  }

  // Import Categories
  const categoriesPath = path.join(rootDir, 'categories.csv');
  if (fs.existsSync(categoriesPath)) {
    const categories = parseCSV(categoriesPath);
    logger.info(`📂 Categories found in CSV: ${categories.length}`);

    for (const cat of categories) {
      await prisma.category.upsert({
        where: { id: cat.id },
        update: { name: cat.name },
        create: { id: cat.id, name: cat.name },
      });
    }
    logger.info('✅ Categories have been successfully imported.');
  } else {
    logger.warn(`⚠️ The file categories.csv was not found in the directory ${TARGET_DIRECTORY}`);
  }

  // Import Areas
  const areasPath = path.join(rootDir, 'areas.csv');
  if (fs.existsSync(areasPath)) {
    const areas = parseCSV(areasPath);
    logger.info(`📂 Regions found in CSV: ${areas.length}`);

    for (const area of areas) {
      await prisma.area.upsert({
        where: { id: area.id },
        update: { name: area.name },
        create: { id: area.id, name: area.name },
      });
    }
    logger.info('✅ The regions have been successfully imported.');
  } else {
    logger.warn(`⚠️ The file areas.csv was not found in the directory ${TARGET_DIRECTORY}`);
  }

  // Import Ingredients
  const ingredientsPath = path.join(rootDir, 'ingredients.csv');
  if (fs.existsSync(ingredientsPath)) {
    const ingredients = parseCSV(ingredientsPath);
    logger.info(`📂 Ingredients found in CSV: ${ingredients.length}`);

    for (const ing of ingredients) {
      await prisma.ingredient.upsert({
        where: { id: ing.id },
        update: {
          name: ing.name,
          description: ing.description || null,
          img: ing.img || null,
        },
        create: {
          id: ing.id,
          name: ing.name,
          description: ing.description || null,
          img: ing.img || null,
        },
      });
    }
    logger.info('✅ Ingredients successfully imported.');
  } else {
    logger.warn(`⚠️ The file categories.csv was not found in the directory ${TARGET_DIRECTORY}`);
  }

  logger.info('🎉 Data import is now complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error importing data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
