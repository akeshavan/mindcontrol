import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './task.html';
import "./d3_plots.js"

/*Template.exams.helpers({
    selector: function(){return {entry_type:"demographic"}}
})*/

get_filter = function(entry_type){
 
 var globalSelector = Session.get("globalSelector")
    var myselect = {}
    myselect["entry_type"] = entry_type
    
    if (globalSelector){
        globalKeys = Object.keys(globalSelector)
        //console.log("global keys are", globalKeys, globalKeys.indexOf(entry_type))
        if (globalKeys.indexOf(entry_type) >= 0){
            var localKeys = Object.keys(globalSelector[entry_type])
            //console.log("local keys are", localKeys)
            for (i=0;i<localKeys.length;i++){
                myselect[localKeys[i]] = globalSelector[entry_type][localKeys[i]]
            }//end for
        };//end if
        
        //console.log("selector for", entry_type, "is", myselect)
        
        // In this part, if another filter has filtered subjects, then filter on the rest
        var subselect = Session.get("subjectSelector")
        
        if (subselect["subject_id"]["$in"].length){
            myselect["subject_id"] = subselect["subject_id"]
        }
        //console.log("myselect is", myselect)    
        return myselect
    }

    
}


var selector_function = function(entry_type){
    
    var globalSelector = Session.get("globalSelector")
    var myselect = {}
    myselect["entry_type"] = entry_type
    
    if (globalSelector){
    globalKeys = Object.keys(globalSelector)
    //console.log("global keys are", globalKeys, globalKeys.indexOf(entry_type))
    if (globalKeys.indexOf(entry_type) >= 0){
        var localKeys = Object.keys(globalSelector[entry_type])
        //console.log("local keys are", localKeys)
        for (i=0;i<localKeys.length;i++){
            myselect[localKeys[i]] = globalSelector[entry_type][localKeys[i]]
        }//end for
    };//end if
    
    //console.log("selector for", entry_type, "is", myselect)
    
    // In this part, if another filter has filtered subjects, then filter on the rest
    var subselect = Session.get("subjectSelector")
    
    if (subselect["subject_id"]["$in"].length){
        myselect["subject_id"] = subselect["subject_id"]
    }
    //console.log("myselect is", myselect)    
    return myselect}
}

Template.exams.rendered = function() {
      
      if (!this.rendered){
        this.rendered = true
         }
    
    
      this.autorun(function() {   
          Meteor.call("getDateHist", function(error, result){
              do_d3_date_histogram(result, "#d3vis_date")
              })

      })
  }

Template.exams.helpers({selector: function(){return get_filter("demographic")}})
  
Template.freesurferOnly.rendered = function(){

        if (!this.rendered){
            this.rendered = true
        }   
                
            this.autorun(function() {
                var metric = "Amygdala" 
                var filter = get_filter("freesurfer")
                console.log("filter is", filter)
                Meteor.call("getHistogramData", "freesurfer", metric, 20, filter, function(error, result){
                    //console.log("result is", result)
                    var data = result["histogram"]
                    var minval = result["minval"]
                    var maxval = result["maxval"]
                    if (data.length){
                        do_d3_histogram(data, minval, maxval, metric, "#d3vis", "freesurfer")
                    }
                    else{
                        console.log("attempt to clear histogram here")
                    }
                    
                    
                })
            })
        
        }

Template.freesurferOnly.helpers({selector: function(){return get_filter("freesurfer")}})