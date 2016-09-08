import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Subjects = new Mongo.Collection('subjects');

import "./table_utils.js"
import "./publications.js"
import "./methods.js"

TabularTables = {}



TabularTables.qa =  new Tabular.Table({
name:"qa",
    autoWidth: false,
    collection: Subjects,
    columns:[
    
      
        get_filter_field("qa", "subject_id", "Exam ID"),
      
    
      
        get_qc_viewer("qa", "name", "Freesurfer ID"),
      
    
      
        get_qc_filter_field("qa", "quality_check.QC", "QC"),
      
    
      
        get_filter_field("qa", "checkedBy", "checked by"),
      
    
      
        get_filter_field("qa", "quality_check.user_assign", "Assigned To"),
      
    
      
        {data: "quality_check.notes_QC", title: "Notes" }
      
    
    ]
    })


TabularTables.rsfmri_decisions =  new Tabular.Table({
name:"rsfmri_decisions",
    autoWidth: false,
    collection: Subjects,
    columns:[
    
      
        get_filter_field("rsfmri_decisions", "subject_id", "Exam ID"),
      
    
      
        get_qc_viewer("rsfmri_decisions", "name", "Filename"),
      
    
      
        get_filter_field("rsfmri_decisions", "strategy", "Strategy"),
      
    
      
        get_filter_field("rsfmri_decisions", "site", "Site"),
      
    
      
        get_filter_field("rsfmri_decisions", "pipeline", "Pipeline"),
      
    
    ]
    })

