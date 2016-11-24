import {Subjects} from "../api/module_tables.js"

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user


 Meteor.startup(function () {
    //Subjects.remove({})
    //console.log("in metero startup function")
    if (Subjects.find().count() === 0) {
        //load the json from here: https://www.dropbox.com/s/enb5zemvmu2oqgw/data.json?dl=0
        //console.log(JSON.parse(HTTP.get("http:///private/generator.json").content))
        myjson = JSON.parse(Assets.getText("generator.json"));
        console.log("myjson", myjson["startup_json"])
        var source_json = myjson["startup_json"] //"https://dl.dropboxusercontent.com/s/vnohn5nh9ho3j8a/data_rf.json?dl=0"
        //console.log(HTTP.get(source_json).content)
        if (! Array.isArray(source_json)){
            source_json = [source_json]
        }
        source_json.forEach(function(val, idx, arr){
          HTTP.call( 'GET', val, {}, function( error, response ) {
            if ( error ) {
              console.log( error );
            } else {
              //console.log( response );
              myobject = JSON.parse(response.content)
              //console.log(myobject)
              myobject.forEach(function(val,idx,array){
                  Subjects.insert(val)
                  console.log("inserting", val.entry_type, val.subject_id)
              })
              /*
               This will return the HTTP response object that looks something like this:
               {
                 content: "String of content...",
                 data: Array[100], <-- Our actual data lives here.
                 headers: {  Object containing HTTP response headers }
                 statusCode: 200
               }
              */
            }
          });

        })


        //myobject = JSON.parse(HTTP.get(source_json).content)
        //console.log("my object is", myobject.length)

    }
  });

  }
