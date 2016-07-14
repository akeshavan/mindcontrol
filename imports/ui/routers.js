import "./body.html"
import "./qc.html"
import {Subjects} from "../api/module_tables.js"

FlowRouter.route('/', {
  action: function() {
    console.log("rendering /")
    BlazeLayout.render("body", {content: "base", "sidebar_content": "body_sidebar"});
  }
});

FlowRouter.route('/:entry_type/:name', {
  action: function(params) {
    console.log(params)
    Session.set("currentQC", {"entry_type": params.entry_type, "name": params.name})

    Meteor.subscribe('get_qc_doc', params.entry_type, params.name)
    var output = Subjects.findOne({"entry_type": params.entry_type, "name": params.name})

    BlazeLayout.render("view_images", data=output);

  }
});