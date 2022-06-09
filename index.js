const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const ip = require("ip");
console.dir ( ip.address() );

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/irrigationDB");



const DeviceSchema = new mongoose.Schema({

  id: {
    type: String,
    require: true,
    unique: true,
  },
  name: String,
  led_status: {
    type: Boolean,
    default: false,
  },
  data: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },

});
const Device = mongoose.model('Device', DeviceSchema)

app
  .route("/devices")
  .get((req, res) => {
    Device.find((err, devices) => {
      if (err) {
        res.send(err);
      } else {
        res.send(devices);
      }
    });
  })
  .post((req, res) => {
    Device.findOne({ id: req.body.id }).then((device) => {
      if (device) {
        res.send("This device already exists.");
      } else {
        const newDevice = new Device({
          id: req.body.id,
          name: req.body.name,
        });
        newDevice.save((err) => {
          if (err) {
            res.send(err);
          } else {
            res.send(newDevice);
          }
        });
      }
    });
  })
  .delete((req, res) => {
    Device.deleteMany((err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully deleted all devices.");
      }
    });
  });

app
  .route("/devices/:id")
  .get((req, res) => {
    Device.findOne({ id: req.params.id }, (err, device) => {
      if (err) {
        res.send(err);
      } else {
        if (device) {
          res.send(device);
        } else {
          res.send("No device matching this id.");
        }
      }
    });
  })
  .put((req, res) => {
    Device.replaceOne({ id: req.params.id }, req.body, (err, response) => {
      if (err) {
        res.send(err);
      } else {
        if (response.modifiedCount) {
          res.send("Successfully updated device.");
        } else {
          res.send("No device matching this id.");
        }
      }
    });
  })
  .patch((req, res) => {
    Device.updateOne({ id: req.params.id }, req.body, (err, response) => {
      if (err) {
        res.send(err);
      } else {
        if (response.modifiedCount) {
          res.send("Successfully updated device.");
        } else {
          res.send("No device matching this id.");
        }
      }
    });
  })
  .delete((req, res) => {
    Device.deleteOne({ id: req.params.id }, (err, response) => {
      if (err) {
        res.send(err);
      } else {
        if (response.deletedCount) {
          res.send("Successfully deleted device.");
        } else {
          res.send("No device matching this id.");
        }
      }
    });
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})