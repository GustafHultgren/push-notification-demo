const Datastore = require('nedb')

const db = new Datastore({
  filename: `${__dirname}/subscriptions.db`,
  autoload: true
})

module.exports.subscriptionDao = {
  insert(subscription){
    return new Promise((resolve, reject) => {
      // TODO: use newDocument
      const newDocument = {...subscription, createdAt: Date.now()} 
      db.insert(subscription, (err, doc) => {
        if(err) reject(err)
        else resolve(doc)
      })
    })
  },
  findByUserId(userId){
    return new Promise((resolve, reject) => {
      db.find({userId}, (err, docs) => {
        if(err) reject(err)
        else resolve(docs)
      })
    })
  },
  deleteByUserId(userId){
    return new Promise((resolve, reject) => {
      db.remove({userId}, { multi: true }, (err, numRemoved) => {
        if(err) reject(err)
        else resolve(numRemoved)
      })
    })
  }
}







