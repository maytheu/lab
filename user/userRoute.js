const {User}= require("./userSchema.js")
const {Experiment}= require("./experimentSchema.js")

module.exports = (app) =>{
	app.get("/", (req, res) =>{
		res.send("hey, its working")
	})
}
