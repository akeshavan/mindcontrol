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

## Demo

Check out the [demo](http://mindcontrol.herokuapp.com/). [This data is from the 1000 Functional Connectomes Project](http://fcon_1000.projects.nitrc.org/fcpClassic/FcpTable.html)

##### Things to do in the demo:

* create an account by clicking **sign in** on the top navigation bar
* click on a site (for example, Baltimore) to only show exams from that site
* In the freesurfer table, click the select box to change the metric of the histogram
* Brush the histogram to filter the table, which only shows freesurfer id's that match the brush range 
* Save your filter by typing a name in the left text-box
* Download the freesurfer metrics for your filter by clicking 'Download' on the left 
* Click 'reset' to undo the filtering
* Click on a Freesurfer subject id to open a new window that shows the aparc+aseg file
* Mark Pass, Fail, Needs Edits, or Edited, and leave some comments about the image. Click 'save'
