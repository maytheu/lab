const mongoose = require("mongoose");

const User = mongoose.model("users");
const Experiment = mongoose.model("experiments");
const Subject = mongoose.model("subjects");
const Topic = mongoose.model("topics");

const authUser = require("../middleware/authUser.js");
const authAdmin = require("../middleware/authAdmin.js");

module.exports = (app) => {
  app.post("/api/admin/add_subject", authUser, authAdmin, (req, res) => {
    let sub = req.body.subject.toLowerCase().charAt(0).toUpperCase();
    sub = sub + sub.slice(1);
    const subject = new Subject({ subject: sub });
    subject.save((err, exp) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json({ success: true, exp });
    });
  });
  //usage
  //use query params to access it
  //?subject=
  app.post("/api/admin/add_topic", authUser, authAdmin, (req, res) => {
    let top = req.body.topic.toLowerCase().charAt(0).toUpperCase();
    top = top + top.slice(1);
    const subject = req.query.subject;
    Subject.findOne({ subject }, (err, sub) => {
      if (err) return res.json({ success: false, err });
      const topic = new Topic({
        subject: sub.subject,
        topic: top,
      });
      topic.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({ success: true, doc });
      });
    });
  });

  app.post("/api/admin/add_admin", authUser, authAdmin, (req, res) => {
    let user = req.user.username;
    User.findOneAndUpdate(
      { username: user },
      { $set: { admin: 1 } },
      (err, admin) => {
        if (err) return res.json({ siccess: false });
        res.status(200).json({ success: true });
      }
    );
  });

  //Usaage
  //this route uses query parameter
  ///api/admin/add_exp?subject=phy&topic=heat
  app.post("/api/admin/add_exp", authUser, authAdmin, (req, res) => {
    const subject = req.query.subject;
    const topic = req.query.topic;
    Subject.findOne({ subject }, (err, sub) => {
      if (err) return res.json({ success: false, err });
      Topic.findOne({ topic }, (err, top) => {
        if (err) return res.json({ success: false, err });
        const experiment = new Experiment({
          subject: sub.subject,
          topic: top.topic,
          tips: req.body.tip,
          img: req.body.img,
          properties: req.body.property,
          name: req.body.name,
          precaution: req.body.precaution,
        });
        experiment.save((err, exp) => {
          if (err) return res.json({ success: false, err });
          res.status(200).json({ success: true });
        });
      });
    });
  });
};
