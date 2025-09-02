import { ApiSubscription, EventOrganiser } from '@/database/models';
import { Op } from 'sequelize';

export async function checkApiKey(req, res, next) {
    try {
        const apiKey = req.headers['x-api-key'] || req.query.api_key;
        const origin = req.headers['origin'] || ''; // Origin header (browser requests)

        if (!apiKey) {
            return res.status(401).json({ success: false, message: 'API key is required' });
        }

        // 🔍 Find active key
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

        // ✅ Domain check (if domains are restricted)
        if (keyRecord.allowed_domains) {
            const allowedDomains = keyRecord.allowed_domains
                .split(',')
                .map(d => d.trim().toLowerCase());

            let originHost = origin.toLowerCase();

            // Remove protocol
            if (originHost.startsWith('http://')) originHost = originHost.slice(7);
            else if (originHost.startsWith('https://')) originHost = originHost.slice(8);

            // Remove trailing slash
            originHost = originHost.replace(/\/$/, '');

            // Strip port if present (e.g., localhost:3000 → localhost)
            const [hostWithoutPort] = originHost.split(':');

            // Handle empty origin (Postman, cURL, server-to-server calls)
            const originForCheck = hostWithoutPort || 'null';

            // 🔍 Debug logs
            console.log('🔑 API Key Check');
            console.log('Origin header:', origin);
            console.log('Processed host:', originForCheck);
            console.log('Allowed domains:', allowedDomains);

            // Match exact OR allow wildcard (*.domain.com)
            const isAllowed = allowedDomains.some(d => {
                if (d === originForCheck) return true; // Exact match
                if (d.startsWith('*.')) {
                    const domain = d.slice(2); // remove *.
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

        // Update last used timestamp
        await keyRecord.update({ last_used: new Date() });

        // Attach organiser to request
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
