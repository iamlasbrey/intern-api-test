import express from 'express'
import bodyParser from 'body-parser'
import userRoutes from './routes/users.js'

const app = express()
const PORT = 4000;




app.use(bodyParser.json())
app.use('/', userRoutes)







app.listen(PORT, ()=>console.log(`Server is runnning on port: http://localhost:${PORT}`))