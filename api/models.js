import mongoose from "mongoose";
import Utils from './utils';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 20
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 64
  },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 64
  }
});
UserSchema.virtual('sites', {
  ref: 'Site',
  localField: '_id',
  foreignField: 'owner',
  justOne: false, // set true for one-to-one relationship
});
const User = mongoose.model('User', UserSchema);

//SITE
const SiteSchema = new mongoose.Schema({
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  name: {
    type: String, required: true, minLength: 3, maxLength: 32
  },
  publicName: {
    type: String, required: true, minLength: 3, maxLength: 32, unique: true
  },
  url: {
    type: String, required: true, minLength: 3, maxLength: 256
  }
}, {timestamps: true});

SiteSchema.virtual('responses', {
  ref: 'Response',
  localField: '_id',
  foreignField: 'site',
  justOne: false, // set true for one-to-one relationship
});
const Site = mongoose.model('Site', SiteSchema);

//RESPONSE
const ResponseSchema = new mongoose.Schema({
  site: {type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true},
  status: {type: Number, required: true},
  duration: {type: Number, required: true},
  date: {type: Date, required: true},
  error: {type: Boolean}
}, {timestamps: true});
const Response = mongoose.model('Response', ResponseSchema);

const IncidentSchema = new mongoose.Schema({
  site: {type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true},
  // type: {type: String, required: true},
  down: {type: Boolean, required: true},
}, {timestamps: true});
IncidentSchema.pre('save', function (next) {
  const incident = this;


  Incident.findOne({site: incident._id}).sort({created_at: -1})
    .then(lastIncident => {


      if (lastIncident && !lastIncident.down && incident.down) {
        return Utils.notifyDown(incident)
      } else if (lastIncident && lastIncident.down && !incident.down) {
        return Utils.notifyUp(incident)
      } else if (!lastIncident && incident.down) {
        return Utils.notifyDown(incident)
      } else {
        return Promise.resolve()
      }

    })
    .then(() => {
      next();
    })
    .catch(err => {
      console.error(err)
    });
});
const Incident = mongoose.model('Incident', IncidentSchema);

export {User, Site, Response, Incident}
