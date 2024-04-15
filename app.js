const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const app = express()
app.use(express.json())

const db_path = path.join(__dirname, 'cricketTeam.db')
let db = null
const intilizeDbToserver = async () => {
  try {
    db = await open({
      filename: db_path,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server started ....!')
    })
  } catch (e) {
    console.log(`Error occured${e.message}`)
  }
}
intilizeDbToserver()

///GEt total player from cricketTeam
app.get('/players/', async (request, response) => {
  const queryforAllplayers = `SELECT * FROM cricket_team`
  const responsefromDb = await db.all(queryforAllplayers)
  response.send(responsefromDb)
})

/// POST add a plyer to team
app.post('/players/', async (request, response) => {
  const playerDetials = request.body
  const {playerName, jerseyNumber, role} = playerDetials
  const sqlqueryToinsert = `INSERT INTO cricket_team(player_name,jersey_number,role) VALUES("${playerName}","${jerseyNumber}","${role}")`
  const responsedb = await db.run(sqlqueryToinsert)
  const playerid = responsedb.lastID
  response.send('Player Added to Team')
})

///Get playuers with ther player_id
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const sqlquerytogetplayers = `SELECT * FROM cricket_team WHERE player_id=${playerId};`
  const dbres = await db.get(sqlquerytogetplayers)
  response.send(dbres)
})

/// PUT update the playerdetails with playerid
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const sqlquery = `UPDATE cricket_team SET player_name="${playerName}", jersey_number="${jerseyNumber}", role="${role}" WHERE player_id=${playerId};`
  await db.run(sqlquery)
  response.send('Player Details Updated')
})

///DELETE player from
app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const querytoDeletePlayer = `DELETE FROM cricket_team WHERE player_id=${playerId}`
  await db.run(querytoDeletePlayer)
  response.send('Player Removed')
})
module.exports = app
