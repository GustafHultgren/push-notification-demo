const Datastore = require('nedb')

const db = new Datastore({
  filename: `${__dirname}/subscriptions.db`,
  autoload: true
})

module.exports.subscriptionDao = {
  insert(subscription){
    return new Promise((resolve, reject) => {
      const newDocument = {...subscription, createdAt: Date.now()} 
      db.insert(subscription, (err, doc) => {
        if(err) reject(err)
        else resolve(doc)
      })
    })
  }
}







