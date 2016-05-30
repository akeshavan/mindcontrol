Template.view_antsct.events({

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
        Meteor.call("updateQC_antsct", this.mse, form_data, this.name)
        //console.log("called updateQC method!")
    }

})

//var staticURL = "https://dl.dropboxusercontent.com/u/9020198/data/"

Template.view_antsct.helpers({
    selector: function(){
        return Session.get("globalSelector")["Exams"]
    },
    mni_selector: function(){
        return getANTSCT()
    },
    user: function(){
    	return Meteor.users.find({}).fetch()
    },
    
    doc: function(){
            var Rparams = Router.current().params
            var db = Subjects.findOne({subject_id:Rparams.mse})
            
            //var doc = find_item_of_list(db["mni"],"name", Rparams.imageFilename)
            var doc = ANTSCT.findOne({subject_id: Rparams.mse})
            //console.log("doc is", doc, "in helpers")

            return doc
            
    }
})

Template.view_antsct.rendered = function() {
    if(!this._rendered) {
      this._rendered = true;
      //console.log('Template onLoad');
    }
    params = {}
    Rparams = Router.current().params
    Meteor.subscribe("antsct", Rparams.imageFilename)
    console.log("rendered antsct", Rparams.imageFilename)
    this.autorun(function(){
        var doc = ANTSCT.findOne({_id: Rparams.imageFilename})
        console.log("doc is", doc)
        if (doc) {
            var images = []
            var N = doc.check_masks.length
            for (i=0; i<N; i++){
                images.push(staticURL+doc.check_masks[i])
            }
            params["images"] = images
            papaya.Container.addViewer("viewer", params, function(){console.log(params)})
        }

    })

}
