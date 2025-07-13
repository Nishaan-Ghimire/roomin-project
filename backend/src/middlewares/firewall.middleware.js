// waf/index.js
const dangerousPatterns = [
  // SQL Injection
  /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
  /\b(OR|AND)\b\s+\d+=\d+/i,
  /\bUNION\b.*\bSELECT\b/i,
  /\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b/i,

  // NoSQL Injection
  /\$\w+\s*:/,                       // {$ne: ...}, {$gt: ...}
  /\bne\b|\blt\b|\bgt\b/i,

  // XSS
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i,
  /<.*on\w+\s*=.*>/i,
  /javascript:/i,
  /\b(alert|confirm|prompt)\s*\(/i,
  /document\.cookie/i,
  /<iframe|<object|<embed/i,

  // SSRF / suspicious URLs
  /\b(http|https|ftp):\/\/(127\.0\.0\.1|localhost|0\.0\.0\.0|169\.254|::1)/i,

  // Headers
  /\bReferer\b.*evil\.com/i
];

const isMalicious = (value) => {
  if (typeof value !== 'string') return false;
  return dangerousPatterns.some(pattern => pattern.test(value));
};

const deepScan = (obj) => {
  for (const key in obj) {
    const val = obj[key];
    if (typeof val === 'object' && val !== null) {
      if (deepScan(val)) return true;
    } else if (isMalicious(String(val))) {
      return true;
    }
  }
  return false;
};

const wafMiddleware = (req, res, next) => {
  const inputsToScan = {
    body: req.body,
    query: req.query,
    params: req.params,
    headers: req.headers,
  };

  for (const section in inputsToScan) {
    if (deepScan(inputsToScan[section])) {
      console.warn(`🚨 Blocked suspicious input from ${req.ip} in ${section}`);
      return res.status(403).json({
        status: 'Blocked',
        reason: `Malicious input detected in ${section}`,
        tip: 'Try not to hack us. We’re watching 😈'
      });
    }
  }

  next();
};

export default wafMiddleware;
