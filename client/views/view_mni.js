Template.view_mni.events({

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
        console.log("calling updateQC_mni method!")
        Meteor.call("updateQC_mni", this.mse, form_data, this.name)
        //console.log("called updateQC method!")
    }

})

//var staticURL = "https://dl.dropboxusercontent.com/u/9020198/data/"

Template.view_mni.helpers({
    selector: function(){
        return Session.get("globalSelector")["Exams"]
    },
    mni_selector: function(){
        return getMNI()
    },
    user: function(){
    	return Meteor.users.find({}).fetch()
    },
    
    doc: function(){
            var Rparams = Router.current().params
            var db = Subjects.findOne({subject_id:Rparams.mse})
            
            //var doc = find_item_of_list(db["mni"],"name", Rparams.imageFilename)
            var doc = MNI.findOne({subject_id: Rparams.mse})
            //console.log("doc is", doc, "in helpers")

            return doc
            
    }
})

Template.view_mni.rendered = function() {
    if(!this._rendered) {
      this._rendered = true;
      //console.log('Template onLoad');
    }
    params = {}
    Rparams = Router.current().params
    Meteor.subscribe("mni", Rparams.imageFilename)
    this.autorun(function(){
        var doc = MNI.findOne({_id: Rparams.imageFilename})
        //console.log("doc is", doc)
        if (doc) {
            params["images"] = [staticURL+"templates/OASIS-30_Atropos_template_in_MNI152.nii.gz", staticURL+doc.filename]
            papaya.Container.addViewer("viewer", params, function(){console.log(params)})
        }

    })

}


