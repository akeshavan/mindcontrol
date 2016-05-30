Meteor.methods({
     
      agg_fs: function(){
          
          //console.log("HELLO, THIS IS THE AGGREGATION FUNCTION")
          var out = Subjects.aggregate([{$unwind:"$freesurfer_t1s"},
                              {$group:{_id:"$freesurfer_t1s.name",
                                       msid: {$first: "$msid"},
                                       subject_id: {$first: "$subject_id"},
                                       metrics: {$first: "$freesurfer_t1s.metrics"},
                                       quality_check: {$first: "$freesurfer_t1s.quality_check"},
                                       "Study Tag": {$first: "$Study Tag"},
                                       DCM_InstitutionName: {$first: "$DCM_InstitutionName"},
                                       DCM_StudyDate: {$first: "$DCM_StudyDate"},
                                       complete: {$first: "$freesurfer_t1s.complete"},
                                       checkedBy: {$first: "$freesurfer_t1s.checkedBy"},
                                       checkedAt: {$first: "$freesurfer_t1s.checkedAt"}
                              }},
                              {$out:"fs"}])
                              
            
          //console.log(FS.findOne({}))
          //FS//.find(query)
      },
    
      agg_ni: function(){
          
          console.log("agg for ni")
          var out = Subjects.aggregate([{$unwind:"$nifti_files"},
                              {$group:{_id:"$nifti_files.name",
                                       msid: {$first: "$msid"},
                                       subject_id: {$first: "$subject_id"},
                                       //metrics: {$first: "$freesurfer_t1s.metrics"},
                                       quality_check: {$first: "$nifti_files.quality_check"},
                                       "Study Tag": {$first: "$Study Tag"},
                                       "filename": {$first: "$nifti_files.filename"},
                                       DCM_InstitutionName: {$first: "$DCM_InstitutionName"},
                                       DCM_StudyDate: {$first: "$DCM_StudyDate"},
                                       //complete: {$first: "$nifti_files.complete"},
                                       checkedBy: {$first: "$nifti_files.checkedBy"},
                                       checkedAt: {$first: "$nifti_files.checkedAt"}
                              }},
                              {$out:"ni"}])
          //console.log(NI.findOne({}))
          //FS//.find(query)
      },
      
      agg_mni: function(){
          
          console.log("agg for mni")
          var out = Subjects.aggregate([{$unwind:"$mni"},
                              {$group:{_id:"$mni.name",
                                       msid: {$first: "$msid"},
                                       subject_id: {$first: "$subject_id"},
                                       metrics: {$first: "$mni.metrics"},
                                       quality_check: {$first: "$mni.quality_check"},
                                       "Study Tag": {$first: "$Study Tag"},
                                       "filename": {$first: "$mni.filename"},
                                       DCM_InstitutionName: {$first: "$DCM_InstitutionName"},
                                       DCM_StudyDate: {$first: "$DCM_StudyDate"},
                                       //complete: {$first: "$nifti_files.complete"},
                                       checkedBy: {$first: "$mni.checkedBy"},
                                       checkedAt: {$first: "$mni.checkedAt"}
                              }},
                              {$out:"mni"}])
          //console.log(NI.findOne({}))
          //FS//.find(query)
      },
      
      agg_rsfmri: function(){
          
          console.log("agg for rsfmri")
          var out = Subjects.aggregate([{$unwind:"$rsfmri"},
                              {$group:{_id:"$rsfmri.name",
                                       msid: {$first: "$msid"},
                                       subject_id: {$first: "$subject_id"},
                                       metrics: {$first: "$rsfmri.metrics"},
                                       quality_check: {$first: "$rsfmri.quality_check"},
                                       "Study Tag": {$first: "$Study Tag"},
                                       "filename": {$first: "$rsfmri.filename"},
                                       DCM_InstitutionName: {$first: "$DCM_InstitutionName"},
                                       DCM_StudyDate: {$first: "$DCM_StudyDate"},
                                       //complete: {$first: "$nifti_files.complete"},
                                       checkedBy: {$first: "$rsfmri.checkedBy"},
                                       checkedAt: {$first: "$rsfmri.checkedAt"}
                              }},
                              {$out:"rsfmri"}])
          //console.log(NI.findOne({}))
          //FS//.find(query)
      },

      agg_antsct: function(){

          console.log("agg for antsct")
          var out = Subjects.aggregate([{$unwind:"$antsCT"},
                              {$group:{_id:"$antsCT.name",
                                       msid: {$first: "$msid"},
                                       subject_id: {$first: "$subject_id"},
                                       metrics: {$first: "$antsCT.metrics"},
                                       quality_check: {$first: "$antsCT.quality_check"},
                                       "Study Tag": {$first: "$Study Tag"},
                                       "check_masks": {$first: "$antsCT.check_masks"},
                                       DCM_InstitutionName: {$first: "$DCM_InstitutionName"},
                                       DCM_StudyDate: {$first: "$DCM_StudyDate"},
                                       //complete: {$first: "$nifti_files.complete"},
                                       checkedBy: {$first: "$antsCT.checkedBy"},
                                       checkedAt: {$first: "$antsCT.checkedAt"}
                              }},
                              {$out:"antsct"}])
          //console.log(NI.findOne({}))
          //FS//.find(query)
      },
      agg_ms: function(){
          console.log("AGGREGATING MS")
          var out = Subjects.aggregate([
                              {$group:{_id:"msid",
                                       msid: {$first: "$msid"},
                                       num_exams: {$sum: 1},
                                       study_tags: {$addToSet: "Study Tag"}
                              }},
                              {$out:"ms"}])
    
      },
         
      updateQC: function(mse, form_data, name){
            //console.log("IN UPDATEQC METHOD")
            current_doc = Subjects.findOne({"subject_id":mse})
            nifti_files = current_doc["nifti_files"]
    
            for (i=0;i<nifti_files.length;i++){
                if (nifti_files[i]["name"] == name){
                    nifti_files[i]["quality_check"] = form_data
                    nifti_files[i]["checkedBy"] = Meteor.user().username
                    nifti_files[i]["checkedAt"] = new Date()
                    //console.log(nifti_files[i])
                }
            }
            Meteor.call("agg_ni")
            Subjects.update({"subject_id":mse},{$set: {nifti_files: nifti_files}})
      },
      
      //TODO: why isn't the client finding this method???
      updateQC_mni: function(mse, form_data, name){
            //console.log("IN UPDATEQC METHOD")
            current_doc = Subjects.findOne({"subject_id":mse})
            console.log(current_doc)
            nifti_files = current_doc["mni"]
    
            for (i=0;i<nifti_files.length;i++){
                if (nifti_files[i]["name"] == name){
                    nifti_files[i]["quality_check"] = form_data
                    nifti_files[i]["checkedBy"] = Meteor.user().username
                    nifti_files[i]["checkedAt"] = new Date()
                    //console.log(nifti_files[i])
                }
            }
            Meteor.call("agg_mni")
            Subjects.update({"subject_id":mse},{$set: {mni: nifti_files}})
            //console.log(nifti_files)
            console.log("in this updateQC_mni method on the server")
      },
      
      updateQC_rsfmri: function(mse, form_data, name){
            //console.log("IN UPDATEQC METHOD")
            current_doc = Subjects.findOne({"subject_id":mse})
            //console.log(current_doc)
            nifti_files = current_doc["rsfmri"]
    
            for (i=0;i<nifti_files.length;i++){
                if (nifti_files[i]["name"] == name){
                    nifti_files[i]["quality_check"] = form_data
                    nifti_files[i]["checkedBy"] = Meteor.user().username
                    nifti_files[i]["checkedAt"] = new Date()
                    //console.log(nifti_files[i])
                }
            }
            
            Subjects.update({"subject_id":mse},{$set: {rsfmri: nifti_files}})
            Meteor.call("agg_rsfmri")
            //console.log(nifti_files)
            console.log("in this updateQC_rsfmri method on the server")
      },

      updateQC_antsct: function(mse, form_data, name){
            //console.log("IN UPDATEQC METHOD")
            current_doc = Subjects.findOne({"subject_id":mse})
            //console.log(current_doc)
            nifti_files = current_doc["antsCT"]

            for (i=0;i<nifti_files.length;i++){
                if (nifti_files[i]["name"] == name){
                    nifti_files[i]["quality_check"] = form_data
                    nifti_files[i]["checkedBy"] = Meteor.user().username
                    nifti_files[i]["checkedAt"] = new Date()
                    //console.log(nifti_files[i])
                }
            }
            
            Subjects.update({"subject_id":mse},{$set: {antsCT: nifti_files}})
            Meteor.call("agg_antsct")
            //console.log(nifti_files)
            console.log("in this updateQC_antsct method on the server")
      },
      updateQC_fs: function(mse, form_data, name, loggedPoints){
            //console.log("IN UPDATEQC METHOD")
            current_doc = Subjects.findOne({"subject_id":mse})
            nifti_files = current_doc["freesurfer_t1s"]
    
            for (i=0;i<nifti_files.length;i++){
                if (nifti_files[i]["name"] == name){
                    nifti_files[i]["quality_check"] = form_data
                    nifti_files[i]["checkedBy"] = Meteor.user().username
                    nifti_files[i]["checkedAt"] = new Date()
                    nifti_files[i]["loggedPoints"] = loggedPoints
                    //console.log(nifti_files[i])
                }
            }
            Meteor.call("agg_fs")
            Subjects.update({"subject_id":mse},{$set: {freesurfer_t1s: nifti_files}})
      },
        
      getDateHist: function(){
            Subjects.aggregate([{$group:{_id:"$DCM_StudyDate", count:{$sum:1}}}, {$out:"datehist"}])
            
      },

      save_query: function(name, selector){
        
        var user = Meteor.user().username
        //User.remove({user:user})

        User.insert({user: user, query: selector, name: name})

        console.log(User.findOne({user:user}))
        
    },
    
      removeQuery: function(user, query, name, id){
        
        User.remove({user: user, query: query, name:name, _id:id})
        
    },

      export_FS: function(gSelector){
        var info = FS.find(gSelector).fetch()
        var data = []
        var fields = Object.keys(info[0])
        fields.splice(fields.indexOf("quality_check"),1)
        fields.splice(fields.indexOf("metrics"),1)
        var fs_metrics = Object.keys(info[0].metrics).sort()
        var qc = Object.keys(info[0].quality_check)
        //console.log(fs_metrics)
        _.each(info, function(c){
            var row = []
            for (k=0;k<fields.length;k++){
                row.push(c[fields[k]])
            }
            for (i=0;i<fs_metrics.length;i++){
                row.push(c.metrics[fs_metrics[i]])
            }
            for (j=0;j<qc.length;j++){row.push(c.quality_check[qc[j]])}
            //console.log(row)
            data.push(row)
        })
        fields = fields.concat(fs_metrics).concat(qc)
        //final_fields = fields
        //final_fields.push(fs_metrics)
        return {fields:fields, data:data}
    }
  

});