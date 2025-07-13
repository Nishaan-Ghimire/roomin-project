import express from 'express';
import client from '../elasticsearch/client.js';

const router = express.Router();

router.post('/search', async (req, res) => {
  const q1  = req.body;
  console.log('🔍 Search controller triggered:', req.body ,req.body.query);
  const q = q1.query;
  if (!q || typeof q !== 'string' || q.trim().length === 0) {
  return res.status(400).json({
    success: false,
    message: 'Search query is required',
    received: req.body,
    debug: {
        queryValue: q,
        queryType: typeof q
        
      }
  });
}


  try {
    console.log('>search query: ',q, typeof q);
    const result = await client.search({
      index: 'properties',
      body: {
        query: {
          multi_match: {
            query: q,
            fields: [
              'title^5',
              'city^4',
              'description^3',
              'landmark^2',
              'roomType^4'
            ],
            fuzziness: 'AUTO'
          }
        }
      }
    });
    console.log('>search result: ',result.hits.hits);
    const hits = result.hits.hits.map(hit => ({
  id: hit._id,
  ...hit._source,
  _score: hit._score // include score for comparison
}));

// Find the hit with the highest score
const highestScoreHit = hits.reduce((max, hit) => (hit._score > max._score ? hit : max), hits[0]);

console.log(">highestScoreHit: ", highestScoreHit);
res.status(200).json(highestScoreHit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
