import { updateItem } from '../../database/database';

// DELETE: api/delete
export default async function handler(req, res) {

    const updateHandle = async (item) => {
        const res = await updateItem(item);
        return res;
    }

    if(req.method === "DELETE") {
        const reqBody = req.body;

        try {
            let newItem = {...reqBody};

            // make sure deleted is set to 1
            newItem.deleted = 1;

            // update item in database
            await updateHandle(newItem);

            res.status(200).json({success: true, data: newItem});
        } catch(e) {
            res.status(500).json({
                error: e,
                success: false,
            })
        }
    }
}