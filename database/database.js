const Datastore = require("@seald-io/nedb");
var db = {};

db.items = new Datastore({ filename: `database/items.db`, autoload: true});
db.items.loadDatabase();

const retrieveAll = () => {
    console.log("retrieving all items");
    return new Promise((resolve, reject) => {
        db.items.find({}, function(err, docs) {
            if(!err) {
                resolve(docs);
            } else {
                reject(err);
            }
        })
    })
}

const saveItem = (item) => {
    console.log("saving item", item);
    return new Promise((resolve, reject) => {
        db.items.insert(item, function(err, savedItems) {
            if(!err) {
                resolve(savedItems);
            } else {
                reject(err);
            }
        })
    })
}

const updateItem = (item) => {
    console.log("updating item", item);
    return new Promise((resolve, reject) => {
        const id = item._id;
        delete item.id
        db.items.update({_id: id}, item, {}, function(err, numReplaced) {
            if(!err) {
                resolve(numReplaced);
                db.items.compactDatafile();
            } else {
                reject(err);
            }
        })
    })
}

const deleteItem = (object) => {
    console.log("deleting item", object);
    return new Promise((resolve, reject) => {

        let query = object != undefined ? {_id: object._id} : {};

        db.items.remove(query, {multi: true }, function(err, numRemoved) {
            if(!err) {
                resolve(numRemoved);
                // refresh database
                db.items.persistence.compactDatafile();
                
            } else {
                reject(err);
            }
        })
    })
}

export { retrieveAll, saveItem, updateItem, deleteItem };