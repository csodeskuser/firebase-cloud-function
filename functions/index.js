const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require("body-parser");
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const cors = require('cors')({origin: true});

/* Create New Contact */
exports.createContacts = functions.https.onRequest( async (req, res) => {
  cors(req, res, () => {
    db.collection("contacts").add(req.body).then((output)=>{
      res.json({
        status:true,
        result:output.id
      });
    }).catch((err)=>{
      res.json({
        status:false,
        result:err
      });
    });
  });
});

/* Get All Contact */
exports.getContacts = functions.https.onRequest( async (req, res) => {
  cors(req, res, () => {
    db.collection('contacts').get().then((output)=>{
      let contactData = [];
      output.forEach(doc => {
        let contactObj = doc.data();
        contactObj.id = doc.id;
        contactData.push(contactObj);
      });
      if(contactData.length > 0) {
        res.json({
          status:true,
          result:contactData,
          data:"1"
        });
      } else {
        res.json({
          status:false,
          result:"Contact Not Found",
        });
      }
      
    }).catch((err)=>{
      res.json({
        status:false,
        result:err
      });
    });
  });
});

/* Get Single Contact */
exports.getContact = functions.https.onRequest( async (req, res) => {
  cors(req, res, () => {
    db.collection('contacts').doc(req.params[0]).get().then((output)=>{
      res.json({
        status:true,
        result:output.data()
      });
    }).catch((err)=>{
      res.json({
        status:false,
        result:err
      });
    });
  });
});

/* Update Contact */
exports.updateContact = functions.https.onRequest( async (req, res) => {
  cors(req, res, () => {
    db.collection('contacts').doc(req.params[0]).set(req.body).then(()=>{
      res.json({
        status:true,
        result:"Success"
      });
    }).catch((err)=>{
      res.json({
        status:false,
        result:err
      });
    });
  });
});

/* Delete Contact */
exports.deleteContact = functions.https.onRequest( async (req, res) => {
  cors(req, res, () => {
    db.collection('contacts').doc(req.params[0]).delete().then(()=>{
      res.json({
        status:true,
        result:"Success"
      });
    }).catch((err)=>{
      res.json({
        status:false,
        result:err
      });
    });
  });
});
