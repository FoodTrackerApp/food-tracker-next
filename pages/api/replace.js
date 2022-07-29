import { saveItem, deleteItem } from '../../database/database';

// POST: api/send
export default async function handler(req, res) {

   // Take the data from the request
   let data = JSON.parse(req.body);

   console.log(typeof data, data);

   // change id to _id
   data.forEach(item => {
      item._id = item.id;
      delete item.id;
   });

   // Wipe the complete database
   await deleteItem(undefined);

   // Save the new data
   await saveItem(data);

   res.status(200).json(data);
}