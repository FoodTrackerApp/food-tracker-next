import { retrieveAll } from '../../database/database';

// GET: api/database/get

export default async function handler(req, res) {
    console.log("Got get request");
    const retrieveHandle = async () => {
        const data = await retrieveAll();
        return data;
    }

    if(req.method === "GET") {
        
        // put in info in database API
        let data = await retrieveHandle();
        console.log("Sending data:", data);

        if(data.length === 0) {
            console.log("Database is empty");
            data = [];
        }
        res.status(200).json(data);
    }
}