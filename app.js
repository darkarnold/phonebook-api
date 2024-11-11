const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
morgan.token("body", (req) => JSON.stringify(req.body));

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :body",
    {
      skip: (req) => req.method !== "POST",
    }
  )
);

let contacts = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-64231226",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(contacts);
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${contacts.length} people</p>
   
    <p>${new Date()}</p>
    `
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const contact = contacts.find((contact) => contact.id === id);

  if (contact) {
    response.json(contact);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  contacts = contacts.filter((contact) => contact.id !== id);
  response.status(204).end();
});

const generateId = () => {
  return String(Math.floor(Math.random() * 1000000000));
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: " name and number are required",
    });
  }

  if (contacts.find((contact) => contact.name === body.name)) {
    return response.status(409).json({
      error: "name must be unique",
    });
  }

  const contact = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  contacts = contacts.concat(contact);

  console.log(`Added ${contact.name} with number ${contact.number}`);
  response.status(201).json(contact);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});
