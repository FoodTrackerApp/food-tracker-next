
// GET: api/ping

export default async function handler(req, res) {
    console.log("Got ping");

    res.status(200).send();
    
}