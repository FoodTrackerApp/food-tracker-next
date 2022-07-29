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

        res.status(200).json(data.date);
    }


    else if(req.method === "POST") {
        let newDate = req.body.date;
        let rescode = 304;
        try {
            await lastmod.set(newDate);
            rescode = 200;
        } catch(e) {
            console.error("could not set new date",e);
            rescode = 500;
        }

        res.status(rescode).json(newDate);

    }
}