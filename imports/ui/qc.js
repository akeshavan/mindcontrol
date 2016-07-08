import "./qc.html";
import "./colormaps.js"
import {Subjects} from "../api/tasks.js"
import "./task.js"

var logpoint = function(e, template){
    
    if(e.shiftKey){
        //convert mouse position to matrix space
        var currentCoor = papayaContainers[0].viewer.cursorPosition
        var coor = new papaya.core.Coordinate(currentCoor.x, currentCoor.y, currentCoor.z)
        
        //convert matrix space to screen space
        var screenCoor = papayaContainers[0].viewer.convertCoordinateToScreen(coor);
        
        //convert screen space to world space
        var originalCoord = papayaContainers[0].viewer.convertScreenToImageCoordinate(screenCoor.x, screenCoor.y);
        var world = new papaya.core.Coordinate();
        papayaContainers[0].viewer.getWorldCoordinateAtIndex(originalCoord.x, originalCoord.y, originalCoord.z, world);
        
        
        var points = template.loggedPoints.get()
        if (points == null){
            points = []
        }
        points.push({matrix_coor: coor, world_coor: world})
        template.loggedPoints.set(points)
        //Session.set("loggedPoints", points)
        
        //draw
        var viewer = papayaContainers[0].viewer
        draw_point(screenCoor, viewer)
        
    }
    
}

Template.qc_modal.onCreated(function(){
    //console.log("qc modals current data is", this.data)
    Session.set("currentQC", null)
})

/*var all_names_to_qc = function(){
    var qc = Session.get("currentQC")
    if (qc){
        var filter = get_filter(qc.entry_type)
        //console.log("filter is in next file", filter)
        Meteor.subscribe("get_next_id", filter, qc.name)
        filter["name"] = {$nin: [qc.name]}
        console.log("in nextFile", filter, "result", Subjects.findOne(filter))
        var to_return = Subjects.find(filter,{fields: {name:1}, sort: {name:1}}).fetch()//.forEach(function(x){return x.name})  
        return to_return    
    }
    else {
        return []
        }
}*/

Template.qc_modal.helpers({
    
    modalData : function(){
        
        var qc = Session.get("currentQC")
        if (qc){
            Meteor.subscribe('get_qc_doc', qc.entry_type, qc.name)
            var output = Subjects.findOne({entry_type: qc.entry_type, name: qc.name})
            //console.log(output)
            return output
        }
        else{
            return {name: "Empty Modal"}
        }
        
        
    },
    
    /*files_to_qc: function(){
        return all_names_to_qc()
    },//end function
    
    nextFile: function(){
        var to_qc = all_names_to_qc()
        console.log("TO QC IS", to_qc)
        return to_qc[0]
        }*/
    
})

Template.view_images.onCreated(function(){
    this.loggedPoints = new ReactiveVar([])
})


var template_decorator = function(template_instance, lp, idx){
    var update_point_note = function(res, val){
            lp[idx]["note"] = val
            //console.log("logged points are", lp)
            //console.log("template instance", template_instance)
            template_instance.loggedPoints.set(lp)
        }
    return update_point_note
}

Template.view_images.helpers({
    
    user: function(){
        Meteor.subscribe('userList')
        return Meteor.users.find({}).fetch()
    },
    
    loggedPoints: function(){
        return Template.instance().loggedPoints.get()
    },
    
    onPointNote: function(){
        //console.log("poitn note is", this)
        var lp = Template.instance().loggedPoints.get()
        var idx = lp.indexOf(this)
        return  template_decorator(Template.instance(), lp, idx)
    }
    
})

Template.view_images.events({

"submit .new-qc": function(event, template){

        event.preventDefault();
        if (! Meteor.userId()) {
          throw new Meteor.Error("not-authorized");
        }


        form_values = $("#QC_form").serializeArray()
        form_data = {}
        for (i=0;i<form_values.length;i++){
            form_data[form_values[i]["name"]] = form_values[i]["value"]
        }
        //console.log(form_data)
        lp = Session.get("loggedPoints")
        //console.log("this data", this.data)
        
        var qc = Session.get("currentQC")
        var update = {}
        update["quality_check"] = form_data
        update["checkedBy"] = Meteor.user().username
        update["checkedAt"] = new Date()
        update["loggedPoints"] = template.loggedPoints.get()
        
        //console.log("update is", update)
        
        Meteor.call("updateQC", qc, update, function(error, result){
            $("#closemodal").click()
        })
        
        //console.log("called updateQC method!")
    },

 "click #viewer": function(event, template){
     logpoint(event, template)
 },
 
 "click .goto_coor": function(event, template){
     //console.log("clicked a coordinate", this, this.matrix_coor)
     papayaContainers[0].viewer.gotoCoordinate(this.matrix_coor)
     var screenCoor = papayaContainers[0].viewer.convertCoordinateToScreen(this.matrix_coor);
     var viewer = papayaContainers[0].viewer
     draw_point(screenCoor, viewer)

     
     
 }

})

/*Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });*/

var staticURL = "http://127.0.0.1:3002/"//"https://dl.dropboxusercontent.com/u/9020198/data/"



var addPapaya = function(data){
    //if (papayaContainers.length == 0){
        if (papayaContainers.length != 0){
            console.log("papayacontainers is", papayaContainers.pop())
        }
        
    var params = {}
    params["images"] = []
    //console.log("this in the view images rendered template", data)
        
    for (i=0;i<data.check_masks.length;i++){ //skipped the brainmask
        params["images"].push(staticURL+data["check_masks"][i]+"?dl=0")
    }
        var sLabelledFile = data.check_masks[i-1]
        //console.log(sLabelledFile)
        var oPartsLabelled = sLabelledFile.split("/");
        var sLastPart = oPartsLabelled[oPartsLabelled.length-1];
        //console.log(sLastPart)
        //console.log("cmap", colormap)
        //console.log("customCtab", myCustomColorTable)
        //console.log("maxKeys", _.max(validKeys))
        
        
        //params["contextManager"] = new ctxManager();
        params["segmentation.nii.gz?dl=0"] = {lut: new myCustomColorTable(), min:0, max:2035, gradation:false, alpha:0.5}//colormap
        params["showControlBar"] = true
        params["expandable"] = true
        //params["images"] = [staticURL+Rparams.mse+"/nii/"+Rparams.imageFilename+".nii.gz"]
        //console.log("params", params)
        //$("#modal-fullscreen").show()
        papaya.Container.addViewer("viewer", params, function(){
                                        //.modal("show"); 
                                        //console.log(params)
                                        })  
                                        
        //$("#viewer").on("click", logpoint)       
        //} //endif                           
    }

Template.view_images.rendered = function(){
    
    if(!this._rendered) {
      this._rendered = true;
      //console.log('Template onLoad');
    }
    
        
    this.autorun(function(){
        var qc = Session.get("currentQC")
        //console.log("loggedPoints?", Template.instance().loggedPoints.get())
        //console.log("in autorun, qc is", qc)
        if (qc){
        if (Object.keys(qc).indexOf("entry_type")>=0){
            var output = Subjects.findOne({entry_type: qc.entry_type, name: qc.name},{check_masks:1, _id:0, name:1, loggedPoints: 1})
            
            if (output){
                Template.instance().loggedPoints.set(output.loggedPoints)
                addPapaya(output)
            }
            
            
        }}
        
    });//end of autorun

    
    
}
