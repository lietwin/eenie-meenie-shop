var _ = require('underscore');
// underscore allows to execute a function for every element in an array
_.each([1, 2, 3, 4], function(v) {
  console.log(v);
}) //end _.each

// Utils
var checkErr = (error) => {
  if (error) {
    console.log("Error " + error);
    process.exit(1);
  }
}; //end checkErr()

//Run MongoDB query
const mongodb = require("mongodb");
const uri = "mongodb://localhost:27017/example";

mongodb.MongoClient.connect(uri, (error, db) => {
      checkErr(error);
      console.log("successfully connected");

      // first crud examples
      const doc = {
        title: "Jaws",
        year: 1975,
        director: "Steven Spielberg",
        rating: "PG"
      };
        const newData = {
          ratings: {
            critics: 80,
            audience: 97
          },
          screenplay: ["Peter Benchley", "Carl Goetlieb"]
        };
        // Update the document, add ratings and screenplay fields
        const docQuery = {title: "Jaws"};
      //   db.collection("movie").update(docQuery, {$set: newData}, (error, result) => {
      // // db.collection("movie").insert(doc, (error, result) => {
      //   checkErr(error);
        const query = {
          year: 1975
        };
        db.collection("movie").find(query).toArray((error, docs) => {
          checkErr(error);
          console.log("Found docs? ");
          _.each(docs, (doc) => {
            console.log(JSON.stringify(doc));
          });

        // With sort by order
        db.collection("movie").find(query).sort({"title":1}).toArray((error, docs) => {
          checkErr(error);
          console.log("Found docs? ");
          _.each(docs, (doc) => {
            console.log(JSON.stringify(doc));
          });
          process.exit(0);
        // });

        // const query = {"ratings.audience":{"$gt": 90}};
        // db.collection("movie").find(query).toArray((error, docs) =>{
        //   checkErr(error);
        //   console.log( "Found docs? ");
        //   _.each(docs, (doc)=>{
        //       console.log(JSON.stringify(doc));
        //   });
        //   process.exit(0);

      }); // end db.collection

    }); //end MongoClient.connect
