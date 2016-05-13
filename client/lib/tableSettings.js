
label_qa = function(name,object){
            if (!name){
                html = '<span class="label label-warning">Not Checked</span>'
                return Spacebars.SafeString(html)
                }
            else{
                if (name.QC == "1"){
                    html = '<span class="label label-success">Pass</span>'
                    return Spacebars.SafeString(html)
                }
                else if (name.QC=="0"){
                    html = '<span class="label label-danger">Fail</span>'
                    return Spacebars.SafeString(html)
                }
                else if (name.QC=="2"){
                    html = '<span class="label label-primary">Needs Edits</span>'
                    return Spacebars.SafeString(html)
                }
                else{
                    html = '<span class="label label-warning">Not Checked</span>'
                    return Spacebars.SafeString(html)
                }

            }
        }// end of function



tableFields = {
    
    "msid": {fieldId: 0, key:"msid", label:"MSID", fn: function(name, object){
            html = '<a class="exam msid '+name+'">'+name+'</a>'
	        return Spacebars.SafeString(html)
        }},
        
    "subject_id": {fieldId: 1, key:"subject_id", label: "Exam ID", fn: function(name, object){
	        html = '<a class="exam subject_id '+name+'">'+name+'</a>'
	        return Spacebars.SafeString(html)
        }},
        
    "Study Tag": {fieldId: 2, key:"Study Tag", label:"Study Tag", fn: function(name, object){
            if (name == null){
                return null
                }
            html = '<a class="exam study_tag '+name+'">'+name+'</a>'
            return Spacebars.SafeString(html)
        }},
    "Site": {fieldId: 3, key:"DCM_InstitutionName", label:"Site", fn: function(name, object){
            if (name == null){
                return null
                }
            html = '<a class="exam site '+name+'">'+name+'</a>'
            return Spacebars.SafeString(html)
        }}
    
}

 nii_table_settings =  function(){
		return {
		rowsPerPage: 15,
        showNavigation: true,
        showColumnToggles: true,
        fields: [{fieldId: 40, key:"_id",
	              label:"Series No.",
	              fn: function(name,object){
		              
		              return name.split("-")[2]
	              }},
	              {fieldId: 50, key:"_id", label:"Series Name", fn: function(name,object){
		              name = name.split("-")

		              return name[3]

	              }},
	              {fieldId: 60, key:"_id", label:"file", fn: function(name, object){
	                  html = '<a href="/viewImage/'+name+'/mseID/'+name.split("-")[1]+'">'+name+'</a>'
	                  return Spacebars.SafeString(html)
	              }},
        tableFields["Study Tag"],
        tableFields["Site"],
        {fieldId: 70, key:"DCM_StudyDate", label:"Date"},
	              {fieldId: 80, key:"quality_check", label:"QC", fn: label_qa }
                  //{key:"msid",label:"msid"}
                 ]
	}}

 exam_tableSettings = function () {
      var out = {
        rowsPerPage: 15,
        showNavigation: 'auto',
        showColumnToggles: true,
        fields: [tableFields["msid"],
                 tableFields["subject_id"],
        {fieldId: 9, key:"precent_fs", label:"% FS", fn: function(name, object){
	        total = object["freesurfer_t1s"].length
	        count = 0.0
	        for(i=0;i<object["freesurfer_t1s"].length;i++){
		        if (object["freesurfer_t1s"][i]["complete"]){
			        count +=1.0
		        }
	        }
	        return count/total*100
        }},
        {fieldId: 10, key:"totalfs", label:"Total FS", fn: function(name,object){
	        return object["freesurfer_t1s"].length
        }},
        {fieldId: 11, key:"num_nii", label:"# nifti", fn: function(name,object){
	        return object["nifti_files"].length
        }},
        tableFields["Study Tag"],
        tableFields["Site"],
        {fieldId: 12, key:"DCM_StudyDate", label:"Date"}

        ]
      }
      
      return out;
    }

subject_tableSettings = function(){
    return {
        rowsPerPage: 5,
        showNavigation: 'auto',
        showColumnToggles: true,
        fields: [tableFields["msid"],
        {key:"msid", label:"Number of exams", fn: function(name,object){
            return Subjects.find({"msid": name}).count()
        }}]

}}

 fs_tableSettings = function () {
      return {
        rowsPerPage: 10,
        showNavigation: 'auto',
        showColumnToggles: true,
        fields: [

        tableFields["msid"],
        tableFields["subject_id"],
       {fieldId: 13, key:"_id", label:"ID", fn: function(name, object){
	        html = '<a href="/viewImage_fs/'+name+'/mseID/'+name.split("-")[1]+'">'+name+'</a>'
	        //console.log(html)
	        return Spacebars.SafeString(html)
        }},  
        tableFields["Study Tag"],
        tableFields["Site"],
        {fieldId: 14, key:"DCM_StudyDate", label:"Date"},
        {fieldId: 15, key:"complete", label:"done", fn:function(name, object){
            if (name == true){
                html = '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>'
                return Spacebars.SafeString(html)
            }
            else{
                html = '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span> no'
                return Spacebars.SafeString(html)}
        }},
        {fieldId: 16, key:"quality_check",label:"QC",fn: label_qa},
        //{key:"metrics",label:"GMV", fn: function(name,object){return name.TotalGrayVol}}
        ]
}}