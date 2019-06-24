module.exports = (req, res, next) => {
    if (!req.user) {
      res.redirect('/login');
    }
    else if(req.user.permission==0){
        res.redirect('/')
    }
    else next();
  }