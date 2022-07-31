import { saveItem, deleteItem, retrieveAll } from '../../database/database';

// POST: api/replace
export default async function handler(req, res) {

   // Take the already synced data from the request body
   let data = JSON.parse(req.body);

   // change id to _id
   data.forEach(item => {
      item._id = item.id;
      delete item.id;
   });

   // Wipe the complete database
   await deleteItem(undefined);

   // Save the new items
   await saveItem(data);

   /*
   data.forEach(async item => {
      // if item is already local, overwrite the one with older datemodified
      const isLocal = localItems.findIndex(localItem => localItem._id === item._id);
      if(isLocal && isLocal.datemodified > item.datemodified) {
         console.log(isLocal.name, 'is already local, but has newer datemodified');
         await saveItem(isLocal);
      } else {
         // add new item
         console.log('adding new item', item.name);
         await saveItem(item);
      }
   })*/

   res.status(200).json(data);
}