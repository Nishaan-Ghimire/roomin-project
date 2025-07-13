import Property from '../models/properties.model.js';

export const searchProperties = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({ message: 'Query parameter `q` is required' });
    }

    const results = await Property.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });

    res.status(200).json({ success: true, properties: results });
  } catch (err) {
    console.error('Full-text search error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};