import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Subjects = new Mongo.Collection('subjects');

import "./table_utils.js"
import "./publications.js"
import "./methods.js"

TabularTables = {}



TabularTables.longitudinal_quality_metrics =  new Tabular.Table({
name:"longitudinal_quality_metrics",
    autoWidth: false,
    collection: Subjects,
    columns:[
    
      
        get_qc_viewer("longitudinal_quality_metrics", "name", "Name"),
      
    
      
        get_reduce_view("longitudinal_quality_metrics", "msid", "Subject ID"),
      
    
      
        get_filter_field("longitudinal_quality_metrics", "subject_id", "Exam ID"),
      
    
      
        get_filter_field("longitudinal_quality_metrics", "site", "Site"),
      
    
      
        get_filter_field("longitudinal_quality_metrics", "metrics.session", "Session"),
      
    
      
        get_qc_filter_field("longitudinal_quality_metrics", "quality_check.QC", "QC"),
      
    
      
        get_filter_field("longitudinal_quality_metrics", "checkedBy", "checked by"),
      
    
      
        get_filter_field("longitudinal_quality_metrics", "quality_check.user_assign", "Assigned To"),
      
    
      
        {data: "quality_check.notes_QC", title: "Notes" }
      
    
    ]
    })

