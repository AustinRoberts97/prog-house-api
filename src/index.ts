import { PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany()
    res.json(users)
})

app.get('/prediction', async (req, res) => {
    const predictions = await prisma.prediction.findMany({
      include: { options: true }
    })
    res.json(predictions)
})

app.get('/prediction/:id', async (req, res) => {
    const { id } = req.params
    const prediction = await prisma.prediction.findMany({
        include: { options: true },
        where: { id: Number(id) },
    })
    res.json(prediction)
})

app.post('/prediction', async (req, res) => {
    const { title, author, options } = req.body
    const result = await prisma.prediction.create({
        data: {
            title,
            author: { connect: { id: author} },
            options: {
                createMany: {
                    data: options
                }
            }
        }
    })
    res.json(result)
})

app.put('/vote', async (req, res) => {
    const { option } = req.body
    const result = await prisma.option.update({
        where: {
            id: option
        },
        data: {
            votes: { increment: 1}
        }
    })
    res.json(result)
})
// ... your REST API routes will go here

app.listen(8080, () =>
  console.log('REST API server ready at: http://localhost:8080'),
)