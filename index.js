const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;



// middleware


// Task-Management
// QUl1QKIrS9eGhQJx

app.use(cors());
app.use(express.json());



console.log();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6ouqbod.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const TaskManagementCollection = client.db('taskDB').collection('createTask');


    app.get('/getTask/:email', async (req, res) => {
        const email = req.params.email;
        console.log(email);
        const query = { email: email };
        const user = await TaskManagementCollection.find(query).toArray();
       
        res.send(user);
      })
    
    app.get('/updateTask', async (req, res) => {
        const result = await TaskManagementCollection.find().toArray();
        res.send(result);
      })


      app.delete('/task/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await TaskManagementCollection.deleteOne(query);
        res.send(result)
    })



      app.put('/update/:id', async(req, res) => {
        console.log(req.params)
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = { upsert: true };
        const Update = req.body;
        const task = {
          $set: {
            email: Update.email,
              title: Update.title,
             deadline: Update.deadline, 
             priority: Update.priority, 
             description: Update.description,
              
              
          }
        }
        const result = await TaskManagementCollection.updateOne(filter, task, options);
        res.send(result);
      })




 
    // app.get('/getTask', async (req, res) => {
    //     const result = await TaskManagementCollection.find().toArray();
    //     res.send(result);
    //   })



    app.post('/createTask', async (req, res) => {
        const addNewTask = req.body;
        console.log(addNewTask);
        const result = await TaskManagementCollection.insertOne(addNewTask);
        res.send(result);
  
      })


    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res)=>{
res.send('Task Management is running')
})

app.listen(port, () => {
    console.log(`Task management is running on port ${port}`);
})