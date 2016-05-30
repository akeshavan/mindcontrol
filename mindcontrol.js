Subjects = new Mongo.Collection("subjects")
FS = new Mongo.Collection("fs")
NI = new Mongo.Collection("ni")
MS = new Mongo.Collection("msid")
DH = new Mongo.Collection("datehist")
FSH = new Mongo.Collection("fshist")
User = new Mongo.Collection("user")
MNI = new Mongo.Collection("mni")
RSFMRI = new Mongo.Collection("rsfmri")
ANTSCT = new Mongo.Collection("antsct")

staticURL = "http://localhost:3002/"
var globalSelector = {"Exams":{},
                      "FS": {},
                      "NI": {},
                      "MNI": {},
                      "RSFMRI": {},
                      "ANTSCT": {}}


  /*
      ----------------- SELECTORS ---------------------
      
      origExamSelector: 
      currentExamSelector:
      currentFsSelector: inherits exam
      currentNiSelector: inherits exam
    
  */



get_label_qa = function(label_type){
    //fsqc
    var label_qa = function(name,object){
            if (!name){
                html = '<span class="label label-warning TEMPLATE -1">Not Checked</span>'.replace("TEMPLATE", label_type)
                return Spacebars.SafeString(html)
                }
            else{
                if (name.QC == "1"){
                    html = '<span class="label label-success TEMPLATE 1">Pass</span>'.replace("TEMPLATE", label_type)
                    return Spacebars.SafeString(html)
                }
                else if (name.QC=="0"){
                    html = '<span class="label label-danger TEMPLATE 0">Fail</span>'.replace("TEMPLATE", label_type)
                    return Spacebars.SafeString(html)
                }
                else if (name.QC=="2"){
                    html = '<span class="label label-primary TEMPLATE 2">Needs Edits</span>'.replace("TEMPLATE", label_type)
                    return Spacebars.SafeString(html)
                }
                else if (name.QC=="3"){
                    html = '<span class="label label-info TEMPLATE 3">Edited</span>'.replace("TEMPLATE", label_type)
                    return Spacebars.SafeString(html)
                }
                else{
                    html = '<span class="label label-warning TEMPLATE -1">Not Checked</span>'.replace("TEMPLATE", label_type)
                    return Spacebars.SafeString(html)
                }

            }
        }// end of function
    return label_qa
    
}

get_checkedBy = function(tabletocheck){
    //fs
    var foo = function(val, type, doc){
        if (val == null){
            return null
        }
        return '<a class="TEMPLATE checkedBy '.replace("TEMPLATE", tabletocheck)+val+'">'+val+'</a>'
    }
    
    return foo
    
}


/*Tabular Table Setup*/

var tableFields = {
    
    "msid": {data:"msid", title:"Subject", render: function(val, type, doc){
            html = '<a class="exam msid '+val+'">'+val+'</a>'
	        return Spacebars.SafeString(html)
        }},
        
    "subject_id": {data:"subject_id", title: "Exam ID", render: function(val, type, doc){
	        html = '<a class="exam subject_id '+val+'">'+val+'</a>'
	        return Spacebars.SafeString(html)
        }},
        
    "Study Tag": {data:"Study Tag", title:"Study Tag", render: function(val, type, doc){
            if (val == null){
                return null
                }
            html = '<a class="exam study_tag '+val+'">'+val+'</a>'
            return Spacebars.SafeString(html)
        }},
        
    "Site": {data:"DCM_InstitutionName", title:"Site", render: function(val, type, doc){
            if (val == null){
                return null
                }
            html = '<a class="exam site '+val+'">'+val+'</a>'
            return Spacebars.SafeString(html)
        }},
        
    "viewNifti": {data:"_id", title:"nifti filename", render: function(val, type, doc){
	                  html = '<a target="_blank" href="/viewImage/'+val+'/mseID/'+val.split("-")[1]+'">'+val+'</a>'
	                  return Spacebars.SafeString(html)
	              }},

	"viewMNI": {data:"_id", title:"filename", render: function(val, type,doc){

	html = '<a target="_blank" href="/viewImage_mni/'+val+'/mseID/'+val.split("-")[1]+'">'+val+'</a>'
	                  return Spacebars.SafeString(html)
	}},
	
    "viewRSFMRI": {data:"_id", title:"filename", render: function(val, type,doc){

	html = '<a target="_blank" href="/viewImage_rsfmri/'+val+'/mseID/'+val.split("-")[1]+'">'+val+'</a>'
	                  return Spacebars.SafeString(html)
	}},
	"viewANTSCT": {data:"_id", title:"filename", render: function(val, type,doc){

	html = '<a target="_blank" href="/viewImage_antsct/'+val+'/mseID/'+val.split("-")[1]+'">'+val+'</a>'
	                  return Spacebars.SafeString(html)
	}},
    "Date": {data:"DCM_StudyDate", title:"Date"},
    "fsnotes": {data:"quality_check.notes_QC", title:"Notes"},

    "checkedBy_fs": {data: "checkedBy", title:"checkedBy", render: get_checkedBy("fs")},
    "checkedBy_mni": {data: "checkedBy", title:"checkedBy", render: get_checkedBy("mni")},
    "checkedBy_rsfmri": {data: "checkedBy", title:"checkedBy", render: get_checkedBy("rsfmri")},
    "checkedBy_antsct": {data: "checkedBy", title:"checkedBy", render: get_checkedBy("antsct")},

    "assignedTo": {data: "quality_check.user_assign", title:"assignedTo", render: function(val, type, doc){
        if (val == null){
            return null
        }
        return '<a class="fs quality_check.user_assign '+val+'">'+val+'</a>'
    }},

    "QC_fs": {data:"quality_check", title:"QC", render: get_label_qa("fsqc") },
    
    "QC_mni": {data:"quality_check", title:"QC", render: get_label_qa("mniqc") },
    
    "QC_rsfmri": {data:"quality_check", title:"QC", render: get_label_qa("rsfmriqc") },
    "QC_antsct": {data:"quality_check", title:"QC", render: get_label_qa("antsctqc") },
    "viewFS": {data:"_id", title:"Freesurfer Subject ID", render: function(val, type, doc){
	        html = '<a target="_blank" href="/viewImage_fs/'+val+'/mseID/'+val.split("-")[1]+'">'+val+'</a>'
	        //console.log(html)
	        return Spacebars.SafeString(html)
        }},  
        
    "completeFS": {data:"complete", title:"done", render:function(val, type, doc){
            if (val == true){
                html = '<a class="fs complete true"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> yes</a>'
                return Spacebars.SafeString(html)
            }
            else{
            html = '<a class="fs complete false"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span> no</a>'
                return Spacebars.SafeString(html)}
        }},
        
    "percentFS": {data:"subject_id", title:"% FS", render: function(val, type, doc){
	        total = doc["freesurfer_t1s"].length
	        count = 0.0
	        for(i=0;i<doc["freesurfer_t1s"].length;i++){
		        if (doc["freesurfer_t1s"][i]["complete"]){
			        count +=1.0
		        }
	        }
	        return count/total*100
        }},
        
    "totalFS": {data:"subject_id", title:"Total FS", render: function(val, type, doc){
	        return doc["freesurfer_t1s"].length
        }},
        
    "numNifti": {data:"num_nii", title:"# nifti", render: function(val, type, doc){
	        return doc["nifti_files"].length
        }}
    
}

TabularTables = {}

TabularTables.Exams =  new Tabular.Table({
    name:"Exams",
    throttleRefresh: 1000,
    autoWidth: true,
    collection: Subjects,
    columns: [tableFields["msid"],
              tableFields["subject_id"],
              tableFields["Study Tag"],
              tableFields["Site"],
              //tableFields["percentFS"],
              //tableFields["totalFS"],
              //tableFields["numNifti"],
              tableFields["Date"],
              {data:"freesurfer_t1s", visible:false},
              {data:"nifti_files", visible:false}]
})

TabularTables.FS =  new Tabular.Table({
    name:"FS",
    collection: FS,
    autoWidth: true,
    columns: [//tableFields["msid"],
              tableFields["subject_id"],
              tableFields["Study Tag"],
              //tableFields["Site"],
              tableFields["viewFS"],
              tableFields["QC_fs"],
              tableFields["checkedBy_fs"],
              tableFields["assignedTo"],
              tableFields["completeFS"],
              tableFields["fsnotes"],
              //tableFields["percentFS"],
              //tableFields["totalFS"],
              //tableFields["numNifti"],
              tableFields["Date"]]
})

TabularTables.NI =  new Tabular.Table({
    name:"NI",
    collection: NI,
    autoWidth: true,
    //throttleRefresh: 1000,
    columns: [//tableFields["msid"],
              tableFields["subject_id"],
              //tableFields["Study Tag"],
              tableFields["viewNifti"],
              //tableFields["Site"],
              //tableFields["Date"]
              ]
})

TabularTables.MNI = new Tabular.Table({

    name:"MNI",
    collection: MNI,
    //throttleRefresh: 5000,
    columns: [//tableFields["msid"],
              tableFields["subject_id"],
              tableFields["Study Tag"],
              tableFields["viewMNI"],
              tableFields["QC_mni"],
              tableFields["checkedBy_mni"],
              //tableFields["Site"],
              tableFields["Date"]
              ]

})

TabularTables.RSFMRI =  new Tabular.Table({
    name:"RSFMRI",
    collection: RSFMRI,
    autoWidth: true,
    //throttleRefresh: 1000,
    columns: [//tableFields["msid"],
              tableFields["subject_id"],
              tableFields["Study Tag"],
              tableFields["viewRSFMRI"],
              tableFields["QC_rsfmri"],
              tableFields["checkedBy_rsfmri"],
              //tableFields["Site"],
              tableFields["Date"]
              ]
})
TabularTables.ANTSCT =  new Tabular.Table({
    name:"ANTSCT",
    collection: ANTSCT,
    autoWidth: true,
    //throttleRefresh: 1000,
    columns: [//tableFields["msid"],
              tableFields["subject_id"],
              tableFields["Study Tag"],
              tableFields["viewANTSCT"],
              tableFields["QC_antsct"],
              tableFields["checkedBy_antsct"],
              //tableFields["Site"],
              tableFields["Date"]
              ]
})

//Routes                                        
  Router.route("/", function(){
    Meteor.call("agg_fs")
    Meteor.call("agg_ni")
    Meteor.call("agg_mni")
    Meteor.call("agg_rsfmri")
    Meteor.call("agg_antsct")
    console.log("agg ni in main controller")

    this.layout("main")
    this.render("base")
    
})

/*
Router.configure({
  layoutTemplate: 'main'
});


MainController = RouteController.extend({
    
    //layoutTemplate: "main",
    template: "base",
    action: function () {
        Meteor.call("agg_fs")
        Meteor.call("agg_ni")
        Meteor.call("agg_mni")
        Meteor.call("agg_rsfmri")
        Meteor.call("agg_antsct")
        console.log("agg ni in main controller")
        this.render();
  }
    
})

Router.route("/", {
    name: "main",
    controller: MainController,
    waitOn: function(){
        return [Meteor.subscribe("datehist"),
          Meteor.subscribe("user"),
          Meteor.subscribe("users")]//,
          //Meteor.subscribe("nii-all")]
        
    },
    fastRender: false}
    )

*/
  Router.route('/viewImage/:imageFilename/mseID/:mse', function(){
	this.layout("main")
    //db = Subjects.findOne({subject_id:this.params.mse})

	var gSelector = Session.get("globalSelector")
    gSelector["Exams"]["subject_id"] = this.params.mse
    Session.set("globalSelector", gSelector)

	//var doc = find_item_of_list(db["nifti_files"],"name", this.params.imageFilename)
	//console.log("returned....", doc)

	this.render("view_image", {data: {"name": this.params.imageFilename,
		                              "mse":this.params.mse//,
		                              //"db":db,
		                              //"doc":doc
		                              }})
		                              
})

  Router.route('/viewImage_fs/:imageFilename/mseID/:mse/', function(){
	this.layout("main")
    //var db = Subjects.findOne({subject_id:this.params.mse})
    //console.log("db is", db)
    //var doc = find_item_of_list(db["freesurfer_t1s"],"name", this.params.imageFilename)
    var gSelector = Session.get("globalSelector")
    gSelector["Exams"]["subject_id"] = this.params.mse
    Session.set("globalSelector", gSelector)
	this.render("view_image_freesurfer", {data: {"name": this.params.imageFilename,
		                              "mse":this.params.mse}})

})

  Router.route('/viewImage_mni/:imageFilename/mseID/:mse/', function(){
	this.layout("main")
    //var db = Subjects.findOne({subject_id:this.params.mse})
    //console.log("db is", db)
    //var doc = find_item_of_list(db["freesurfer_t1s"],"name", this.params.imageFilename)
    var gSelector = Session.get("globalSelector")
    gSelector["Exams"]["subject_id"] = this.params.mse
    Session.set("globalSelector", gSelector)
	this.render("view_mni", {data: {"name": this.params.imageFilename,
		                              "mse":this.params.mse}})

})

  Router.route('/viewImage_rsfmri/:imageFilename/mseID/:mse/', function(){
	this.layout("main")
    //var db = Subjects.findOne({subject_id:this.params.mse})
    //console.log("db is", db)
    //var doc = find_item_of_list(db["freesurfer_t1s"],"name", this.params.imageFilename)
    var gSelector = Session.get("globalSelector")
    gSelector["Exams"]["subject_id"] = this.params.mse
    Session.set("globalSelector", gSelector)
	this.render("view_rsfmri", {data: {"name": this.params.imageFilename,
		                              "mse":this.params.mse}})

})

  Router.route('/viewImage_antsct/:imageFilename/mseID/:mse/', function(){
	this.layout("main")
    //var db = Subjects.findOne({subject_id:this.params.mse})
    //console.log("db is", db)
    //var doc = find_item_of_list(db["freesurfer_t1s"],"name", this.params.imageFilename)
    var gSelector = Session.get("globalSelector")
    gSelector["Exams"]["subject_id"] = this.params.mse
    Session.set("globalSelector", gSelector)
	this.render("view_antsct", {data: {"name": this.params.imageFilename,
		                              "mse":this.params.mse}})

})
/*Client Code*/
if (Meteor.isClient) {
  
  Meteor.startup(function () {
        // my code here
          //var sub = Meteor.subscribe("all-freesurfer")
          //var sub1 = Meteor.subscribe("all-nifti")
          //var sub2 = Meteor.subscribe("all-subjects")
          Session.set("globalSelector", globalSelector)
          Session.set("currentFSMetric", "Amygdala")
          Session.set("currentRSFMRIMetric", "motion_outliers")
          Meteor.subscribe("datehist")
          Meteor.subscribe("user")
          Meteor.subscribe("users")
          //Meteor.subscribe("nii-all")
          //Meteor.subscribe("nii")
          //Meteor.subscribe("fs_metrics", )
          //Meteor.subscribe("subject_ids")
          //Meteor.call("agg_fs")
          //Meteor.call("agg_ni")
          //Meteor.call("agg_mni")
      
    });
  
  
  
  //Templates
  Template.body.helpers({

    subjects: function(){
        return Subjects.find({})
    }

                     });

  Template.main.helpers({
    currentQuery: function(){
        var gSelector = Session.get("globalSelector")
        var examSelectors = []
        for (var attrname in gSelector["Exams"]) {
            examSelectors.push({attr: attrname, value: gSelector["Exams"][attrname], col: "Exams"})
            } 

        var fsSelectors = []
        for (var attrname in gSelector["FS"]) {
            fsSelectors.push({attr: attrname, value: gSelector["FS"][attrname], col: "FS"})
            } 
            
        var niSelectors = []
        for (var attrname in gSelector["NI"]) {
            niSelectors.push({attr: attrname, value: gSelector["NI"][attrname], col: "NI"})
            } 

        var mniSelectors = []
        for (var attrname in gSelector["MNI"]) {
            mniSelectors.push({attr: attrname, value: gSelector["MNI"][attrname], col: "MNI"})
            } 
            
        var rsfmriSelectors = []
        for (var attrname in gSelector["RSFMRI"]) {
            rsfmriSelectors.push({attr: attrname, value: gSelector["RSFMRI"][attrname], col: "RSFMRI"})
            } 
        var antsctSelectors = []
        for (var attrname in gSelector["ANTSCT"]) {
            antsctSelectors.push({attr: attrname, value: gSelector["ANTSCT"][attrname], col: "ANTSCT"})
            }
        return {Exams: examSelectors, FS: fsSelectors, NI: niSelectors,
                MNI: mniSelectors, RSFMRI: rsfmriSelectors, ANTSCT: antsctSelectors}

    },
    
    num_exams: function(){
        return Subjects.find(Session.get("globalSelector")["Exams"]).count()
    },
    
    num_fs: function(){
        var fs = getFS()
        return FS.find(fs).count()
    },
    
    num_ni: function(){
        var ni = getNI()
        return NI.find(ni).count()
    },
    
    savedQueries: function(){
        var user = Meteor.users.findOne(Meteor.userId(), {fields: {username:1}})
        console.log("user", user)
        var userentries = User.find({user:user.username})
        console.log("userentries", userentries)
        return userentries
        
        
    }
    
})

  Template.main.events({
    "click .reset": function(){
        Session.set("globalSelector", globalSelector)
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
        var field = element[1]
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
    
    "click .mni": function(e){
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
        gSelector["MNI"][field] = value
        console.log(gSelector)
        Session.set("globalSelector", gSelector)

    },
    
    "click .rsfmri": function(e){
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
        gSelector["RSFMRI"][field] = value
        console.log(gSelector)
        Session.set("globalSelector", gSelector)

    },

    "click .antsct": function(e){
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
        gSelector["ANTSCT"][field] = value
        console.log(gSelector)
        Session.set("globalSelector", gSelector)

    },
    "click .fsqc": function(e){
        console.log(e)
        element = e.toElement.className.split(" ")
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
    },
    
    "click .mniqc": function(e){
        console.log(e)
        element = e.toElement.className.split(" ")
        console.log(element)
        var value = element[element.indexOf("mniqc")+1]
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
        gSelector["MNI"][key] = value
        console.log(gSelector)
        Session.set("globalSelector", gSelector)
    },
    
    "click .rsfmriqc": function(e){
        console.log(e)
        element = e.toElement.className.split(" ")
        console.log(element)
        var value = element[element.indexOf("rsfmriqc")+1]
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
        gSelector["RSFMRI"][key] = value
        console.log(gSelector)
        Session.set("globalSelector", gSelector)
    },

     "click .antsctqc": function(e){
        console.log(e)
        element = e.toElement.className.split(" ")
        console.log(element)
        var value = element[element.indexOf("antsctqc")+1]
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
        gSelector["ANTSCT"][key] = value
        console.log(gSelector)
        Session.set("globalSelector", gSelector)
    }
})

  Template.exams.helpers({
    /*tables : function () {
      
      return Subjects.find(Session.get("globalSelector")["Exams"])//Subjects;
    },

    tableSettings: exam_tableSettings*/
    
    selector: function(){
        return Session.get("globalSelector")["Exams"]
    }
    
  });  
  
  Template.exams.rendered = function() {
      
      if (!this.rendered){
        this.rendered = true
        //console.log("changed this.rendered")
         }
    
    
      this.autorun(function() {   
          console.log("calling datehist")
          Meteor.call("getDateHist")
          //console.log("result is ", DateHist.find({}).fetch())
          var out = DH.find({}).fetch()
          do_d3_date_histogram(out, "#d3vis_date")
      })
  }
  
  Template.freesurferOnly.helpers({

    selector: function(){
        var fsSelector = getFS()
        //var out = FS.find(fsSelector)
        //console.log("out count", out.count())
        return fsSelector
    },

    metric: function(){return ["Amygdala", "Caudate", "Putamen", "Hippocampus", "TotalGrayVol",
    "SubCortGrayVol", "CorticalWhiteMatterVol", "EstimatedTotalIntraCranialVol",
    "CortexVol", "CC", "WM-hypointensities", "precuneus_volume"]},

    selectedMetric: function(){return Session.get("currentFSMetric")},

    tableSettings : fs_tableSettings
})

  Template.freesurferOnly.rendered = function(){

        if (!this.rendered){
            this.rendered = true
        }   
                
            this.autorun(function() {
                var fsSelector = getFS()
                //console.log(FS)
                //fsSelector["FS"] = {} //always show full hist
                var bins = 10
                var metric = Session.get("currentFSMetric")
                Meteor.subscribe("fs_metrics", metric) //"Caudate"
                //Meteor.call("getFSHist", fsSelector, bins, metric)
                //var values = Session.get("FSHist")
                var fs_tables = FS.find(fsSelector).fetch()
                //console.log("fs_tables", fs_tables)
        
                var values = get_histogram(fs_tables, metric, bins)
                //console.log("values", values)
                var formatCount = d3.format(",.0f");
                do_d3_histogram(values, metric, "#d3vis", "FS", formatCount)
            })
        
        }

  Template.freesurferOnly.events({

    "change #metric-select": function(event, template){
        var metric = $(event.currentTarget).val()
        console.log("metric: ", metric)
        Session.set("currentFSMetric", metric)
    }

  })

  Template.niiOnly.helpers({
    selector : function () {
        //Meteor.call("agg_ni")
        var fsSelector = getNI()
        //var out = NI.find(fsSelector)
        //console.log("ni down to", out.count())
        return fsSelector
    },

    tableSettings : nii_table_settings
})

  Template.mniOnly.helpers({
    selector : function () {
        //Meteor.call("agg_ni")
        var fsSelector = getMNI()
        //var out = NI.find(fsSelector)
        //console.log("ni down to", out.count())
        return fsSelector
    },

    tableSettings : nii_table_settings
})

  Template.mniOnly.rendered = function(){

        if (!this.rendered){
            this.rendered = true
        }   
                
            this.autorun(function() {
                var fsSelector = getMNI()
                //console.log(FS)
                //fsSelector["FS"] = {} //always show full hist
                var bins = 10
                var metric = "PearsonCorrelation"//Session.get("currentFSMetric")
                Meteor.subscribe("mni_metrics", metric) //"Caudate"
                //Meteor.call("getFSHist", fsSelector, bins, metric)
                //var values = Session.get("FSHist")
                var fs_tables = MNI.find(fsSelector).fetch()
                //console.log("fs_tables", fs_tables)
                var formatCount = d3.format(",.3f");
                var values = get_histogram(fs_tables, metric, bins)
                //console.log("values", values)
                do_d3_histogram(values, metric, "#d3vismni", "MNI", formatCount)
            })
        
        }
  
  Template.rsfmriOnly.helpers({
    selector : function () {
        //Meteor.call("agg_ni")
        var fsSelector = getRSFMRI()
        //var out = NI.find(fsSelector)
        //console.log("ni down to", out.count())
        return fsSelector
    },
    
    metric: function(){return ["motion_outliers","Default_Somatomotor",
                               "Default_Limbic", "Default_Frontoparietal",
                                "Default_Dorsal_Attention", "Default_Visual",
                                "Default_Ventral_Attention"]},

    selectedMetric: function(){return Session.get("currentRSFMRIMetric")},

    tableSettings : nii_table_settings
})

  Template.rsfmriOnly.events({

    "change #metric-select": function(event, template){
        var metric = $(event.currentTarget).val()
        console.log("metric: ", metric)
        Session.set("currentRSFMRIMetric", metric)
    }

  })

  Template.rsfmriOnly.rendered = function(){

        if (!this.rendered){
            this.rendered = true
        }   
                
            this.autorun(function() {
                var fsSelector = getRSFMRI()
                //console.log(FS)
                //fsSelector["FS"] = {} //always show full hist
                var bins = 10
                var metric = Session.get("currentRSFMRIMetric")
                Meteor.subscribe("rsfmri_metrics", metric) //"Caudate"
                //Meteor.call("getFSHist", fsSelector, bins, metric)
                //var values = Session.get("FSHist")
                var fs_tables = RSFMRI.find(fsSelector).fetch()
                //console.log("fs_tables", fs_tables)
                if (metric == "motion_outliers"){
                    var formatCount = d3.format(",.0f");
                }
                else{
                    var formatCount = d3.format(",.3f");
                }
                
                var values = get_histogram(fs_tables, metric, bins)
                //console.log("values", values)
                do_d3_histogram(values, metric, "#d3visrsfmri", "RSFMRI", formatCount)
            })
        
        }

  Template.antsctOnly.helpers({
    selector : function () {
        //Meteor.call("agg_ni")
        var fsSelector = getANTSCT()
        //var out = NI.find(fsSelector)
        //console.log("ni down to", out.count())
        return fsSelector
    },

    metric: function(){return []},

    selectedMetric: function(){return Session.get("currentANTSCTMetric")},

    tableSettings : nii_table_settings
})

  Template.antsctOnly.events({

    "change #metric-select": function(event, template){
        var metric = $(event.currentTarget).val()
        console.log("metric: ", metric)
        Session.set("currentANTSCTMetric", metric)
    }

  })

  Template.antsctOnly.rendered = function(){

        if (!this.rendered){
            this.rendered = true
        }

            this.autorun(function() {
                var fsSelector = getANTSCT()
                //console.log(FS)
                //fsSelector["FS"] = {} //always show full hist
                var bins = 10
                //var metric = Session.get("currentANTSCTMetric")
                //Meteor.subscribe("antsct_metrics", metric) //"Caudate"
                //Meteor.call("getFSHist", fsSelector, bins, metric)
                //var values = Session.get("FSHist")

                //var fs_tables = ANTSCT.find(fsSelector).fetch()

                //console.log("fs_tables", fs_tables)
                //if (metric == "motion_outliers"){
                //    var formatCount = d3.format(",.0f");
                //}
                //else{
                    var formatCount = d3.format(",.3f");
                //}

                //var values = get_histogram(fs_tables, metric, bins)

                //do_d3_histogram(values, metric, "#d3visrsantsct", "ANTSCT", formatCount)
            })

        }

} //end client

//this is on the server too

if (Meteor.isServer){
    
    /*Meteor.publish("all-subjects", function(){
    console.log("publishing all-subjects")
    return Subjects.find({})
    })*/

    /*Meteor.startup(function () {
    if (Subjects.find().count() === 0) {
        //load the json from here: https://www.dropbox.com/s/enb5zemvmu2oqgw/data.json?dl=0
        var source_json = "https://dl.dropbox.com/s/enb5zemvmu2oqgw/data.json?dl=0"
        myobject = JSON.parse(HTTP.get(source_json).content)
        console.log("my object is", myobject.length)
        myobject.forEach(function(val,idx,array){
            Subjects.insert(val)
        })
        
        //Subjects.insert({});
    }
  });*/
    
        
    

}
