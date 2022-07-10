import { retrieveAll } from '../../database/database';

// GET: api/database/get

export default async function handler(req, res) {
    console.log("Got get request");
    const retrieveHandle = async () => {
        const data = await retrieveAll();
        return data;
    }

    if(req.method === "GET") {
        let data;
        try {
            data = await retrieveHandle();
        } catch(e) {
            console.error("could not retrieve data",e);
            data = [];
        }

        if(data.length === 0) {
            console.log("Database is empty");
            data = [];
        }
        res.status(200).json(data);
    }
}