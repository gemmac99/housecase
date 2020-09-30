const mongoose = require("mongoose")

//MODEL
let User = mongoose.model("user", {
    username: String,
    salt: String,
    hash: String
})


module.exports = {
    //name : something
    //Student : Student   but since same name sila, down  
    User
}

/*for project, users: [
    {
        uid: 1,
        username: "yo"
        password: "gibear"
    },{
        uid: 2,
        username: "myhat"
        password: "myghandi"
    }
]

submissions: [
    {
        pid: 1,
        post: "my house1",
        uid: 1,
        comments:[
            ""
        ]
    }
] */

