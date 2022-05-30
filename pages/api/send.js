import { updateItem, saveItem } from '../../database/database';

// POST: api/send
export default async function handler(req, res) {

    const sendHandle = async (item) => {
        const res = await saveItem(item);
        return res;
    }

    const updateHandle = async (item) => {
        const res = await updateItem(item);
        return res;
    }

    if(req.method === 'POST') {
        const item = req.body;

        try {
            if(!item.toUpdate) {
                const data = await sendHandle(item);
                const resBody = {
                    success: true,
                    ...data,
                }
                res.status(200).json(resBody);
            } else {
                const data = await updateHandle(item);
                const resBody = {
                    success: true,
                    numberUpdated: data,
                }
                res.status(200).json(resBody);
            }
        } catch (e) {
            const errorBody = {
                error: e,
                success: false,
            }
            res.status(500).json(errorBody);
        }
    }
}