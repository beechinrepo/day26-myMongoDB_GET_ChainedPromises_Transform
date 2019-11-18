const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');

const url = 'mongodb://localhost:27017'

const client = new MongoClient(url, { useUnifiedTopology: true });

const PORT = parseInt(process.argv[2] || process.env.APP_PORT || process.env.PORT) || 3000;

const app = express();

app.use(morgan('tiny'));
app.use(cors());

app.get('/recipes',
    (req, resp) => {
        const limit = parseInt(req.query.limit) || 25;
        const offset = parseInt(req.query.offset) || 0;

        const p1 = client.db('food').collection('recipes')
                        .find({})
                        .limit(limit).skip(offset)
                        .toArray();
        const p2 = client.db('food').collection('recipes')
                        .find({})
                        .count();

        Promise.all([ p1, p2 ])
            .then(result => {
                // console.log('result: ', result);
                const others = result[0];
                const total = result[1];
                const recipes = others.map(v=> {
                    const other = {
                    _id: v['_id'],
                    name: v['name']
                    }
                    return other;
                })
                const answer = {
                    recipe: recipes,
                    offset: offset,
                    limit: limit,
                    total: total,
                    timestamp: new Date().getTime()
                }
                console.log('answer: ', answer)
                resp.status(200).type('application/json').json(answer);
            })
            .catch(error => {
                res.status(500).type('application/json').json(error);
            })
    }
)

app.get('/games/rank', 
    (req,res) => {
        const limit = parseInt(req.query.limit) || 25;
        const offset = parseInt(req.query.offset) || 0;
        const p1 = client.db('boardgames').collection('games')
                        .find({})
                        .limit(limit).skip(offset)
                        .sort({Rank:1})
                        .toArray();
        const p2 = client.db('boardgames').collection('games')
                        .find({})
                        .count();

        Promise.all([ p1, p2 ])
            .then(result => {
                // console.log('result: ', result);
                const others = result[0];
                const total = result[1];
                const games = others.map(v=> {
                    const other = {
                    game_id: v['_id'],
                    name: v['Name'],
                    rank: v['Rank']
                    }
                    return other;
                })
                const answer = {
                    games: games,
                    offset: offset,
                    limit: limit,
                    total: total,
                    timestamp: new Date().getTime()
                }
                console.log('answer: ', answer)
                resp.status(200).type('application/json').json(answer);
            })
            .catch(error => {
                res.status(500).type('application/json').json(error);
            })
    }
)

app.get('/game/:game_id',
    (req,res) => {
        const game_id = parseInt(req.params.game_id);
        const p1 = client.db('boardgames').collection('games')
            .find({ID: game_id})
            .toArray();
        Promise.all([ p1])
            .then(result => {
                // console.log('result: ', result[0]);
                const game = result[0];
                const answer = game.map(v => {
                    const all = {
                        game_id: v.ID,
                        name: v.Name,
                        year: v.Year,
                        rank: v.Rank,
                        average: v.Average,
                        users_rated: v['Users rated'],
                        url: v.URL,
                        thumbnail: v.Thumbnail,
                        timestamp: new Date().getTime()
                    }
                    return all;
                })
                const answers = answer;
                console.log('answer: ', answers)
                resp.status(200).type('application/json').json(answer);
            })
            .catch(error => {
                res.status(500).type('application/json').json(error);
            })
    })





client.connect((error, _) => {
    if (error) {
        console.error('Cannot connect to MongoDB: ', error)
        return process.exit(-1);
    }

    app.listen(PORT, () => {
        console.info(`Application started at ${PORT} on ${new Date()}`)
    })
});