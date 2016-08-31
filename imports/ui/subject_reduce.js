import "./subject_reduce.html"
import {Subjects} from "../api/module_tables.js"
import "./qc.js"

var top_row_metrics = ["AgeOfOnset", "CurrentAge", "DiseaseCourse", "EDSS", "Sex", "MSSS"]
var side_data_config = [{"entry_type":"mindboggle", "metric": ["Right-Lateral-Ventricle_volume",
                                                               "Left-Lateral-Ventricle_volume"]},
                {"entry_type":"freesurfer", "metric": ["TotalGrayVol", "CorticalWhiteMatterVol",
                "Left-Lateral-Ventricle", "Right-Lateral-Ventricle"]},
                {"entry_type": "antsCT", "metric": ["GM", "WM", "CSF"]}]
var initial_view = {"entry_type": "mindboggle"}

side_data_config.forEach(function(val, idx, arr){
    Session.set(val.entry_type+"_selected", val.metric)
})

function standardDeviation(values){
  var avg = average(values);

  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });

  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
}

var get_data = function(entry_type, metric, mse_order){
    console.log("running getData for", entry_type, metric, mse_order)
    var output = []
    mse_order.forEach(function(val, idx, arr){
        //Meteor.subscribe("mse_info", val, entry_type, metric)
        var filter = {"subject_id": val,
                       "entry_type": entry_type}
        filter["metrics."+metric] = {"$ne": null}
        //console.log("filter is", filter)
        var arr = Subjects.find(filter).fetch()

        if (arr.length){
            arr.forEach(function(val2, idx2, arr2){
                tmp = {}
                tmp["x"] = idx
                tmp["y"] = val2.metrics[metric]
                tmp["info"] = val2
                output.push(tmp)
            })

        }
    })

    var Yarr = []

    output.forEach(function(val3, idx3, arr3){
            if (val3.y != null){
                if (!isNaN(val3.y)){
                    Yarr.push(val3.y)
                }
            }
        })
        output.forEach(function(val4, idx4, arr4){
            arr4[idx4].y = (val4.y-Yarr[0])/Yarr[0]*100
        })

    //console.log("get data output is", output)

    return output
}

Template.subject.helpers({

top_row: function(){

    var msid = Session.get("currentMSID")
    var arr = Subjects.find({"msid": msid,
                             "entry_type": "demographic",
                             "metrics.AgeOfOnset": {"$ne": null}},
                             {sort: {"metrics.DCM_StudyDate": 1}}).fetch()
    //console.log("arr is", arr)
    if (arr.length){
        var N = arr.length - 1

        var metrics = arr[N].metrics
        //console.log("metrics", metrics)
        output = []
        top_row_metrics.forEach(function(val, idx, arrxyz){
            var tmp = {}
            tmp["name"] = val
            //console.log("val is", val, metrics[val])
            tmp["value"] = metrics[val]
            tmp["date"] = metrics.DCM_StudyDate
            output.push(tmp)
        })
        //console.log("output is", output)
        return output
    }
    return []
},

side_data: function(){

    var output = []
    var msid = Session.get("currentMSID")
    var arr = Subjects.find({"msid": msid,
                             "entry_type": "demographic",
                             },
                             {sort: {"metrics.DCM_StudyDate": 1}}).fetch()

    var mse_order = []
    if (arr.length){
        arr.forEach(function(val, idx, arrxyz){
            mse_order.push(val.subject_id)
        })
    }
    side_data_config.forEach(function(val, idx, arr){
        console.log(Session.get(val.entry_type+"_selected"), "changed")
        var tmp = {}
        tmp["type"] = val.entry_type
        tmp["metric"] = Session.get(val.entry_type+"_selected")//val.metric
        //tmp["data"] = get_data(val.entry_type, val.metric, mse_order)
        var data = []
        Meteor.subscribe("mse_info", mse_order, val.entry_type, val.metric)
        tmp.metric.forEach(function(metric_name, metric_idx, metric_arr){
            console.log("val.metric.forEach", metric_name)
            data.push(get_data(val.entry_type, metric_name, mse_order))
        })
        tmp["data"] = data

        //console.log("tmp data is", tmp)
        output.push(tmp)
    })
    //console.log("output for side data is", output)
    return output

}

})

var doPlot = function(metric, type, data, template_instance){
    console.log("running doPlot", data)
    _.defer(function () {
                //data.forEach(function(val, idx,arr){
                nv.addGraph(function() {
                    var chart = nv.models.lineChart()
                    //console.log("chart is", chart)
                    chart.margin({left: 75})  //Adjust chart margins to give the x-axis some breathing room.
                    chart.useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                    chart.duration(350)  //how fast do you want the lines to transition?
                    chart.showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                    chart.showYAxis(true)        //Show the y-axis
                    chart.showXAxis(true)        //Show the x-axis
                    ;
                    chart.xAxis     //Chart x-axis settings
                      .axisLabel('Timepoint')
                      .tickFormat(d3.format(',r'));

                    chart.yAxis     //Chart y-axis settings
                      .axisLabel("% change")
                      .tickFormat(d3.format('.02f'));

                    /* Done setting the chart up? Time to render it!*/
                    //var myData = sinAndCos();   //You need data...

                     //var myData = [{"values": data, "key": metric, "color": "#ff7f0e"}]
                     var myData = []
                     metric.forEach(function(metric_name, metric_idx, metric_arr){
                        myData.push({values: data[metric_idx], key: metric_name})
                     })
                     //console.log("myData is", myData)
                     //console.log("myData is", myData)
                     //console.log("d3 stuff", d3.select('#chart_'+type+" svg"))
                     d3.select('#chart_'+type+" svg")    //Select the <svg> element you want to render the chart in.
                      .datum(myData)         //Populate the <svg> element with chart data...
                      .call(chart);          //Finally, render the chart!
                     //console.log("d3 stuff 2", d3.select('#chart_'+type+" svg"))
                  //Update the chart when window resizes.
                  nv.utils.windowResize(function() { chart.update() });
                  //console.log("chart is", chart)

                  return chart;
                }, function(){

                    d3.selectAll(".nv-point").on("click", function(d){
                        console.log("data is", d)
                        addPapaya(d.info, d.info.entry_type, template_instance)
                        Session.set("currentViewerInfo", d.info)
                    })

                }); //end addGraph
                //}); //end foreach in data
    }); //end defer

}

get_multiselect_arr = function(entry_type){

        var metrics = get_metrics(entry_type)
        //console.log("metrics is", metrics)
        var out_arr = []
        if (metrics != null){
            metrics.forEach(function(val, idx, arr){
                var obj = {value: val, caption: val, selected: false}
                var s = Session.get(entry_type+"_selected")
                if (s.indexOf(val) >=0){
                    s["selected"] = true
                }
                out_arr.push(obj)
            })
        }

        return out_arr
}

Template.sidebardiv_content.helpers({

    plot: function(data){
        var metric = this.metric
        var type=this.type
        if (data.length){
            //console.log("this is", this, "data is", data, "nv", nv.models.lineChart)
            doPlot(metric, type, data, Template.instance())
        }//end if
    },

    metric_names: function(){
        var arr= get_multiselect_arr(this.type)
        //console.log("multiselect is", arr)
        return arr
    },

    selectedMetrics: function(){

        return Session.get(this.type+"_selected")

    },

    configOptions: function(){
    var entry_type = this.type
    var opts = {
      'nonSelectedText': 'Select Metrics',
      'buttonClass': 'btn btn-default btn-sm',
      'enableFiltering': true,
      'onChange': function onChange(option, checked) {
        var index = $(option).val();
        console.log('Changed option ' + index + '. checked: ' + checked);
        var s = Session.get(entry_type+"_selected")
        //console.log("s is", s)
        var idx = s.indexOf(index)
        //console.log("idx is", idx, index)
        if (checked && idx<0){
                s.push(index)
            }
        else if (!checked && idx>=0){
           s.splice(idx, 1)
        }
        Session.set(entry_type+"_selected", s)
        //console.log("now s is", Session.get(entry_type+"_selected"))
        //arr.indexOf(index).selected = checked;
      }}
     return opts

    }
})

Template.sidebardiv_content.rendered = function(){

    //console.log(this, "is rendered")
    if(!this._rendered) {
      this._rendered = true;
      //console.log('Template onLoad');
    }
    this.autorun(function(){
         //var msid = Session.get("currentMSID")
         //console.log("HELLO")
    })

}

Template.mainviewer.helpers({

    top_panel_info: function(){
        return Session.get("currentViewerInfo")
    }

})

Template.subject.events({
})


Template.view_images.onCreated(function(){
    this.loggedPoints = new ReactiveVar([])
    this.contours = new ReactiveVar([])
    //this.logMode = new ReactiveVar("point")
    //this.touchscreen = new ReactiveVar(false)
    this.loadableImages = new ReactiveVar([])
    //this.painters = new ReactiveVar([])
    })

Template.subject.rendered = function(){

 if(!this._rendered) {
      this._rendered = true;
      //console.log('Template onLoad');
    }
    this.autorun(function(){
        var msid = Session.get("currentMSID")
        console.log("currentMSID is", msid)
        Meteor.subscribe("msid_info", msid)
        var arr = Subjects.find({"msid": msid,
                                 "entry_type": "demographic"},
                                {sort: {"metrics.DCM_StudyDate": 1}}).fetch()
        var output = Subjects.findOne(initial_view)
        Session.set("currentViewerInfo", output)
        if (output){
            console.log("output is", output)
            addPapaya(output, output.entry_type, Template.instance())
            load_hotkeys(Template.instance())
        }
        //console.log(arr)
    })

}
