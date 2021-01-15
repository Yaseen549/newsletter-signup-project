
const express = require("express");
const bodyParser = require("body-parser");
const got = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  console.log(req);
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;

  const data = {
    members : [
      {
        email_address: email,
        status : "subscribed",
        merge_fields: {
          FNAME : fname,
          LNAME : lname,
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  // X = your Version; 1 - 20
  const url = "https://usX.api.mailchimp.com/3.0/lists/YourListKey";

  const options = {
    method: "POST",
    auth: "yaseen:YourApiKey",
  }

  const request = https.request(url , options, function(response){

    if (response.statusCode == 200){
      res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
      console.log(response.statusCode);
    })
  })

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
})



app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
} );
