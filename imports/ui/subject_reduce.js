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

var get_filter = function(mse, entry_type, metric){
        var filter = {"subject_id": mse,
                       "entry_type": entry_type}
        filter["metrics."+metric] = {"$ne": null}
        return filter
}

var date_int_to_Date = function(d){
        var datestr = (d+1).toString()
        //console.log(datestr)
        var year = datestr.substring(0,4)
        var month = datestr.substring(4,6)
        var day = datestr.substring(6,8)

        var date_nice = year+"-"+month+"-"+day
        var out_date = new Date(date_nice)
        //console.log(out_date, out_date.getMilliseconds())
        return out_date.valueOf()
}

get_data_xy = function(Xtype, Xmetric, Ytype, Ymetric, mse_order, normalize){
    var output = []
    mse_order.forEach(function(mse, idx, mse_arr){
        var Xname = "metrics."+Xmetric
        var Yname = "metrics."+Ymetric
        var xFields = {name: 1}
        xFields[Xname] = 1
        var yFields = {name: 1}
        yFields[Yname] = 1
        var arrX = Subjects.find(get_filter(mse, Xtype, Xmetric)).fetch()
        var arrY = Subjects.find(get_filter(mse, Ytype, Ymetric)).fetch()
        //console.log(arrX, arrY)
        if (arrX.length && arrY.length){
            arrX.forEach(function(x, xidx, xarr){
                arrY.forEach(function(y, yidx, yarr){
                    if (Xmetric=="DCM_StudyDate"){
                        x.metrics[Xmetric] = date_int_to_Date(x.metrics[Xmetric])
                    }
                    if (!isNaN(x.metrics[Xmetric]) && x.metrics[Xmetric] != null && y.metrics[Ymetric] != null){
                        tmp = {"x": x.metrics[Xmetric], "y": y.metrics[Ymetric], "info": y}
                        output.push(tmp)
                    }
                })
            })
        }

    });
    //console.log(output)
    if (normalize == null || normalize==true){
        Yarr = []
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
    }

    return output

}

var get_mse_order = function(msid){

    var arr = Subjects.find({"msid": msid,
                             "entry_type": "demographic",
                             },
                             {sort: {"metrics.DCM_StudyDate": 1}}).fetch()
    //console.log("arr is", arr)
    var mse_order = []
    if (arr.length){
        arr.forEach(function(val, idx, arrxyz){
            mse_order.push(val.subject_id)
        })
    }
    return mse_order
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
        var output = []
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
    //console.log(mse_order)
    side_data_config.forEach(function(val, idx, arr){
        //console.log(Session.get(val.entry_type+"_selected"), "changed")
        var tmp = {}
        tmp["type"] = val.entry_type
        tmp["metric"] = Session.get(val.entry_type+"_selected")//val.metric
        //tmp["data"] = get_data(val.entry_type, val.metric, mse_order)
        var data = []
        Meteor.subscribe("mse_info", mse_order, val.entry_type, val.metric)
        tmp.metric.forEach(function(metric_name, metric_idx, metric_arr){
            //console.log("val.metric.forEach", metric_name)
            //data.push(get_data(val.entry_type, metric_name, mse_order))
            data.push(get_data_xy("demographic", "DCM_StudyDate", val.entry_type, metric_name, mse_order))
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
    //console.log("running doPlot", data)
    _.defer(function () {
                //data.forEach(function(val, idx,arr){
                nv.addGraph(function() {
                    var chart = nv.models.lineChart()
                    //console.log("chart is", chart)
                    chart.margin({left: 75, right:50})  //Adjust chart margins to give the x-axis some breathing room.
                    chart.useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                    chart.duration(350)  //how fast do you want the lines to transition?
                    chart.showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                    chart.showYAxis(true)        //Show the y-axis
                    chart.showXAxis(true)        //Show the x-axis
                    ;
                    chart.xAxis     //Chart x-axis settings
                      .axisLabel('Timepoint')
                      //.tickFormat(d3.format(',r'));
                      .tickFormat(function(d){return d3.time.format("%x")(new Date(d))})
                      /*.tickFormat(function(d){
                        var datestr = (d+1).toString()
                        //console.log(datestr)
                        var year = datestr.substring(0,4)
                        var month = datestr.substring(4,6)
                        if (month=="00"){
                            month = "02"
                        }
                        var day = datestr.substring(6,8)
                        if (day == "00"){
                            day = "01"
                        }
                        var date_nice = year+"-"+month+"-"+day
                        console.log(date_nice)
                        return d3.time.format("%x")(new Date(date_nice))
                      })*/

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
                        //console.log("data is", d)
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
        //console.log('Changed option ' + index + '. checked: ' + checked);
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

Template.study.rendered = function(){
if(!this._rendered) {
      this._rendered = true;
      //console.log('Template onLoad');
    }
    this.autorun(function(){

    var study = Session.get("currentStudyTag")
    Session.set("myData", null)

    console.log("currentStudy is", study)

    })
}

doBigPlot = function(myData, svg_element){
        _.defer(function () {
                //data.forEach(function(val, idx,arr){
                nv.addGraph(function() {
                    var chart = nv.models.lineChart()
                    //console.log("chart is", chart)
                    chart.margin({left: 75, right:50})  //Adjust chart margins to give the x-axis some breathing room.
                    chart.useInteractiveGuideline(false)  //We want nice looking tooltips and a guideline!
                    chart.duration(350)  //how fast do you want the lines to transition?
                    chart.showLegend(false)       //Show the legend, allowing users to turn on/off line series.
                    chart.showYAxis(true)        //Show the y-axis
                    chart.showXAxis(true)        //Show the x-axis
                    chart.tooltips(false)
                    /*chart.tooltipContent(function(key,x,y,e, graph){
                        if (key ==  '1')
            return '<div id="tooltipcustom">'+'<p id="head">' + x + '</p>' +
                '<p>' + y + ' cent/kWh/h/Runtime ' + '</p></div>'
                    })*/
                    ;
                    chart.xAxis     //Chart x-axis settings
                      .axisLabel('Timepoint')
                      //.tickFormat(d3.format(',r'));
                      .tickFormat(function(d){return d3.time.format("%x")(new Date(d))})


                    chart.yAxis     //Chart y-axis settings
                      .axisLabel("% change")
                      .tickFormat(d3.format('.02f'));


                     d3.select(svg_element)    //Select the <svg> element you want to render the chart in.
                      .datum(myData)         //Populate the <svg> element with chart data...
                      .call(chart);          //Finally, render the chart!
                     //console.log("d3 stuff 2", d3.select('#chart_'+type+" svg"))
                  //Update the chart when window resizes.
                  nv.utils.windowResize(function() { chart.update() });
                  //console.log("chart is", chart)

                  return chart;
                }, function(){

                    /*d3.selectAll(".nv-point").on("click", function(d){
                        //console.log("data is", d)
                        addPapaya(d.info, d.info.entry_type, template_instance)
                        Session.set("currentViewerInfo", d.info)
                    })*/

                    d3.select("svg").selectAll(".nv-group .nv-line").on("mouseover", function(d){
                        //console.log(d)
                        d3.select(this).style("stroke-width", 10)
                        //this.attr("stroke-width", 5)
                    })
                    d3.select("svg").selectAll(".nv-group .nv-line").on("mouseout", function(d){
                        //console.log(d)
                        d3.select(this).style("stroke-width", 2)
                        //this.attr("stroke-width", 5)
                    })



                }); //end addGraph
                //}); //end foreach in data
    }); //end defer

}

Template.plot_project.helpers({

    prep_data: function(){

        var study = Session.get("currentStudyTag")
        Meteor.call("getMsidGroups", study, function(error, result){
            if (result != null){
            var myData = []
            Session.set("totalN", result.length)
            console.log("result is", result)
            result.forEach(function(msid, midx, arr){
                Meteor.subscribe("msid_info", msid, function(){
                    //console.log("done loading", msid)
                    var mse_order = get_mse_order(msid)
                    //console.log("mse order is", mse_order)
                    Meteor.subscribe("mse_info", mse_order,
                                     "mindboggle", "Left-Lateral-Ventricle_volume",
                                     function(){
                                        //console.log("done w/ sub", mse_order, msid)
                                        var data = get_data_xy("demographic", "DCM_StudyDate",
                                       "mindboggle", "Left-Lateral-Ventricle_volume", mse_order, false)
                                        myData.push({values: data, key:msid})
                                        Session.set("myData", myData)
                                     })

                    })

                //console.log("mse order is", mse_order)


            })

        }
            //console.log("myData to plot is", myData)
        })

    },

    plotReady: function(){

        var myData = Session.get("myData")
        var N = Session.get("totalN")
        if (myData == null){
            return false
        }

        return myData.length == N
    },

    plotStatus: function(){
        var myData = Session.get("myData")
        var N = Session.get("totalN")
        if (myData == null){
            return "0/"+N.toString()
        }
        else{
            return myData.length.toString()+"/"+N.toString()
        }

    },

    plot: function(){

        var myData = Session.get("myData")
        var N = Session.get("totalN")
        var svg_element = "#plot_project svg"
        if (N == myData.length){
            doBigPlot(myData, svg_element)
        }


    }

})