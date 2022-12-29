const express = require('express')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mar6xi9.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
       const users = client.db('instabook-server').collection('users');
       const posts = client.db('instabook-server').collection('posts');
       const comments = client.db('instabook-server').collection('comments');
       const react = client.db('instabook-server').collection('reacts');
       
       
//Posts DATA
        app.post('/posts', async(req, res)=>{
            const upload = req.body;
            const result = await posts.insertOne(upload);
            res.send(result);
        })

        app.get('/posts', async(req, res) =>{
            query ={}
            const postData = await posts.find(query).sort({
                time:-1
            }).toArray()
            res.send(postData);
        });

        app.get('/posts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const post = await posts.findOne(query);
            res.send(post);
        });

        app.post('/comments', async(req, res)=>{
            const commentUp = req.body;
            const result = await comments.insertOne(commentUp);
            res.send(result);
        });

        app.get('/comments', async(req, res) =>{
            query ={}
            const commentData = await comments.find(query).sort({
                time:-1
            }).toArray()
            res.send(commentData);
        });


//AllUser Collection
        app.post('/users', async(req, res)=>{
            const userData = req.body;
            const result = await users.insertOne(userData);
            res.send(result);
        })

        app.get('/users', async(req, res) =>{
            const query = {};
            const user = await users.find(query).toArray();
            res.send(user);
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const userId = await users.findOne(query);
            res.send(userId);
        });

        app.get('/userdata', async(req, res)=>{
            let query ={};
            if(req.query.email){
                query={
                    email: req.query.email
                }
            }
            const cursor = users.find(query)
            .sort({
                time:-1
            })
            const userDetails = await cursor.toArray();
            res.send(userDetails);
        });

        //Edit User
        app.patch("/edituser/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updatedName = req.body.updatedName;
      
            const newName = {
              $set: {
                displayName: updatedName,
              },
            };
            const result = await users.updateOne(filter, newName);
            res.send(result);
        });

        app.patch("/editemail/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updatedEmail = req.body.updatedEmail;
      
            const newEmail = {
              $set: {
                email: updatedEmail,
              },
            };
            const result = await users.updateOne(filter, newEmail);
            res.send(result);
        });

        app.patch("/edituni/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updatedUni = req.body.updatedUni;
      
            const newUni = {
              $set: {
                university: updatedUni,
              },
            };
            const result = await users.updateOne(filter, newUni);
            res.send(result);
        });

        app.patch("/editadd/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updatedAdd = req.body.updatedAdd;
      
            const newAdd = {
              $set: {
                address: updatedAdd,
              },
            };
            const result = await users.updateOne(filter, newAdd);
            res.send(result);
        });

        
        
    }
    finally{

    }
}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log('Example app listening on port', port)
})