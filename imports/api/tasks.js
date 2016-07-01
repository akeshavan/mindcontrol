import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');
export const Subjects = new Mongo.Collection('subjects');


label_qa = function(name,object){
            if (!name){
                html = '<span class="label label-warning fsqc -1">Not Checked</span>'
                return Spacebars.SafeString(html)
                }
            else{
                if (name.QC == "1"){
                    html = '<span class="label label-success fsqc 1">Pass</span>'
                    return Spacebars.SafeString(html)
                }
                else if (name.QC=="0"){
                    html = '<span class="label label-danger fsqc 0">Fail</span>'
                    return Spacebars.SafeString(html)
                }
                else if (name.QC=="2"){
                    html = '<span class="label label-primary fsqc 2">Needs Edits</span>'
                    return Spacebars.SafeString(html)
                }
                else if (name.QC=="3"){
                    html = '<span class="label label-info fsqc 3">Edited</span>'
                    return Spacebars.SafeString(html)
                }
                else{
                    html = '<span class="label label-warning fsqc -1">Not Checked</span>'
                    return Spacebars.SafeString(html)
                }

            }
        }// end of function

/*Tabular Table Setup*/

var tableFields = {
    
    "msid": {data:"msid", title:"Subject", render: function(val, type, doc){
            html = '<a class="exam msid '+val+'">'+val+'</a>'
	        return Spacebars.SafeString(html)
        }},
        
    "subject_id": {data:"subject_id", title: "Exam ID", render: function(val, type, doc){
	        html = '<a class="exam subject_id '+val+'">'+val+'</a>'
	        return Spacebars.SafeString(html)
        }},
        
    "Study Tag": {data:"Study Tag", title:"Study Tag", render: function(val, type, doc){
            if (val == null){
                return null
                }
            html = '<a class="exam study_tag '+val+'">'+val+'</a>'
            return Spacebars.SafeString(html)
        }},
        
    "Site": {data:"DCM_InstitutionName", title:"Site", render: function(val, type, doc){
            if (val == null){
                return null
                }
            html = '<a class="exam site '+val+'">'+val+'</a>'
            return Spacebars.SafeString(html)
        }},
        
    "viewNifti": {data:"name", title:"nifti filename", render: function(val, type, doc){
	                  html = '<a target="_blank" href="/viewImage/'+val+'/mseID/'+val.split("-")[1]+'">'+val+'</a>'
	                  return Spacebars.SafeString(html)
	              }},

	"viewMNI": {data:"_id", title:"file", render: function(val, type,doc){

	html = '<a target="_blank" href="/viewImage_mni/'+val+'/mseID/'+val.split("-")[1]+'">'+val+'</a>'
	                  return Spacebars.SafeString(html)
	}},
	              
    "Date": {data:"DCM_StudyDate", title:"Date"},

    "checkedBy": {data: "checkedBy", title:"checkedBy", render: function(val, type, doc){
        if (val == null){
            return null
        }
        return '<a class="fs checkedBy '+val+'">'+val+'</a>'
    }},
    "assignedTo": {data: "quality_check.user_assign", title:"assignedTo", render: function(val, type, doc){
        if (val == null){
            return null
        }
        return '<a class="fs quality_check.user_assign '+val+'">'+val+'</a>'
    }},

    "QC": {data:"quality_check", title:"QC", render: label_qa },
    
    "viewFS": {data:"name", title:"Freesurfer Subject ID", render: function(val, type, doc){
	        html = '<a target="_blank" href="/viewImage_fs/'+val+'/mseID/'+val.split("-")[1]+'">'+val+'</a>'
	        //console.log(html)
	        return Spacebars.SafeString(html)
        }},  
        
    "completeFS": {data:"complete", title:"done", render:function(val, type, doc){
            if (val == true){
                html = '<a class="fs complete true"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> yes</a>'
                return Spacebars.SafeString(html)
            }
            else{
            html = '<a class="fs complete false"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span> no</a>'
                return Spacebars.SafeString(html)}
        }},
        
    "percentFS": {data:"subject_id", title:"% FS", render: function(val, type, doc){
	        total = doc["freesurfer_t1s"].length
	        count = 0.0
	        for(i=0;i<doc["freesurfer_t1s"].length;i++){
		        if (doc["freesurfer_t1s"][i]["complete"]){
			        count +=1.0
		        }
	        }
	        return count/total*100
        }},
        
    "totalFS": {data:"subject_id", title:"Total FS", render: function(val, type, doc){
	        return doc["freesurfer_t1s"].length
        }},
        
    "numNifti": {data:"num_nii", title:"# nifti", render: function(val, type, doc){
	        return doc["nifti_files"].length
        }}
    
}

TabularTables = {}

TabularTables.Exams =  new Tabular.Table({
    name:"Exams",
    throttleRefresh: 1000,
    autoWidth: true,
    selector: function(){return {entry_type: "demographic"}},
    collection: Subjects,
    columns: [tableFields["msid"],
              tableFields["subject_id"],
              tableFields["Study Tag"],
              tableFields["Site"],
              //tableFields["percentFS"],
              //tableFields["totalFS"],
              //tableFields["numNifti"],
              tableFields["Date"],
              {data:"freesurfer_t1s", visible:false},
              {data:"nifti_files", visible:false}]
})

TabularTables.FS =  new Tabular.Table({
    name:"FS",
    collection: Subjects,
    selector: function(){return {entry_type: "freesurfer"}},
    autoWidth: true,
    columns: [//tableFields["msid"],
              tableFields["subject_id"],
              //tableFields["Study Tag"],
              //tableFields["Site"],
              tableFields["viewFS"],
              tableFields["QC"],
              tableFields["checkedBy"],
              tableFields["assignedTo"],
              tableFields["completeFS"],
              //tableFields["percentFS"],
              //tableFields["totalFS"],
              //tableFields["numNifti"],
              tableFields["Date"]]
})



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
            console.log("running the aggregate")
            var foo = Subjects.aggregate([{$match: {entry_type: "demographic"}},{$group:{_id:"$metrics.DCM_StudyDate", count:{$sum:1}}}])
            //console.log(foo)
            return foo
            
      },
      
      getHistogramData: function(entry_type, metric, bins){
          console.log("getting histogram data")
          var no_null = {"entry_type": entry_type}
          var metric_name = "metrics."+metric
          no_null[metric_name] = {$ne: null}
          console.log(no_null)
          
          var minval = Subjects.find(no_null, {sort: [[metric_name, "ascending"]], limit: 1}).fetch()[0]["metrics"][metric]
          var maxval = Subjects.find(no_null, {sort: [[metric_name, "descending"]], limit: 1}).fetch()[0]["metrics"][metric]
                    //var minval = Subjects.findOne({"entry_type": entry_type, no_null}, {sort: minsorter})//.sort(maxsorter).limit(1)
          
          
          var bin_size = (maxval -minval)/(bins+1)
          console.log(bin_size)
          //{entry_type: "freesurfer"}
          var foo = Subjects.aggregate([{$match: no_null}, {$project: {lowerBound: {$subtract: ["$metrics.Amygdala", {$mod: ["$metrics.Amygdala", bin_size]}]}}}, {$group: {_id: "$lowerBound", count: {$sum: 1}}}])
          var output = {}
          output["histogram"] = _.sortBy(foo, "_id")
          output["minval"] = minval
          output["maxval"] = maxval
          return output
          
                            
      }
  });
  
  

