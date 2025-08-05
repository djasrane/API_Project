


# API d'Authentification avec Express.js, MongoDB et JWT

Cette API REST permet d’authentifier les utilisateurs à l’aide de **JWT (JSON Web Token)**. Elle inclut l’enregistrement, la connexion, la gestion des mots de passe, la confirmation par email, ainsi que la protection des routes.

##  Fonctionnalités

-  Enregistrement d’un nouvel utilisateur
-  Connexion avec génération de JWT
-  Envoi d’un email de confirmation
-  Modification du mot de passe
-  Réinitialisation du mot de passe (mot de passe oublié)
-  Protection des routes avec vérification du token

##  Technologies utilisées

- **Node.js / Express.js**
- **MongoDB / Mongoose**
- **jsonwebtoken**
- **bcryptjs**
- **nodemailer**
- **dotenv**
- **Thunder Client**

## Structure du projet

auther/

├── controllers/ │

└── authController.js

├── middleware/ │

└── authMiddleware.js

├── models/ │ 

└── User.js 

├── routes/ │ 

└── authRoutes

├── utils/ │ 

└── sendEmail.js

├── .env/ │ 

└── .gitignore

├── README.md/ │ 

└── package.json


##  Endpoints principaux

 Méthode      Endpoint                            Description                                

  POST      /api/register               Enregistrer un utilisateu
  POST      /api/login`                 Connecter un utilisateur                   
  POST      /api/send-confirmation`     Envoyer un email de confirmation           
  PUT       /api/change-password`       Modifier le mot de passe                   
  POST      /api/forgot-password`       Réinitialiser le mot de passe              
  GET       /api/protected`             Accès à une route protégée par JWT         

##  Installation et démarrage

```bash
git clone git@github.com:djasrane/API_Project.git
cd Projet_API
npm install
npm start

```

## Création du fichier .env
```
PORT=
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
```

## Contrôleurs d'Authentification – Express.js + JWT

Ce dossier regroupe les **contrôleurs essentiels** à la gestion de l'authentification dans l’API. Chaque fonction est pensée pour assurer la sécurité, la modularité et la clarté du code backend.

###  Fichier : `authController.js`

### 1. `register(req, res)`
- Enregistre un nouvel utilisateur avec validation des données
- Hachage sécurisé du mot de passe via `bcrypt`
- Envoie un email de confirmation avec `nodemailer`
- Retourne un message de succès ou d’erreur

###  2. `login(req, res)`
- Vérifie les identifiants
- Génère et retourne un **JWT**
- Permet l’accès aux routes protégées

###  3. `sendEmail(req, res)`
- Utilise `nodemailer` pour envoyer un mail de confirmation
- Peut inclure un lien ou un code d’activation

###  4. `changePassword(req, res)`
- Authentifie l’utilisateur via son token
- Vérifie l’ancien mot de passe
- Met à jour le mot de passe avec nouveau hash

### 5. `forgotPassword(req, res)`
- Génère un token de réinitialisation
- Envoie un email avec un lien de réinitialisation
- Stocke le token avec expiration (optionnel)

### 6. `resetPassword(req, res)`
- Vérifie le token reçu
- Permet la réinitialisation sécurisée du mot de passe

## Fichier : `authMiddleware.js`

### `verifyToken(req, res, next)`
- Vérifie la validité du JWT
- Ajoute les infos utilisateur à `req.user`
- Bloque l’accès si le token est invalide ou absent

---

##  Bonnes pratiques intégrées
- Validation des entrées (`express-validator` ou personnalisée)
- Hachage sécurisé (`bcryptjs`)
- Tokens JWT avec expiration
- Réponses claires avec status HTTP cohérents
- Séparation des responsabilités (routes / middleware / contrôleurs)

``` 
Author

1- Ismat Adam Yahya
2- Hadje Haoua Mahamat Issa
3- Oumar Chabaka Ousmane
4- Success Djasrane Tolba
```



