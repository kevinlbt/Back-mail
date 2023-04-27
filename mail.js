import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors  from 'cors';
import dotenv from "dotenv";

dotenv.config();
const authToken = process.env.AUTH_TOKEN;

const app = express();
const port = 3050;

// Paramètres SMTP pour le serveur Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kevin.lebot@gmail.com',
    pass: 'snunyitazdgmjqiu'
  }
});

// Utilisation de body-parser pour analyser les données POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors()); 

// Route POST pour envoyer un e-mail
app.post('/api/sendEmail', (req, res) => {
    const token = req.headers.authorization;
  // Les options du message à envoyer
  if (token === authToken) {
    
    const { name, firstname, subject, text, replyTo } = req.body;
    const mailOptions = {
    from: 'kevin.lebot@gmail.com',
    to: "kevin.lebot@gmail.com",
    replyTo: replyTo,
    subject: subject,
    text: `Bonjour,

    Vous avez reçu un message de la part de ${name} ${firstname} :

    ${text}

    Tu pouvez répondre à cet email en utilisant l'adresse ${replyTo}.

    Cordialement,

    Ton application coder par kevin le best`
  };

  // Envoi de l'e-mail
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      console.log('E-mail envoyé : ' + info.response);
      res.status(200).send('E-mail envoyé ! merci');
    }
  });
    res.send('Le message a été envoyé avec succès.');

  } else {
    res.status(401).send('Accès non autorisé.');
  }
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}.`);
});