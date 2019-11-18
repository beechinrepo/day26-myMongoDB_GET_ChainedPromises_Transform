const cors = require('cors');

// Extract, Load, Transform
//Load mongo driver
const MongoClient = require('mongodb').MongoClient;

// Connection string
const URL = 'mongodb://localhost:27017';

// Create a new instance of client/pool
const client = new MongoClient(URL, {useUnifiedTopology: true});

const app = express();

app.get('/recipes', express.json(),
    (req,res) => {
        const limit = req.params.limit || 25;
        const offset = req.params.offset || 0;
        const p1 = client.db('food').collection('recipes')
                    .find({})
                    .limit(limit).skip(offset)
                    .toArray();
        const p1 = client.db('food').collection('recipes')
        .find({})
        .limit(limit).skip(offset)
        .toArray();
    })

// const fields= ['tags', 'nutrition', 'steps', 'ingredients'] // json is double quotes
const fields = ['_id', 'name', 'submitted', 'tags']
const fields2 = ['tags', 'nutrition', 'submitted', 'tags']

// Open a pool connect to db
client.connect(
    (err) => {
        if (err)
            throw err;
        console.info('connected');
        client.db('food').collection('recipes')
            .find({}).sort({submitted:-1})
            .limit(10)
            .forEach(r => {
                for (let t of fields){
                    r[t].replace("'", "\"")
                }
                r['_id'] = JSON.parse(r['_id']);
                r['name'] = JSON.parse(r['name']);
                r['submitted'] = JSON.parse(r['submitted']);
                r['tags'] = JSON.parse(['tags']);
            })
            .forEach(r => {
                for (let t of fields2){
                    r[t] = r[t].replace("'", "\"")
                }
                r['_id'] = JSON.parse(r['_id']);
                r['name'] = JSON.parse(r['name']);
                r['submitted'] = JSON.parse(r['submitted']);
                r['tags'] = JSON.parse(['tags']);
            })
            // .toArray()
            .then(result => {
                console.log('result: ', result)
            })
            .catch(error => {
                console.log('error: ', error)
            })
        


    }
)
