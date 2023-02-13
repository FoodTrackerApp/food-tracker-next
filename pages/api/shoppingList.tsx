

export default async function handler(req, res) {

    if(req.method === "GET") {
        console.log("Got shopping list get request")
        res.status(200);
    }

    if(req.method === "POST") {
        console.log("Got shopping list post request")
        res.status(200);
    }
}