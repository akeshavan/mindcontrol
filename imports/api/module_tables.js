import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

//export const Tasks = new Mongo.Collection('tasks');
export const Subjects = new Mongo.Collection('subjects');

import "./table_utils.js"
import "./publications.js"
import "./methods.js"

TabularTables = {}

TabularTables.demographic =  new Tabular.Table({
    name:"demographic",
    //throttleRefresh: 1000,
    autoWidth: false,
    //selector: function(){return selector_function("demographic")},
    collection: Subjects,
    columns: [get_filter_field("demographic", "msid", "msid"),
              get_filter_field("demographic", "subject_id", "Exam ID"),
              get_filter_field("demographic", "Study Tag", "Study Tag"),
              get_filter_field("demographic", "DCM_InstitutionName", "Site"),
              get_filter_field("demographic", "metrics.DCM_StudyDate", "Date")]
})

TabularTables.freesurfer =  new Tabular.Table({
    name:"freesurfer",
    collection: Subjects,
    //selector: function(){return selector_function("demographic")},
    autoWidth: true,
    columns: [get_filter_field("freesurfer", "subject_id", "Exam ID"),
              get_qc_viewer("freesurfer", "name", "Freesurfer ID"), //tableFields["viewFS"],
              get_qc_filter_field("freesurfer", "quality_check.QC", "QC"), //tableFields["QC"],
              get_filter_field("freesurfer", "checkedBy", "checked by"),
              get_filter_list_field("freesurfer", "quality_check.user_assign", "Assigned To"),
              {data:"quality_check.notes_QC", title:"Notes"}
              //tableFields["assignedTo"]
              ]
})