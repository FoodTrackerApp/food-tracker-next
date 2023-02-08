import { saveItem, deleteItem, retrieveAll } from '../../database/database';

// POST: api/replace
export default async function handler(req, res) {

   // Take the already synced data from the request body
   let data = JSON.parse(req.body);
   console.log("new data", data);

   // change id to _id
   data.forEach(item => {
      item._id = item.id;
      delete item.id;
   });

   // Wipe the complete database
   await deleteItem(undefined);

   // Save the new items
   await saveItem(data);

   res.status(200).json(data);
}