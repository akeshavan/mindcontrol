Meteor.publish("datehist", function(){return DH.find({})})
    Meteor.publish("user", function(){return User.find({})}) //anisha's user collections
    Meteor.publish("users", function(){ //meteor users collection
        return Meteor.users.find({})
    })

Meteor.publish("fshist", function(){return FSH.find({})})

Meteor.publish("subject_ids", function(){
        return NI.find({},{fields:{subject_id:1}})
        })

Meteor.publish("fs_metrics", function(metric){
        var mname = "metrics." + metric
        var fields = {subject_id: 1, _id: 1, "Study Tag":1,
        DCM_InstitutionName:1, DCM_StudyDate: 1, msid: 1,
            quality_check: 1, checkedBy: 1, complete:1}
        fields[mname] = 1
        return FS.find({},{fields:fields})
    })
    
    Meteor.publish("mni_metrics", function(metric){
        var mname = "metrics." + metric
        var fields = {subject_id: 1, _id: 1, "Study Tag":1,
        DCM_InstitutionName:1, DCM_StudyDate: 1, msid: 1,
            quality_check: 1, checkedBy: 1, complete:1}
        fields[mname] = 1
        //console.log(mname)
        return MNI.find({},{fields:fields})
    })
    
    Meteor.publish("rsfmri_metrics", function(metric){
        var mname = "metrics." + metric
        var fields = {subject_id: 1, _id: 1, "Study Tag":1,
        DCM_InstitutionName:1, DCM_StudyDate: 1, msid: 1,
            quality_check: 1, checkedBy: 1, complete:1}
        fields[mname] = 1
        //console.log(mname)
        return RSFMRI.find({},{fields:fields})
    })
    Meteor.publish("antsct_metrics", function(metric){
        var mname = "metrics." + metric
        var fields = {subject_id: 1, _id: 1, "Study Tag":1,
        DCM_InstitutionName:1, DCM_StudyDate: 1, msid: 1,
            quality_check: 1, checkedBy: 1, complete:1}
        fields[mname] = 1
        //console.log(mname)
        return ANTSCT.find({},{fields:fields})
    })
    Meteor.publish("nii", function(id){
        console.log("id is", id)
        return NI.find({_id:id})
    })
    Meteor.publish("mni", function(id){
        console.log("id is", id)
        return MNI.find({_id:id})
    })
    Meteor.publish("rsfmri", function(id){
        console.log("id is", id)
        return RSFMRI.find({_id:id})
    })
    Meteor.publish("antsct", function(id){
        console.log("id is", id)
        return ANTSCT.find({_id:id})})
    //Meteor.publish("nii-all", function(){
    //console.log("publishing nii-all")
    //return NI.find({})
    //})

