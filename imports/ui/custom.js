import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import "./custom.html";

Template.custom.helpers({
  "getconsent": function(){
    console.log("consent is", Session.get("consent"))
    return Session.get("consent")
  }
})

Template.consent.helpers({
  "getconsent": function(){
    console.log("consent is", Session.get("consent"))
    return Session.get("consent")
  }
})

Template.custom.events({
  "click #consent": function(e){
    window.scrollTo(0,0)
    console.log("user has consented");
    Session.set("consent", true);
  }
})

Template.custom.rendered = function(){
  // $("#login-buttons").hide()
}
