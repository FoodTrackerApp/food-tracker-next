const Datastore = require("@seald-io/nedb");
var db = {};

db.items = new Datastore({ filename: `database/items.db`, autoload: true});
db.items.loadDatabase();

db.lastmod = new Datastore({ filename: "database/lastmod.db", autoload: true});
db.lastmod.loadDatabase();

const retrieveAll = () => {
    console.log("Database handler request");
    return new Promise((resolve, reject) => {
        db.items.find({}, function(err, docs) {
            console.log("database handler got items", docs)
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

const lastmod = {
    // return date string of last modification
    get: () => {
        return new Promise((resolve, reject) => {
            db.lastmod.findOne({}, function(err, doc) {
                if(!err) {
                    resolve(doc);
                } else {
                    reject(err);
                }
            })
        })
    }

    // set new date string as last modification
    , set: (date) => {
        return new Promise((resolve, reject) => {
            db.lastmod.update({}, {date: date}, {upsert: true}, function(err, numReplaced) {
                if(!err) {
                    resolve(numReplaced);
                } else {
                    reject(err);
                }
            })
        })
    }
}

export { retrieveAll, saveItem, updateItem, deleteItem, lastmod }