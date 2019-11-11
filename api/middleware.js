export default {
  isAuthenticated: (req, res, next) => {
    if(req.user){
      next()
    } else {
      next(new Error('user not found'))
    }

  }
}
