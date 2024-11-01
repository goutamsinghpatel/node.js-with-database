
const express=require("express");
const app=express();
const port=8080;
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
const methodOverride = require("method-override");
app.use(methodOverride("_method"))

app.use(express.urlencoded({extended: true}));

app.listen(port,()=>{
  console.log(`server start with port${port}`)
});


const { faker } = require('@faker-js/faker');
const mysql=require("mysql2");
const connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    database:"delta_app",
    password:"banna123"
})
let getRandomUser=()=> {
    return [
      faker.string.uuid(),
      faker.internet.userName(),
       faker.internet.email(),
      faker.internet.password(),

    ];
  }
  // data=[]
// for(let i=1;i<101;i++){
//   data.push(getRandomUser());
  

// }

//   let query="insert into user (id,username,email,password) values ?";

  
  
  // try{
  //   connection.query(query,[data],(err,result)=>{
  //       if(err)throw err;
  //        console.log(result);
         
     
  //      });
  // } catch(err){
  //   console.log(err);
  // }   
// connection.end(); 
app.get("/",(req,res)=>{
  let q="select count(*) from user";
   try{
    connection.query(q,(err,result)=>{
        if(err)throw err;
      let count=result[0]["count(*)"];
         res.render("home.ejs",{count});
         
     
       });
  } catch(err){
    console.log(err);
    res.send("something wrongh");
  } 

})
app.get("/user",(req,res)=>{
  let q="select id,username,email from user";
  try{
    connection.query(q,(err,result)=>{
      if(err)throw err;
      let info=result;
      res.render("user",{info})
    })
  }
  catch(err){
    res.send("no");
  }
})
app.get("/user/:id/user",(req,res)=>{
  let {id}=req.params;
  let q=`select * from user where id ='${id}'`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err
      console.log(result);
      let user=result[0]
      res.render("edit.ejs",{user});
    })
  }
  catch(err){
    console.log("some thing wrongh");
  }


  
})
app.patch("/user/:id",(req,res)=>{
  let {id}=req.params;
  let{password,usrename}=req.body;

  let q=`select * from user where id ='${id}'`;
  
  try{
    connection.query(q,(err,result)=>{
if(err) throw err;
let user=result[0];
if (password !=user.password){
 res.send("WRONGH PASSWORD");
}
else{
  let q2=`update user set username ='${usrename}' where id ='${id}'`;
  connection.query(q2,(err,result)=>{
    if(err)throw err;
  res.redirect("/user")
  })
  }

 })
}
  catch(err){
    res.send("your password is wrongh")

  }
})
