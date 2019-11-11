import express from 'express'
import jwt from 'jsonwebtoken'
import Middleware from './middleware'
import Utils from './utils'

import url from 'url';

Utils.connectToDb();

import {User, Site, Response} from './models'


// Create express router
const router = express.Router();

// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
const app = express();

router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request);
  Object.setPrototypeOf(res, app.response);
  req.res = res;
  res.req = req;

  Utils.getUserFromRequest(req)
    .then(user => {
      if (user) {
        req.user = user;
      }
      next();
    })
    .catch(err => {
      next(err);
    });
});

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * get user if auth token in request
 */
app.use((req, res, next) => {
  Utils.getUserFromRequest(req)
    .then(user => {
      if (user) {
        req.user = user;
      }
      next();
    })
    .catch(err => {
      next(err);
    });

});

async function sign(user) {
  const slimVersion = {
    username: user.username,
    email: user.email
  };
  return jwt.sign(slimVersion, JWT_SECRET)
}

function sendError(error, res, code) {
  console.error(error);
  res.status(code || 500).json({error: error})
}

router.post('/register', (req, res) => {

  if (req.body.username && req.body.email && req.body.password) {

    User.countDocuments({$or: [{'username': req.body.username}, {'email': req.body.email}]})
      .exec()
      .then(count => {
        if (count) {
          sendError(new Error('Username or email address is taken.'), res)
        } else {

          new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
          })
            .save()
            .then(savedUser => {
              sign(savedUser)
                .then(signedUser => {
                  res.json({token: signedUser})
                })
                .catch(err => {
                  console.error(err);
                  sendError(new Error('Failed to sign user.'), res);
                })
            })
            .catch(err => {
              console.error(err);
              sendError(new Error('Failed to create user.'), res);
            })

        }
      })
      .catch(err => {
        console.error(err);
        sendError(new Error('Failed to check if username and email address are available.'))
      })


  } else {
    res.status(401).json({message: 'Bad credentials'})
  }

});

// Add POST - /api/login
router.post('/login', (req, res) => {
  if ((req.body.username || req.body.email) && req.body.password) {

    User.findOne({
      $and: [
        {$or: [{username: req.body.username}, {email: req.body.email}]},
        {password: req.body.password}
      ]
    })
      .then(foundUser => {
        if (foundUser) {

          sign(foundUser)
            .then(signedUser => {
              res.json({token: signedUser});
            })
            .catch(err => {
              console.error(err);
              sendError(new Error('Failed to sign user.'), res);
            })

        } else {
          sendError(new Error('User not found.'), res);
        }
      })
      .catch(err => {
        console.error(err);
        sendError(new Error('Failed to find user.'), res);
      })
  } else {
    sendError(new Error('Username/email and password required'), res);
  }
});

router.get('/me', (req, res, next) => {
  Utils.getUserFromRequest(req)
    .then(user => {
      res.status(200).json({user: user})
    })
    .catch(err => {
      sendError(err, res)
    })
});

// Add POST - /api/logout
router.post('/logout', (req, res) => {
  delete req.session.authUser;
  res.json({ok: true})
});

//SITES

router
  .all(Middleware.isAuthenticated)
  .get('/site', (req, res) => {

    const url_parts = url.parse(req.url, true);
    const query = url_parts.query;

    User.findOne({username: req.user.username})
      .then(currentUser => {
        return Site.findOne({owner: currentUser._id, publicName: query.publicName})
          // .populate('responses');
      .populate({path: 'responses', options: { sort: { 'date': -1 } } });

      })
      .then(site => {

        if (site) {
          res.json({site: site, responses: site.responses})
        } else {
          sendError(new Error('site not found'), res);
        }
      })
      .catch(err => {
        sendError(err, res);
      })


  });

router
  .all(Middleware.isAuthenticated)
  .get('/sites', (req, res) => {

    User.findOne({username: req.user.username})
      .populate('sites')
      .then(userWithSites => {
        res.json({sites: userWithSites.sites})
      })
      .catch(err => {
        sendError(err, res);
      });

  });

router
  .all(Middleware.isAuthenticated)
  .post('/sites/new', (req, res) => {

    User.findOne({username: req.user.username})
      .then(currentUser => {

        return new Site({
          owner: currentUser._id,
          name: req.body.name,
          publicName: req.body.publicName,
          url: req.body.url,
          description: req.body.description
        }).save()

      })
      .then(savedSite => {
        res.json(savedSite);
      })
      .catch(err => {
        sendError(err, res);
      })


  });

// Export the server middleware
export default {
  path: '/api',
  handler: router
}
