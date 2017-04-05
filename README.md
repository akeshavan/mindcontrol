# mindcontrol
MindControl is an app for quality control of neuroimaging pipeline outputs. 

## Installation

Install meteor 

```
curl https://install.meteor.com/ | sh
```

Clone this repository

```
git clone https://github.com/akeshavan/mindcontrol
```

start the server

```
cd mindcontrol
meteor
```

In a browser navigate to localhost:3000

## Configure
For configuration tutorials, see the mindcontrol_docs repository: http://github.com/akeshavan/mindcontrol_docs and the tutorial jupyter notebook: http://nbviewer.jupyter.org/github/akeshavan/mindcontrol_docs/blob/master/Installing_mindcontrol.ipynb

For an example Freesurfer editing instance of Mindcontrol, see http://nbviewer.jupyter.org/github/akeshavan/mindcontrol_docs/blob/master/MindPrepFS.ipynb

To see an example schema, see this file: https://dl.dropboxusercontent.com/u/9020198/data/data_rf.json

## Demo

Check out the [demo](http://mindcontrol.herokuapp.com/). [This data is from the 1000 Functional Connectomes Project](http://fcon_1000.projects.nitrc.org/fcpClassic/FcpTable.html)

##### Things to do in the demo:

* create an account by clicking **sign in** on the top navigation bar
* click on a site (for example, Baltimore) to only show exams from that site
* In the freesurfer table, click the select box to change the metric of the histogram

![switch histograms](https://dl.dropboxusercontent.com/u/9020198/mindcontrol_demo_gifs/histogram_switch.gif)

* Brush the histogram to filter the table, which only shows freesurfer id's that match the brush range 

![brushing and viewing images](https://dl.dropboxusercontent.com/u/9020198/mindcontrol_demo_gifs/histogram_brushing_and_image_viewing.gif)

* Save your filter by typing a name in the left text-box
* Click 'reset' to undo the filtering
* Click on a Freesurfer subject id to open a new window that shows the aparc+aseg file
* Mark Pass, Fail, Needs Edits, or Edited, and leave some comments about the image. Click 'save'
* You can log points

![log points](https://dl.dropboxusercontent.com/u/9020198/mindcontrol_demo_gifs/logLesion.gif)

* You can log curves

![log curves](https://dl.dropboxusercontent.com/u/9020198/mindcontrol_demo_gifs/logContour.gif)

* Edit voxels:

![edit voxels](https://dl.dropboxusercontent.com/u/9020198/mindcontrol_demo_gifs/dura_edit.gif)

* (beta) You can collaborate on the same image:

![collaborate](https://dl.dropboxusercontent.com/u/9020198/mindcontrol_demo_gifs/syncedViewers.gif)

