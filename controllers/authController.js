const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Crée un token JWT
const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

// Enregistre un utilisateur
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'Utilisateur existe déjà' });

    const hashed = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      name,
      email,
      password: hashed,
      otp,
      otpPurpose: 'email_verification',
      otpExpire: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    await sendEmail(
      email,
      'Confirmez votre compte',
      `Bonjour ${name},<br><br>Votre code de confirmation est : <b>${otp}</b><br>Il expire dans 10 minutes.`
    );

    res.status(201).json({ message: 'Inscription réussie. Vérifiez votre email.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Connexion utilisateur
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Utilisateur non trouvé' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: 'Mot de passe incorrect' });

    if (!user.isVerified)
      return res.status(403).json({ message: 'Veuillez confirmer votre email' });

    const token = createToken(user._id);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Vérifie l'OTP pour confirmation email
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'Utilisateur non trouvé' });

    if (
      user.otp !== otp ||
      user.otpExpire < Date.now() ||
      user.otpPurpose !== 'email_verification'
    ) {
      return res.status(400).json({ message: 'OTP invalide ou expiré' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    user.otpPurpose = undefined;
    await user.save();

    res.json({ message: 'Email vérifié avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mise à jour du mot de passe
exports.updatePassword = async (req, res) => {
  const userId = req.user.id; // Assurez-vous que req.user existe via un middleware auth
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Ancien mot de passe incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
