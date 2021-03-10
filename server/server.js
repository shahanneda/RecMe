const express = require("express")
const app = express();
const port = 4564;

app.get("/", (req,res) => {
    res.send("hello world");
});
app.listen(port, ()=>{
    console.log("RecMe Server started on port: " + port);
});