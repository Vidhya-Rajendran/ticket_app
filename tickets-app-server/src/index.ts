import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from 'express';
import cors from "cors";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/api/tickets", async (req, res) => {
  const tickets = await prisma.ticket.findMany();
  res.json(tickets);
});

app.post("/api/tickets", async(req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400).send("title and content fields required");
  }

  try {
    const ticket = await prisma.ticket.create({
      data: { title, content },
    });
    res.json(ticket);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});

app.put("/api/tickets/:id", async(req, res) => {
  const { title, content } = req.body;
  const id = parseInt(req.params.id);

  if (!title || !content) {
    res.status(400).send("title and content fields required");
  }

  if (!id || isNaN(id)) {
     res.status(400).send("ID must be a valid number");
  }

  try {
    const updatedNote = await prisma.ticket.update({
      where: { id },
      data: { title, content },
    });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});

app.delete("/api/tickets/:id", async(req, res) => {
  const id = parseInt(req.params.id);

  if (!id || isNaN(id)) {
   res.status(400).send("ID field required");
  }

  try {
    await prisma.ticket.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});



app.listen(5000, () => {
  console.log("server running on localhost:5000");
});