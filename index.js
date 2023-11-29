const express=require("express");
const app=express();
const cors=require("cors");
const morgan=require("morgan");

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body);
  });

app.use(express.json())
app.use(cors())
app.use(express.static('dist'));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));



let persons=[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(request,response)=>{
    console.log("hi")
    response.send(persons);
})
app.get('/info',(request,response)=>{
    const info=`Phonebook has info for ${persons.length} people`;

    const timestamp = new Date();
      // Format day and month in words
    const dayInWords = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(timestamp);
    const monthInWords = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(timestamp);
  
    // Format the full timestamp
    const formattedTimestamp = `${dayInWords} ${monthInWords} ${timestamp.toLocaleString('en-US', { timeZone: 'UTC' })}`;
    console.log("details:",formattedTimestamp)
    console.log(typeof(formattedTimestamp))

    response.send(info);
})
app.get('/api/persons/:id',(request,response)=>{
    const id=Number(request.params.id);
    const person=persons.find(p=>p.id==id);
    if(person){

        return response.json(person);
    }
    response.status(404).json({error:"No user found"});

})
app.delete('/api/persons/:id',(request,response)=>{
    const id=Number(request.params.id);
    if(id){
        const newPersons=persons.filter(p=>p.id!==id);
        return response.json(newPersons);
    }
    response.status(404).json({error:"Invalid user"});

})
const setId=()=>{
    const newId=persons.length>0
    ? Math.floor(Math.random(persons.length)*10000)
    : 0;
    return newId;

}
app.post('/api/persons/',(request,response)=>{
    const body=request.body;
    console.log(body);
    let existingName=persons.find(person=>person.name==body.name)


    if(!body.name||!body.number){
        return response.status(404).json({error:"invalid content"})
    }else if(existingName){
        return response.status(404).json({error:"user already exists in the list"});
    }
    else{
        const person={
            name:body.name,
            number:body.number,
            id:setId()
        }

        persons=persons.concat(person)
        response.json(person)
    }

})

const PORT=process.env.PORT||3004
app.listen(PORT,()=>{
    console.log("Server running on the PORT",PORT);
})