import client from './client.js';
import { propertyIndexMapping } from './mapping.js';

export async function createIndexIfNotExists() {
  const index = 'properties';
  const exists = await client.indices.exists({ index });

  if (!exists) {
    await client.indices.create({
      index,
      body: propertyIndexMapping
    });
    console.log('✅ properties index created');
  } else {
    console.log('ℹ️ properties index already exists');
  }
}

