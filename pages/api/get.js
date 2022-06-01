import { retrieveAll } from '../../database/database';

// GET: api/database/get

export default async function handler(req, res) {
    const retrieveHandle = async () => {
        const data = await retrieveAll();
        return data;
    }

    if(req.method === "GET") {
        
        // put in info in database API
        let data = await retrieveHandle();

        if(data.length === 0) {
            data = [];
        }
        res.status(200).json(data);
    }
}