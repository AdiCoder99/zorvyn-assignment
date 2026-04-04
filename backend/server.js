import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import transactionRouter from './routes/transactionRoutes.js';

const app = express();

dotenv.config({ path: './.env' });

await connectDB();

app.use(express.json())
app.use(cors())


app.use((req, res, next) => {
  req.user = {
    id: "dummyUserId",
    role: "admin" // change to test: viewer / analyst
  };
  next();
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api/user', userRouter)
app.use('/api/transaction', transactionRouter)



const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  console.log(`Backend server is running on the link: http://localhost:${port}`);
})

