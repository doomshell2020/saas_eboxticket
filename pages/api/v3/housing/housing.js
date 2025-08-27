import {
    search_Housing, View_HousingNew, view_HousingByIdNew, View_HousingBedTypes, view_HouseDetail, addOrUpdateHousing, view_HousingImage, getHousingByStatus, View_HousingNeighborhood, View_HousingTypes,
    addUpdateHousing, getAssignedHousing, View_HousingAmenities
} from "@/shared/services/admin/housing/housingservices";
import { add_new_housing, add_new_housingV3, updateHousingNew, updateHousingNewV3, deleteHousingImage, deleteHousing } from "@/shared/services/admin/housing/housing_services";
import { checkApiKey } from '@/middleware/checkApiKey';


const handler = async (req, res) => {
    return checkApiKey(req, res, async () => {
        try {
            const { method, query } = req;

            switch (method) {

                case "POST": {
                    try {
                        const housingAdd = await add_new_housingV3(req.body, req.body.ImageURL, res);
                    } catch (error) {
                        console.error('Outer Error:', error);
                        return res.status(500).json({ success: false, message: 'Internal Server Error: ' + error.message });
                    }
                    break;
                }
                case "GET": {
                    return res.status(500).json({ success: false, message: 'Internal Server Error' });
                    break;
                }
                case "PUT": {
                    const { id } = query;
                   
                    try {
                        const housingAdd = await updateHousingNewV3(id, req, res);
                    } catch (error) {
                        console.error('Outer Error:', error);
                        return res.status(500).json({ success: false, message: 'Internal Server Error: ' + error.message });
                    }
                    break;
                }
                case "DELETE": {
                    return res.status(500).json({ success: false, message: 'Internal Server Error' });
                    break;
                }
                default:
                    res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
                    res.status(405).end(`Method ${method} Not Allowed`);
                    break;
            }
        } catch (err) {
            res.status(400).json({
                error_code: "api_one",
                success: false,
                message: err.message,
            });
        }
    });
};

export default handler;