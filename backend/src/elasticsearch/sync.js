import client from './client.js';

export const indexProperty = async (property) => {
  await client.index({
    index: 'properties',
    id: property._id.toString(),
    body: {
      title: property.title,
      city: property.city,
      landmark: property.landmark,
      description: property.description,
      roomType: property.roomType,
      price: property.price,
      status: property.status,
      location: property.location
    }
  });
};

export const removeProperty = async (id) => {
  await client.delete({
    index: 'properties',
    id: id.toString()
  });
};
