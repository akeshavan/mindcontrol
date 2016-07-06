import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

//import { Tasks } from '../api/tasks.js';
import { Subjects } from '../api/tasks.js';

import './task.js';
import './body.html';

var update_subjects = function(filter, list_of_remaining){
        console.log("list of remaining is", list_of_remaining)
        Meteor.call("get_subject_ids_from_filter", filter, function(error, result){
            console.log("result from get subject ids from filter is", result)
            var ss = Session.get("subjectSelector")
            ss["subject_id"]["$in"] = result
            Session.set("subjectSelector", ss)
            if (list_of_remaining.length){
                var filter = get_filter(list_of_remaining[0])
                update_subjects(filter, list_of_remaining.slice(1))
            }
            else{
                return 0
            }
        })
        
        return 0
        
}

Template.body.events({
    "click .reset": function(){
        Session.set("globalSelector", {})
        Session.set("subjectSelector", {"subject_id": {$in: []}})
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
        console.log("this is", this, "selector is", gSelector)
        var key = this.mapper.split("+")
        
        delete gSelector[key[0]][key[1]]
        
        if (Object.keys(gSelector[key[0]]).length==0){
            delete gSelector[key[0]]
        }
        
        console.log("gSelector is now", gSelector)
        Session.set("globalSelector", gSelector)
        var filter = get_filter(key[0])
        delete filter.subject_id
        console.log("remove filter is", filter)
        
        var all_keys = Object.keys(gSelector)
        var remaining = []
        for (i=0;i<all_keys.length;i++){
            if(all_keys[i] != key[0]){
                remaining.push(all_keys[i])
            }
        }
        
        update_subjects(filter, remaining)
    },
    
    "click .removequery": function(e){
        console.log(this.user, this.query, this.name)
        Meteor.call("removeQuery", this.user, this.query, this.name, this._id)
    },
    
    "click .query": function(e){
        console.log(this.user, this.query, this.name)
        Session.set("globalSelector", JSON.parse(this.query))
        
    },
    
    "click .filter": function(e){
        //console.log(e)
        var element = e.toElement.className.split(" ")//.slice(1).split("-")
        var idx = element.indexOf("filter") + 1
        //console.log("element is", element, "idx of filter is", idx)
        element = element.slice(idx).join(" ").split("+")
        //console.log("element is", element)
        var entry_type = element[0]
        var field = element[1]
        var value = element[2]//.slice(2).join(" ")        
        //console.log(entry_type, field, value)

        var gSelector = Session.get("globalSelector")
        if (Object.keys(gSelector).indexOf(entry_type) < 0){
            gSelector[entry_type] = {}
        }
        gSelector[entry_type][field] = value

        //console.log("insert subject selector in this filter function", gSelector)
        
        Session.set("globalSelector", gSelector)
        //THIS IS HACKY
        var filter = get_filter(entry_type)
        if (field=="metrics.DCM_StudyDate" || field=="quality_check.QC"){
            value = parseInt(value)
        }
        filter[field] = value
        //console.log("filter in .filter is", filter)

        Meteor.call("get_subject_ids_from_filter", filter, function(error, result){
            //console.log("result from get subject ids from filter is", result)
            var ss = Session.get("subjectSelector")
            ss["subject_id"]["$in"] = result
            Session.set("subjectSelector", ss)
        })

    },

})

Template.body.helpers({
    currentKeys: function(){
        var gSelector = Session.get("globalSelector")
        //console.log("current query is", gSelector)
        var keys = Object.keys(gSelector)
        return keys

    },
    
    currentSelector: function(){
        var gSelector = Session.get("globalSelector")
        //console.log("current query is", gSelector)
        //var keys = Object.keys(gSelector)
        var keys = Object.keys(gSelector)
        var outlist = []
        for (i=0;i<keys.length;i++){
            
            var subkeys = Object.keys(gSelector[keys[i]])
            for (j=0;j<subkeys.length; j++){
                tmp = {}    
                var keyname = keys[i] + "+" + subkeys[j]
                tmp["mapper"] = keyname
                tmp["name"] = subkeys[j]
                outlist.push(tmp)
            }
            
        }
        return outlist

    },
        
    savedQueries: function(){
        var user = Meteor.users.findOne(Meteor.userId(), {fields: {username:1}})
        //console.log("user", user)
        //var userentries = User.find({user:user.username})
        //console.log("userentries", userentries)
        //return userentries
    }
    
})
