const Datastore = require("@seald-io/nedb");
var db = {};

db.items = new Datastore({ filename: "database/items.db", autoload: true});
db.items.loadDatabase();

const retrieveAll = () => {
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
    return new Promise((resolve, reject) => {
        db.items.remove({_id: object._id}, {}, function(err, numRemoved) {
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

export { retrieveAll, saveItem, updateItem, deleteItem }