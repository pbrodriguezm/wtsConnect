import routes from "../sqlz/routes"
import { events } from "./events"
import {startSock} from "./wts"

const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');


startSock()

app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Server Chatup Whatsapp')
})
app.post('/', (req, res) => {
  res.send('Server Chatup Whatsapp')
})
app.use(routes);
app.listen(port, () => {
  console.log(`Start Server REST port: ${port}`)
})