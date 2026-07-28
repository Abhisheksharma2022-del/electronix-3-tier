import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import getSequelize from './config/database.js';
import sessionConfig from './config/sessionConfig.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import './models/index.js';

const app = express();
app.set('trust proxy', 1);
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(sessionConfig());

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Electronix Backend</title>
        <style>
          body{
            margin:0;
            display:flex;
            justify-content:center;
            align-items:center;
            height:100vh;
            background:#111827;
            color:#ffffff;
            font-family:Arial,sans-serif;
          }
          .container{
            text-align:center;
          }
          h1{
            color:#22c55e;
          }
          a{
            color:#60a5fa;
            text-decoration:none;
            font-size:18px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 Electronix Backend is Running</h1>
          <h3>Environment : ${process.env.NODE_ENV}</h3>
          <a href="/api/health">Go to Health Check</a>
        </div>
      </body>
    </html>
  `);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV });
});

// centralized error handler
app.use((err, req, res, next) => {
  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message,
  });
});

const PORT = process.env.PORT || 5000;

const sequelize = getSequelize();

sequelize
  .authenticate()
  .then(() => {
    console.log('✅ MySQL Connected via Sequelize');
    return sequelize.sync();
  })
  .then(() => console.log('✅ All MySQL tables synced'))
  .catch((err) => console.error('❌ MySQL connection error:', err));

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});