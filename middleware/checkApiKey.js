import { ApiSubscription, EventOrganiser } from '@/database/models';
import { Op } from 'sequelize';

export async function checkApiKey(req, res, next) {
    try {
        const apiKey = req.headers['x-api-key'] || req.query.api_key;

        // ✅ Use Origin OR Referer OR empty
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
                .map(d => d.trim().toLowerCase());

            let originHost = origin.toLowerCase();

            if (originHost.startsWith('http://')) originHost = originHost.slice(7);
            else if (originHost.startsWith('https://')) originHost = originHost.slice(8);

            originHost = originHost.replace(/\/$/, '');
            const [hostWithoutPort] = originHost.split(':');

            // ⚡️ If origin empty → fallback to 'null'
            const originForCheck = hostWithoutPort || 'null';

            console.log('🔑 API Key Check');
            console.log('Origin header:', origin || '(not provided)');
            console.log('Processed host:', originForCheck);
            console.log('Allowed domains:', allowedDomains);

            const isAllowed = allowedDomains.some(d => {
                if (d === originForCheck) return true;
                if (d.startsWith('*.')) {
                    const domain = d.slice(2);
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
