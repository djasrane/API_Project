
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to database successfully.");
  })
  .catch((error) => {
    console.log("Connection to database failed:::", error);
  });

const schema = mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  //backend ajouter un utilisateur backend ajouter un utilisateur 
  price: {
    type: Number,
    required: true,
  },
  stockStatus: {
    type: String,
    enum: ["in-stock", "low-stock", "out-of-stock"],
    default: "in-stock",
  },
});

const productModel = mongoose.model("products", schema);

const app = express();
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
