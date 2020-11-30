module.exports = (req, res, next) =>{                     if(req.user.admin === 0){               
                return res.send("You are not allowed here")
        }
        next()
}
