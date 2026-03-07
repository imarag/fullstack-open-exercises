const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = encodeURIComponent(process.argv[2])
const ATLAS_DB = "phonebook"
const url = `mongodb+srv://ioannis95:${password}@clustermongo.wn3vaaa.mongodb.net/${ATLAS_DB}?appName=ClusterMongo`;

mongoose.set('strictQuery', false)
mongoose.connect(url)

console.log("Connected to the database...")

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('persons', personSchema)

if (process.argv.length === 5) {
    const personName = process.argv[3];
    const personNumber = process.argv[4];
    const newPerson = new Person({
        name: personName,
        number: personNumber
    })

    newPerson.save().then(result => {
        console.log(`added ${personName} number ${personNumber} to phonebook`)
        mongoose.connection.close()
    })
}
else if (process.argv.length === 3) {
    console.log("Phonebook:")
    Person.find({})
        .then(docs => {
            docs.forEach(doc => {
                console.log(`${doc.name} ${doc.number}`)
            })
            mongoose.connection.close();
        })
}
else {
    console.log("Please provide one argument (password) to view basic person info, or three arguments (password, new person's name, and number) to add a new person to the database!")
}
