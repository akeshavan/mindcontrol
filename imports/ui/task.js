import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './task.html';
import "./d3_plots.js"

/*Template.exams.helpers({
    selector: function(){return {entry_type:"demographic"}}
})*/



var selector_function = function(entry_type){
    var globalSelector = Session.get("globalSelector")
    var myselect = {}
    myselect["entry_type"] = entry_type
    
    globalKeys = Object.keys(globalSelector)
    console.log("global keys are", globalKeys, globalKeys.indexOf(entry_type))
    if (globalKeys.indexOf(entry_type) >= 0){
        var localKeys = Object.keys(globalSelector[entry_type])
        console.log("local keys are", localKeys)
        for (i=0;i<localKeys.length;i++){
            myselect[localKeys[i]] = globalSelector[entry_type][localKeys[i]]
        }//end for
    };//end if
    
    console.log("selector for", entry_type, "is", myselect)
    
    // In this part, if another filter has filtered subjects, then filter on the rest
    if (globalKeys.indexOf("subject_id") >=0){
        myselect["subject_id"] = globalKeys["subject_id"]
    }
    
    return myselect
}

Template.exams.rendered = function() {
      
      if (!this.rendered){
        this.rendered = true
        //console.log("changed this.rendered")
         }
    
    
      this.autorun(function() {   
          console.log("calling datehist")
          Meteor.call("getDateHist", function(error, result){
              do_d3_date_histogram(result, "#d3vis_date")
              })

      })
  }

Template.exams.helpers({selector: function(){return selector_function("demographic")}})
  
Template.freesurferOnly.rendered = function(){

        if (!this.rendered){
            this.rendered = true
        }   
                
            this.autorun(function() {
                /*var fsSelector = getFS()
                //console.log(FS)
                //fsSelector["FS"] = {} //always show full hist
                var bins = 10
                var metric = Session.get("currentFSMetric")
                Meteor.subscribe("fs_metrics", metric) //"Caudate"
                //Meteor.call("getFSHist", fsSelector, bins, metric)
                //var values = Session.get("FSHist")
                var fs_tables = FS.find(fsSelector).fetch()
                //console.log("fs_tables", fs_tables)
        
                var values = get_histogram(fs_tables, metric, bins)
                //console.log("values", values)
                do_d3_histogram(values, metric, "#d3vis")*/
                var metric = "Amygdala" 
                var filter = Session.get("globalSelector")
                if (Object.keys(filter).indexOf("freesurfer") < 0){
                    filter = {}    
                }
                else{
                    filter = filter["freesurfer"]
                }
                
                console.log("filter is", filter)
                Meteor.call("getHistogramData", "freesurfer", metric, 20, filter, function(error, result){
                    console.log("result is", result)
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

Template.freesurferOnly.helpers({selector: function(){return selector_function("freesurfer")}})