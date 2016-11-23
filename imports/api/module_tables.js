import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Subjects = new Mongo.Collection('subjects');

import "./table_utils.js"
import "./publications.js"
import "./methods.js"

TabularTables = {}



TabularTables.demographic =  new Tabular.Table({
name:"demographic",
    autoWidth: false,
    collection: Subjects,
    columns:[
    
      
        get_filter_field("demographic", "subject_id", "Exam ID"),
      
    
      
        get_filter_field("demographic", "DCM_InstitutionName", "Site"),
      
    
    ]
    })


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


TabularTables.ants =  new Tabular.Table({
name:"ants",
    autoWidth: false,
    collection: Subjects,
    columns:[
    
      
        get_filter_field("ants", "subject_id", "Exam ID"),
      
    
      
        get_qc_viewer("ants", "name", "ANTS ID"),
      
    
      
        get_qc_filter_field("ants", "quality_check.QC", "QC"),
      
    
      
        get_filter_field("ants", "checkedBy", "checked by"),
      
    
      
        get_filter_field("ants", "quality_check.user_assign", "Assigned To"),
      
    
      
        {data: "quality_check.notes_QC", title: "Notes" }
      
    
    ]
    })

