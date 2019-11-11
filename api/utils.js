import mongoose from "mongoose";

import jwt from 'jsonwebtoken'

export default {

  notifyDown() {
    return Promise.resolve()
  },
  notifyUp() {
    return Promise.resolve()
  },

  getUserFromRequest(req) {
    return new Promise((good, bad) => {
      const authorizationHeader = req.headers.authorization;
      if (authorizationHeader && authorizationHeader.split(' ')[0] === 'Bearer') {
        try {
          const decoded = jwt.verify(authorizationHeader.split(' ')[1], process.env.JWT_SECRET);
          good(decoded);
        } catch (err) {
          bad(err)
        }

      } else {
        good();
      }
    })
  },
  connectToDb() {
    try {
      mongoose.connect('mongodb://localhost:27017/airdale', {useNewUrlParser: true, useUnifiedTopology: false});
    } catch (err) {
      console.error(err);
    }
  }
}
