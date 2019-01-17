const express = require('express')
const knex = require('knex')
const knexConfig = require('./knexfile')
const db = knex(knexConfig.development)
const server = express()
const PORT = 5222

server.use(express.json())

server.post('/api/cohorts', (req, res) => {
  const cohort = req.body
  if (cohort.name) {
    db('cohorts')
      .insert(cohort)
      .then(ids => {
        res.status(201).json(ids)
      })
      .catch(() => {
        res
          .status(500)
          .json({ error: 'Failed to insert the cohort into the database' })
      })
  } else {
    res.status(400).json({ error: 'Please provide a name for the cohort' })
  }
})

server.get('/api/cohorts', (req, res) => {
  db('cohorts')
    .then(rows => {
      res.json(rows)
    })
    .catch(() => {
      res
        .status(500)
        .json({
          error:
            'Information for this table could not be retrieved from the database.' })
    })
})

server.get('/api/cohorts/:id', (req, res) => {
    const { id } = req.params
    db('cohorts')
        .where('id', id)
        .then(rows => {
            res.json(rows)
        })
        .catch(() => {
            res
                .status(500)
                .json({ error: 'Failed to find a zohort with this id in the database.'})
        })
})

server.put('/api/cohorts/:id', (req, res) => {
    const { id } = req.params
    const cohort = req.body
    db('cohorts')
        .where('id', id)
        .update(cohort)
        .then(rowCount => {
            res.status(200).json(rowCount)
        })
        .catch(() => {
            res
                .status(500)
                .json({ error: 'Failed to update this cohort.'})
        })
})

server.delete('/api/cohorts/:id', (req, res) => {
    const { id } = req.params
    db('cohorts').where('id', id).del()
    .then(count => {
        if (count) {
            res.json({ message: 'The cohort was successfully deleted from the database.'})
        } else {
            res.status(404).json({ error: 'The cohort with the specified id does not exist in the database.'})
        }
    })
    .catch(err => {
        res.status(500).json({ error: 'The cohort could not be removed from the database.'})
    })
})

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
