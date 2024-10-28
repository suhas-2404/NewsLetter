const express=require("express");
const app=express();
const https=require("https");
const request=require("request");

const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));
app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res){
  var f=req.body.fName;
  var l=req.body.lName;
  var email=req.body.email;

  var data={
    members:[{
      email_address: email,
      status:"subscribed",
      merge_fields: {
        FNAME: f,
        LNAME: l
      }
    }
    ]
  }
  var JSONdata=JSON.stringify(data);

  const url="https://us13.api.mailchimp.com/3.0/lists/da40d6a78a";
  const Option={
    method: "POST",
    headers:{
      Authorization: "auth c7db031c07f9df0ac385bf8771b60416-us13"
    }
  }

  const request = https.request(url, Option, function(response) {
    let body = ''; // Initialize variable to collect response data

    // Collect data as it comes in
    response.on("data", function(chunk) {
      body += chunk;
    });

    // When the response ends, handle it
    response.on("end", function() {
      if (response.statusCode === 200) {
        res.sendFile(__dirname+"/success.html");
      } else {
        res.sendFile(__dirname+"/failure.html");
      }
    });
  });

  request.on("error", function(e) {
    console.error(e);
    res.send("There was an error with the request");
  });

  request.write(JSONdata);
  request.end();
});

app.listen(3000,function(){
   console.log("Server is starting on port 3000");
});


// API Key
// c7db031c07f9df0ac385bf8771b60416-us13

// List ID
// da40d6a78a
