import {Subjects} from "./module_tables.js"

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  
  
 Meteor.startup(function () {
    Subjects.remove({})
    if (Subjects.find().count() === 0) {
        //load the json from here: https://www.dropbox.com/s/enb5zemvmu2oqgw/data.json?dl=0
        var source_json = "https://dl.dropboxusercontent.com/s/vnohn5nh9ho3j8a/data_rf.json?dl=0"
        //console.log(HTTP.get(source_json).content)
        myobject = JSON.parse(HTTP.get(source_json).content)
        //console.log("my object is", myobject.length)
        myobject.forEach(function(val,idx,array){
            Subjects.insert(val)
        })
        
    }
  });
  
  Meteor.publish('get_qc_doc', function tasksPublication(entry_type, name) {
      console.log("publishing", entry_type, name)
    return Subjects.find({"entry_type": entry_type, "name": name});
  });
  
  Meteor.publish('get_next_id', function nextName(filter, name) {
      //console.log("publishing next id from", entry_type, name)
      filter["name"] = {$nin: [name]}
      //var cursor_fetch = Subjects.find(filter, {fields: {name: 1, _id: 0}})
      return Subjects.find(filter, {fields: {name:1}}).limit(50)
      
  });
  
  Meteor.publish('userList', function (){ 
  return Meteor.users.find({});
});
  
}