import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './task.js';
import './body.html';

Template.body.events({
    "click .reset": function(){
        Session.set("globalSelector", {})
    },
    "click .download": function(){
        MyAppExporter.exportFS()
    },
    "click .tutorial": function(){
        var intro = introJs()
        intro.setOptions({showProgress: false})
        intro.onchange(function(targetElement) {
            console.log(targetElement.attributes.getNamedItem("data-step"))
            if (targetElement.attributes.getNamedItem("data-step") == "2"){
                console.log("in here")
                var gSelector = Session.get("globalSelector")
                gSelector.Exams["DCM_StudyDate"] = "20151123"
                Session.set("globalSelector", gSelector)
            }
        });
        intro.start();
    },
    "click .save": function(){
        var gSelector = Session.get("globalSelector")
        var name = $("#qname").serializeArray()[0]["value"]
        console.log("query name is", name)
        
        Meteor.call("save_query", name, JSON.stringify(gSelector))
    },
    
    "click .remove": function(e){
        var gSelector = Session.get("globalSelector")
        var key = this.col
        delete gSelector[key][this.attr]
        console.log("gSelector is now", gSelector)
        Session.set("globalSelector", gSelector)
    },
    
    "click .removequery": function(e){
        console.log(this.user, this.query, this.name)
        Meteor.call("removeQuery", this.user, this.query, this.name, this._id)
    },
    
    "click .query": function(e){
        console.log(this.user, this.query, this.name)
        Session.set("globalSelector", JSON.parse(this.query))
        
    },
    
    "click .exam": function(e){
        console.log(e)
        element = e.toElement.className.split(" ")
        var level = element[0]
        var field = element[1].replace("'","").replace("'")
        var value = element.slice(2).join(" ")
        
        console.log(level, field, value)
        field_mapper = {"study_tag": "Study Tag",
                  "site": "DCM_InstitutionName",
                  "msid":"msid",
                  "subject_id":"subject_id"
        }
        var gSelector = Session.get("globalSelector")
        gSelector["Exams"][field_mapper[field]] = value
        console.log(gSelector)
        Session.set("globalSelector", gSelector)

    },
    
    "click .filter": function(e){
        console.log(e)
        var element = e.toElement.className.split(" ")//.slice(1).split("-")
        element = element.slice(1).join(" ").split("+")
        console.log("element is", element)
        var entry_type = element[0]
        var field = element[1]
        var value = element[2]//.slice(2).join(" ")
        
        console.log(entry_type, field, value)
        field_mapper = {"study_tag": "Study Tag",
                  "site": "DCM_InstitutionName",
                  "msid":"msid",
                  "subject_id":"subject_id"
        }
        var gSelector = Session.get("globalSelector")
        if (Object.keys(gSelector).indexOf(entry_type) < 0){
            gSelector[entry_type] = {}
        }
        gSelector[entry_type][field] = value
        //gSelector["Exams"][field_mapper[field]] = value
        //console.log(gSelector)
        Session.set("globalSelector", gSelector)

    },
    
    "click .fs": function(e){
        console.log(e)
        element = e.toElement.className.split(" ")
        var level = element[0]
        var field = element[1]
        var value = element.slice(2).join(" ")
        console.log("element classname is", element)
        console.log("level field value:", level, field, value)
        var gSelector = Session.get("globalSelector")
        if (value=="false"){value=false}
        if (value=="true"){value=true}
        gSelector["FS"][field] = value
        console.log(gSelector)
        Session.set("globalSelector", gSelector)

    },
    "click .fsqc": function(e){
        console.log(e)
        element = e.toElement.className//.split(" ")
        console.log(element)
        var value = element[element.indexOf("fsqc")+1]
        if (value < 0){
            value = null
            key = "quality_check"
        }
        else{
            key = "quality_check.QC"
        }

        //var level = element[0]
        //var field = element[1]
        //var value = element.slice(2).join(" ")
        var gSelector = Session.get("globalSelector")
        gSelector["FS"][key] = value
        console.log(gSelector)
        Session.set("globalSelector", gSelector)
    }
})

Template.body.helpers({
    currentQuery: function(){
        var gSelector = Session.get("globalSelector")
        return gSelector

    },
        
    savedQueries: function(){
        var user = Meteor.users.findOne(Meteor.userId(), {fields: {username:1}})
        console.log("user", user)
        //var userentries = User.find({user:user.username})
        //console.log("userentries", userentries)
        //return userentries
    }
    
})
