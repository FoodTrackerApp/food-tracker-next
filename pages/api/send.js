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
        const reqBody = req.body;
        const item = reqBody;
        console.log("got post request", item);
        try {
            if(!item.toUpdate) {
                console.log("Adding new item");
                const data = await sendHandle(item);
                const resBody = {
                    success: true,
                    ...data,
                }
                res.status(200).json(resBody);
            } else {
                console.log("Updating item");
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