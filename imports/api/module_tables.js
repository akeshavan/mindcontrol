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
    
      
        get_reduce_view("demographic", "msid", "msid"),
      
    
      
        get_filter_field("demographic", "subject_id", "Exam ID"),
      
    
      
        get_filter_list_field("demographic", "Study Tag", "Study Tag"),
      
    
      
        get_filter_list_field("demographic", "status", "status"),
      
    
      
        get_filter_field("demographic", "metrics.DCM_StudyDate", "Date"),
      
    
    ]
    })


TabularTables.mindboggle =  new Tabular.Table({
name:"mindboggle",
    autoWidth: false,
    collection: Subjects,
    columns:[
    
      
        get_filter_field("mindboggle", "subject_id", "Exam ID"),
      
    
      
        get_qc_viewer("mindboggle", "name", "Freesurfer ID"),
      
    
      
        get_qc_filter_field("mindboggle", "quality_check.QC", "QC"),
      
    
      
        get_filter_field("mindboggle", "checkedBy", "checked by"),
      
    
      
        get_filter_list_field("mindboggle", "quality_check.user_assign", "Assigned To"),
      
    
      
        {data: "quality_check.notes_QC", title: "Notes" }
      
    
    ]
    })


TabularTables.dura =  new Tabular.Table({
name:"dura",
    autoWidth: false,
    collection: Subjects,
    columns:[
    
      
        get_filter_field("dura", "subject_id", "Exam ID"),
      
    
      
        get_qc_viewer("dura", "name", "ID"),
      
    
      
        get_qc_filter_field("dura", "quality_check.QC", "QC"),
      
    
      
        get_filter_field("dura", "checkedBy", "checked by"),
      
    
      
        get_filter_list_field("dura", "quality_check.user_assign", "Assigned To"),
      
    
      
        {data: "quality_check.notes_QC", title: "Notes" }
      
    
    ]
    })


TabularTables.align =  new Tabular.Table({
name:"align",
    autoWidth: false,
    collection: Subjects,
    columns:[
    
      
        get_filter_field("align", "subject_id", "Exam ID"),
      
    
      
        get_qc_viewer("align", "name", "Freesurfer ID"),
      
    
      
        get_qc_filter_field("align", "quality_check.QC", "QC"),
      
    
      
        get_filter_field("align", "checkedBy", "checked by"),
      
    
      
        get_filter_list_field("align", "quality_check.user_assign", "Assigned To"),
      
    
      
        {data: "quality_check.notes_QC", title: "Notes" }
      
    
    ]
    })


TabularTables.freesurfer =  new Tabular.Table({
name:"freesurfer",
    autoWidth: false,
    collection: Subjects,
    columns:[
    
      
        get_filter_field("freesurfer", "subject_id", "Exam ID"),
      
    
      
        get_qc_viewer("freesurfer", "name", "Freesurfer ID"),
      
    
      
        get_qc_filter_field("freesurfer", "quality_check.QC", "QC"),
      
    
      
        get_filter_field("freesurfer", "checkedBy", "checked by"),
      
    
      
        get_filter_list_field("freesurfer", "quality_check.user_assign", "Assigned To"),
      
    
      
        {data: "quality_check.notes_QC", title: "Notes" }
      
    
    ]
    })


TabularTables.antsCT =  new Tabular.Table({
name:"antsCT",
    autoWidth: false,
    collection: Subjects,
    columns:[
    
      
        get_filter_field("antsCT", "subject_id", "Exam ID"),
      
    
      
        get_qc_viewer("antsCT", "name", "Freesurfer ID"),
      
    
      
        get_qc_filter_field("antsCT", "quality_check.QC", "QC"),
      
    
      
        get_filter_field("antsCT", "checkedBy", "checked by"),
      
    
      
        get_filter_list_field("antsCT", "quality_check.user_assign", "Assigned To"),
      
    
      
        {data: "quality_check.notes_QC", title: "Notes" }
      
    
    ]
    })


TabularTables.nifti =  new Tabular.Table({
name:"nifti",
    autoWidth: false,
    collection: Subjects,
    columns:[
    
      
        get_filter_field("nifti", "subject_id", "Exam ID"),
      
    
      
        get_qc_viewer("nifti", "name", "name"),
      
    
      
        get_qc_filter_field("nifti", "quality_check.QC", "QC"),
      
    
      
        get_filter_field("nifti", "checkedBy", "checked by"),
      
    
      
        get_filter_list_field("nifti", "quality_check.user_assign", "Assigned To"),
      
    
      
        {data: "quality_check.notes_QC", title: "Notes" }
      
    
    ]
    })

