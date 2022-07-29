import { lastmod } from '../../database/database';

// GET: api/lastmod

export default async function handler(req, res) {
    console.log("Got get request");

    if(req.method === "GET") {
        let data;
        try {
            data = await lastmod.get();
        } catch(e) {
            console.error("could not retrieve data",e);
            data = 0;
        }

        if(data.length === 0) {
            console.log("Database is empty");
            data = 0;
        }
        res.status(200).json(data);
    }


    else if(req.method === "SET") {
        let newDate = req.body.date;
        let res = 304;
        try {
            await lastmod.set(newDate);
            res = 200;
        } catch(e) {
            console.error("could not set new date",e);
            res = 500;
        }

        res.status(res);

    }
}