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
        console.log(source_json+"?"+Math.random().toString())
        myobject = JSON.parse(HTTP.get(source_json+"?"+Math.random().toString()).content)
        //console.log(myobject)
        console.log("my object is", myobject.length, "entries long")
        myobject.forEach(function(val,idx,array){
            Subjects.insert(val)
            //console.log("inserted")
        })
        
    }
  });
  
  }