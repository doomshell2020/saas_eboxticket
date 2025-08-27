import { ApiSubscription, EventOrganiser } from '@/database/models';
import { Op } from 'sequelize';

export async function checkApiKey(req, res, next) {
    try {
        const apiKey = req.headers['x-api-key'] || req.query.api_key;
        const origin = req.headers['origin'] || ''; // Origin header from browser requests

        if (!apiKey) {
            return res.status(401).json({ success: false, message: 'API key is required' });
        }

        // Find active API key that has been used before (last_used NOT null)
        const keyRecord = await ApiSubscription.findOne({
            where: {
                key_hash: apiKey,
                status: 'active',
                // last_used: {
                //     [Op.ne]: null
                // }
            },
            // attributes: ['id', 'allowed_domains']
            include: [{ model: EventOrganiser, as: 'organiser' }],
        });

        // console.log('>>>>>',keyRecord);
        


        if (!keyRecord) {
            return res.status(403).json({ success: false, message: 'Invalid, inactive, or unused API key' });
        }

        // Domain check (if allowed_domains is set)
        if (keyRecord.allowed_domains) {
            const allowedDomains = keyRecord.allowed_domains
                .split(',')
                .map(d => d.trim().toLowerCase());

            let originHost = origin.toLowerCase();

            // Strip protocol from origin (http:// or https://)
            if (originHost.startsWith('http://')) originHost = originHost.slice(7);
            else if (originHost.startsWith('https://')) originHost = originHost.slice(8);

            // Remove trailing slash if any
            originHost = originHost.replace(/\/$/, '');

            // Use 'null' string for empty origin (e.g. Postman)
            const originForCheck = originHost || 'null';

            if (!allowedDomains.includes(originForCheck)) {
                return res.status(403).json({ success: false, message: 'Domain not allowed' });
            }
        }


        // Update last used timestamp
        await keyRecord.update({ last_used: new Date() });

        // Attach organiser to request for further use
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
