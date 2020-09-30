const mongoose = require("mongoose")

//MODEL
let Posts = mongoose.model("posts", {
    title: String,
    username: String,
    email: String,
    dLink: String,
    description: String,
    filename : String,
    originalfilename: String
})
/* Set each variable to mongodb
    these are the variables 
    >title
    >author
    >email
    >dlink (download link)
    >shortdescription *** no input type yet inside the .hbs file yet (need to fix)
    >tag1
    >tag2
    >tag3
    >tag4
    >tag5*/

module.exports = {
   Posts
}


