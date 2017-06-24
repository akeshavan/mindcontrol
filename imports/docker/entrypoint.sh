#!/bin/bash

cd /bids/derivatives/mindcontrol_freesurfer/
python3 /home/mindcontrol/imports/python_generate/start_static_server &&

cd /home/mindcontrol
meteor --settings settings_freesurfer.json
