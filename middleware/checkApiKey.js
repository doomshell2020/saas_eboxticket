import { ApiSubscription, EventOrganiser } from '@/database/models';

export async function checkApiKey(req, res, next) {
  try {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;

    // ✅ Use Origin → else Referer → else empty
    const origin = req.headers['origin'] || req.headers['referer'] || '';

    if (!apiKey) {
      return res.status(401).json({ success: false, message: 'API key is required' });
    }

    const keyRecord = await ApiSubscription.findOne({
      where: {
        key_hash: apiKey,
        status: 'active',
      },
      include: [{ model: EventOrganiser, as: 'organiser' }],
    });

    if (!keyRecord) {
      return res.status(403).json({ success: false, message: 'Invalid or inactive API key' });
    }

    // ✅ Domain check
    if (keyRecord.allowed_domains) {
      const allowedDomains = keyRecord.allowed_domains
        .split(',')
        .map((d) => d.trim().toLowerCase());

      let originHost = '';

      try {
        // Proper parse (handles http/https + strips path/query automatically)
        if (origin) {
          originHost = new URL(origin).hostname.toLowerCase();
        }
      } catch {
        // If invalid/missing → fallback
        originHost = origin.toLowerCase();
      }

      // ⚡️ If still empty → treat as 'null' (Postman, curl, server-to-server)
      const originForCheck = originHost || 'null';

      console.log('🔑 API Key Check');
      console.log('Origin header:', origin || '(not provided)');
      console.log('Processed host:', originForCheck);
      console.log('Allowed domains:', allowedDomains);

      const isAllowed = allowedDomains.some((d) => {
        if (d == originForCheck) return true; // exact match
        if (d.startsWith('*.')) {
          const domain = d.slice(2); // e.g. *.eboxtickets.com → eboxtickets.com
          return originForCheck.endsWith(domain);
        }
        return false;
      });

      if (!isAllowed) {
        return res.status(403).json({
          success: false,
          message: `Domain not allowed`,
          got: originForCheck,
          allowed: allowedDomains,
        });
      }
    }

    await keyRecord.update({ last_used: new Date() });
    req.organizer = keyRecord.organiser;

    next();
  } catch (error) {
    console.error('API key check failed:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}





// import { ApiKey, EventOrganiser } from '@/database/models';

// export async function checkApiKey(req, res, next) {
//   try {
//     const apiKey = req.headers['x-api-key'] || req.query.api_key;

//     if (!apiKey) {
//       return res.status(401).json({ success: false, message: 'API key is required' });
//     }

//     const keyRecord = await ApiKey.findOne({
//       where: { key_hash: apiKey, status: 'active' },
//       include: [{ model: EventOrganiser, as: 'organiser' }],
//     });

//     if (!keyRecord) {
//       return res.status(403).json({ success: false, message: 'Invalid or inactive API key' });
//     }

//     await keyRecord.update({ last_used: new Date() });

//     req.organiser = keyRecord.organiser;

//     next();
//   } catch (error) {
//     console.error('API key check failed:', error);
//     return res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// }
