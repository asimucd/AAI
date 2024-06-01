const { query } = require('express');
const mySql=require('mysql2')
var connection = mySql.createConnection({
    host     : 'localhost',
    user     : 'superman',
    password : 'pass11',
    database : 'aai'
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");});

    var createProductTableQuery = "CREATE TABLE IF NOT EXISTS Product (product_id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), description VARCHAR(1000),vendor_id INT,employee_entitlement BOOLEAN)";
    var createVendorTableQuery="CREATE TABLE  IF NOT EXISTS Vendor(vendor_id INT AUTO_INCREMENT PRIMARY KEY, vendor_name VARCHAR(255), vendor_email_id VARCHAR(1000),vendor_mob_no INT,address VARCHAR(500), product_id INT,CONSTRAINT product_id FOREIGN KEY(product_id) REFERENCES Product(product_id )  );";
    var createInventoryTableQuery="CREATE TABLE IF NOT EXISTS Inventory(request_id INT AUTO_INCREMENT PRIMARY KEY,product_id_request  INT,employee_id INT,date_of_request DATE,quantity_requested INT,quantity_approved INT,date_of_approval DATE,CONSTRAINT product_id_request FOREIGN KEY(product_id_request) REFERENCES Product(product_id),CONSTRAINT employee_id FOREIGN KEY(employee_id ) REFERENCES Employee(employee_id) )";
    var createEmployeeTableQuery="CREATE TABLE  IF NOT EXISTS Employee(employee_id INT AUTO_INCREMENT PRIMARY KEY,date_of_retirement DATE,designation VARCHAR(100),department VARCHAR(100),employee_entitlement BOOLEAN,role VARCHAR(100))"
    var createStoreTableQuery="CREATE TABLE IF NOT EXISTS Store(product_id_store INT,quantity_available INT,quantity_requested INT,quantity_approved INT,threshold_quantity INT,verified_quantity INT,CONSTRAINT product_id_store FOREIGN KEY(product_id_store) REFERENCES Product(product_id ))"
    var createUserTableQuery="CREATE TABLE IF NOT EXISTS User(emailId VARCHAR(50),password VARCHAR(50),user_employeeId INT,CONSTRAINT user_employeeId FOREIGN KEY(user_employeeId) REFERENCES Employee(employee_id))"
    queries=[];
   
    
    queries.push(createEmployeeTableQuery)
    queries.push(createUserTableQuery)
    

    queries.forEach(query => {
        
        connection.query(query ,(err,result)=>{
            if(err)
            throw err;
            console.log(result);
        })
    });
    connection.query(createEmployeeTableQuery,(err,result)=>{
        if(err)
        throw err;
        console.log(result);
    })

   

    function insertintoEmployee(employeeId,dateOfRetirement,designation,department,employeeEntitlement,role) {
        const query="INSERT INTO Employee VALUES (?)"   
       var employee=[
              employeeId,
              dateOfRetirement,
              designation,
              department,
              employeeEntitlement,
              role
          ]
          connection.query(query,[employee],(err,result)=>{
           if (err) {
               throw err;
           }
           console.log("Employee added successfully");
       })
      }

      function insertNewUser(username,password,employeeId){
          const query="INSERT INTO User VALUES (?)"
          var user=[
              username,
              password,
              employeeId
          ]
          connection.query(query,[user],(err,result)=>{
            if (err) {
                throw err;
            }
            console.log("User added successfully");
        })
      }
    
  function authenticateMyUser(username,password,callback)
      {  
          const query="SELECT password FROM USER WHERE emailId=(?)"
           
          


             connection.query(query,username,(err,result)=>{
                if(err)
                {   
                    throw err;
                }
                 if(result[0].password==password)
                { 
                   console.log("User with id password found");
                   return callback(1);
                    
                
                }
                else{
                 console.log("wrong credentials")
                 return callback(0);
                }
           })

          }
        

         
          
 



module.exports={
    insertintoEmployee,insertNewUser,authenticateMyUser
}