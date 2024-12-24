
import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config()
import { fileURLToPath } from 'url';
import src from './src/index.js'
const app = express();

//we need to change up how __dirname is used for ES6 purposes
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const corsOptions = {
    origin: ['http://localhost', 'http://localhost:4200','http://localhost:56717','http://localhost:50427','https://mugdha-migration.vprc.in']
}

//// Middlewares /////
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))
///app.use(helmet())
app.use(morgan('tiny'))
app.use(express.static('public'));
app.use(express.static(path.resolve(__dirname, '/public')));
app.use(express.static(path.resolve(__dirname, 'public')));
//app.use(errorHandler)(app)
/////// Listen ////////
const PORT = process.env.PORT || 3000
app.get('/', (req, res) => {
    res.status(200).send('API Success')
})
//require('./src')(app)
src(app);

app.listen(PORT, () => {
    console.log(`Server Listening PORT ${PORT}`)
})

