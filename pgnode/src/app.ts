import express from 'express';
import { databaseService } from './services/dbService';
const app = express();
const port = 3001;
databaseService.connect()
app.use(express.json())
const cors = require('cors')
app.use(cors('origin', '*'))



app.get('/database/getPublicKey', async (req, res) => {
  try {
  const address = req.query.address as string
  const query = (await databaseService.query(`SELECT public_key AS "publicKey" FROM users WHERE address = '${address}'`))
  const publicKey = query.rows.length > 0 ? query.rows[0].publicKey : undefined
  res.send({publicKey});
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal Server Error');
  }
});

app.post('/database/insertPublicKey', async (req, res) => {
  try {
    const {publicKey, address} = req.body
    console.log(publicKey, address)
    const query = (await databaseService.query('INSERT INTO users (public_key, address) VALUES ($1, $2) ON CONFLICT (address) DO NOTHING;', [publicKey, address]))
    res.status(200).send('OK')
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
