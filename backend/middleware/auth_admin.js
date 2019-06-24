module.exports = (req, res, next) => {
   if(req.user.permission==1){
        res.redirect('/admin')
    }
    else next();
  }