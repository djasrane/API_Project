
// Importation des modules nécessaires

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN
});


exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Utilisateur existe déjà' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = createToken(user._id);
    const confirmationLink = `${process.env.CLIENT_URL}/confirm/${token}`;

    await sendEmail(email, 'Confirmer votre compte', `<a href="${confirmationLink}">Veuillez confirmer</a>`);
    
    res.status(201).json({ message: 'Inscription réussie, vérifiez votre email' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Fonction pour connecter un utilisateur

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Utilisateur non trouvé' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Mot de passe incorrect' });

    if (!user.isVerified)
      return res.status(403).json({ message: 'Veuillez confirmer votre email' });

    const token = createToken(user._id);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
