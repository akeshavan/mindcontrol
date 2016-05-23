Template.view_image.events({

    "submit .new-qc": function(event){

        event.preventDefault();
        if (! Meteor.userId()) {
          throw new Meteor.Error("not-authorized");
        }


        form_values = $("#QC_form").serializeArray()
        form_data = {}
        for (i=0;i<form_values.length;i++){
            form_data[form_values[i]["name"]] = form_values[i]["value"]
        }
        Meteor.call("updateQC", this.mse, form_data, this.name)
        //console.log("called updateQC method!")
    }

})

Template.view_image.helpers({
    selector: function(){
        return Session.get("globalSelector")["Exams"]
    },
        ni_selector: function(){
        return getNI()
    },
    user: function(){
    	return Meteor.users.find({}).fetch()
    },
    
    doc: function(){
            var Rparams = Router.current().params
            var db = Subjects.findOne({subject_id:Rparams.mse})
            var doc = find_item_of_list(db["nifti_files"],"name", Rparams.imageFilename)
            return doc
    }
})

//var staticURL = "https://dl.dropboxusercontent.com/u/9020198/data/"

Template.view_image.rendered = function() {
    if(!this._rendered) {
      this._rendered = true;
      //console.log('Template onLoad');
    }
    params = {}
    Rparams = Router.current().params
    Meteor.subscribe("nii", Rparams.imageFilename)
    this.autorun(function(){
        var doc = NI.findOne({_id: Rparams.imageFilename})
        console.log("doc is", doc)
        if (doc) {
            params["images"] = [staticURL+doc.filename]
            papaya.Container.addViewer("viewer", params, function(){console.log(params)})
        }

    })

}
