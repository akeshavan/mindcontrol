import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');
export const Subjects = new Mongo.Collection('subjects');

import "./tables.js"

TabularTables = {}

TabularTables.Exams =  new Tabular.Table({
    name:"Exams",
    //throttleRefresh: 1000,
    autoWidth: false,
    //selector: function(){return selector_function("demographic")},
    collection: Subjects,
    columns: [get_filter_field("demographic", "msid", "msid"),
              get_filter_field("demographic", "subject_id", "Exam ID"),
              get_filter_field("demographic", "Study Tag", "Study Tag"),
              get_filter_field("demographic", "DCM_InstitutionName", "Site"),
              get_filter_field("demographic", "metrics.DCM_StudyDate", "Date")]
})

TabularTables.FS =  new Tabular.Table({
    name:"FS",
    collection: Subjects,
    //selector: function(){return selector_function("demographic")},
    autoWidth: true,
    columns: [get_filter_field("freesurfer", "subject_id", "Exam ID"),
              tableFields["viewFS"],
              tableFields["QC"],
              tableFields["checkedBy"],
              tableFields["assignedTo"]]
})

throwError = function(error, reason, details) {
  var meteorError = new Meteor.Error(error, reason, details);

  if (Meteor.isClient) {
    // this error is never used
    // on the client, the return value of a stub is ignored
    return meteorError;
  } else if (Meteor.isServer) {
    throw meteorError;
  }
};

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  
  
      Meteor.startup(function () {
    if (Subjects.find().count() === 0) {
        //load the json from here: https://www.dropbox.com/s/enb5zemvmu2oqgw/data.json?dl=0
        var source_json = "https://dl.dropboxusercontent.com/s/vnohn5nh9ho3j8a/data_rf.json?dl=0"
        //console.log(HTTP.get(source_json).content)
        myobject = JSON.parse(HTTP.get(source_json).content)
        console.log("my object is", myobject.length)
        myobject.forEach(function(val,idx,array){
            Subjects.insert(val)
        })
        
    }
  });
  
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
    
    getDateHist: function(){
            //console.log("running the aggregate")
            if (Meteor.isServer){
                var foo = Subjects.aggregate([{$match: {entry_type: "demographic"}},{$group:{_id:"$metrics.DCM_StudyDate", count:{$sum:1}}}])
                //console.log(foo)
                return foo
            }

            
      },
      
    getHistogramData: function(entry_type, metric, bins, filter){
          //console.log("getting histogram data")
          if (Meteor.isServer){
          var no_null = filter
          no_null["entry_type"] = entry_type
          var metric_name = "metrics."+metric
          
          if (Object.keys(no_null).indexOf(metric_name) >=0 ){
              no_null[metric_name]["$ne"] = null
          }
          else{
              no_null[metric_name] = {$ne: null}
          }
          
          //console.log("in the server, the filter is", no_null)
          
          var minval = Subjects.find(no_null, {sort: [[metric_name, "ascending"]], limit: 1}).fetch()[0]["metrics"][metric]
          var maxval = Subjects.find(no_null, {sort: [[metric_name, "descending"]], limit: 1}).fetch()[0]["metrics"][metric]
                    //var minval = Subjects.findOne({"entry_type": entry_type, no_null}, {sort: minsorter})//.sort(maxsorter).limit(1)
          
          
          var bin_size = (maxval -minval)/(bins+1)
          console.log(bin_size)
          
          if (bin_size){
                        var foo = Subjects.aggregate([{$match: no_null}, {$project: {lowerBound: {$subtract: ["$metrics.Amygdala", {$mod: ["$metrics.Amygdala", bin_size]}]}}}, {$group: {_id: "$lowerBound", count: {$sum: 1}}}])
          var output = {}
          output["histogram"] = _.sortBy(foo, "_id")
          output["minval"] = minval*0.95
          output["maxval"] = maxval*1.05
          return output
          }
          else{
              var output= {}
              output["histogram"] = []
              output["minval"] = 0
              output["maxval"] = 0
          }}
          //{entry_type: "freesurfer"}

          
                            
      },
    
    get_subject_ids_from_filter: function(filter){
        var subids = []
        var foo = Subjects.find(filter,{subject_id:1, _id:0}).forEach(function(val){subids.push(val.subject_id)})
        console.log("the subjects to filter by are",foo)
        return subids
    }
  });
  
  

