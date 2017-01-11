import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Subjects = new Mongo.Collection('subjects');

import "./table_utils.js"
import "./publications.js"
import "./methods.js"

TabularTables = {}



TabularTables.mintlabs =  new Tabular.Table({
name:"mintlabs",
    autoWidth: false,
    collection: Subjects,
    columns:[
    
    ]
    })

