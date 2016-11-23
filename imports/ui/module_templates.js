import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './module_templates.html';
import "./d3_plots.js"

window.pcz = {}

var zcolorscale = d3.scale.linear()
  .domain([-2,-0.5,0.5,2])
  .range(["brown", "#999", "#999", "steelblue"])
  .interpolate(d3.interpolateLab);

  // return color function based on plot and dimension

  // return color function based on plot and dimension
  function zcolor(col, dimension) {
    var z = zscore(_(col).pluck(dimension).map(parseFloat))
    return function(d) { return zcolorscale(z(d[dimension])) }
  };

  // color by zscore
  function zscore(col) {
    var n = col.length,
        mean = _(col).mean(),
        sigma = _(col).stdDeviation();
    return function(d) {
      return (d-mean)/sigma;
    };
  };


get_filter = function(entry_type){

 var globalSelector = Session.get("globalSelector")
    var myselect = {}
    myselect["entry_type"] = entry_type

    if (globalSelector){
        globalKeys = Object.keys(globalSelector)
        //console.log("global keys are", globalKeys, globalKeys.indexOf(entry_type))
        if (globalKeys.indexOf(entry_type) >= 0){
            var localKeys = Object.keys(globalSelector[entry_type])
            //console.log("local keys are", localKeys)
            for (i=0;i<localKeys.length;i++){
                myselect[localKeys[i]] = globalSelector[entry_type][localKeys[i]]
            }//end for
        };//end if

        //console.log("selector for", entry_type, "is", myselect)

        // In this part, if another filter has filtered subjects, then filter on the rest
        var subselect = Session.get("subjectSelector")

        if (subselect["subject_id"]["$in"].length){
            myselect["subject_id"] = subselect["subject_id"]
        }
        //console.log("myselect is", myselect)
        return myselect
    }


}

get_metrics = function(entry_type){
    Meteor.call("get_metric_names", entry_type, function(error, result){
            Session.set(entry_type+"_metrics", result)
        })
        return Session.get(entry_type+"_metrics")
}

render_histogram = function(entry_type){
                var metric = Session.get("current_"+entry_type)//"Amygdala"
                if (metric == null){
                    var all_metrics = Session.get(entry_type+"_metrics")

                    if (all_metrics != null){
                        Session.set("current_"+entry_type, all_metrics[0])
                    }

                }

                if (metric != null){
                    var filter = get_filter(entry_type)
                    //console.log("filter is", filter)
                    Meteor.call("getHistogramData", entry_type, metric, 20, filter, function(error, result){
                    //console.log("result is", result)
                    var data = result["histogram"]
                    var minval = result["minval"]
                    var maxval = result["maxval"]
                    if (data.length){
                        do_d3_histogram(data, minval, maxval, metric, "#d3vis_"+entry_type, entry_type)
                    }
                    else{
                        console.log("attempt to clear histogram here")
                    }


                    });
                }
}

render_parcoor = function(entry_type){
  var metric = Session.get("current_"+entry_type)//"Amygdala"
  if (metric == null){
      var all_metrics = Session.get(entry_type+"_metrics")

      /*if (all_metrics != null){
          Session.set("current_"+entry_type, all_metrics)
      }*/
  }

  var metrics = Session.get(entry_type+"_metrics")


  if (metrics != null){
      var filter = get_filter(entry_type)
      //console.log("filter is", filter)
      Meteor.call("getAllData", entry_type, metrics, 20, filter, function(error, result){
      //console.log("result is", result)
      var data = result["data"]

      if (data.length){
        //$(".parcoords_"+entry_type).height("200px");
          window.pcz[entry_type] = window.pcz[entry_type] || d3.parcoords()("#parcoords_"+entry_type)
          var pcz = window.pcz[entry_type]
          pcz.data(data)
                  .bundlingStrength(1) // set bundling strength
                  .smoothness(0)
                  .alphaOnBrushed(.1)
                  //.bundleDimension("cylinders")
                  .showControlPoints(false)
                  //.hideAxis(me.hideKeys)
                  .render()
                  .brushMode("1D-axes")
                  .reorderable()
                  .interactive();
          pcz.brushReset()
          var change_color = function(dimension) {
                pcz.svg.selectAll(".dimension")
                  .style("font-weight", "normal")
                  .filter(function(d) { return d == dimension; })
                  .style("font-weight", "bold")
                console.log("dimension", dimension)
                pcz.color(zcolor(pcz.data(),dimension)).render()
              }

          //change_color(metrics[0]);
          pcz.svg.selectAll(".dimension")
                  .on("click", change_color)
                  .selectAll(".label")
                  .style("font-size", "14px");


          pcz.on("brushend", function(){
            console.log(pcz.brushExtents())

            var metrics = pcz.brushExtents()
            $.each(metrics, function(metric, value){
                var newkey = "metrics."+metric
                var gSelector = Session.get("globalSelector")
                if (Object.keys(gSelector).indexOf(entry_type) < 0 ){
                    gSelector[entry_type] = {}
                }
                gSelector[entry_type][newkey] = {$gte: value[0], $lte: value[1]}
                Session.set("globalSelector", gSelector)

                var filter = get_filter(entry_type)
                filter[newkey] = {$gte: value[0], $lte: value[1]}

                Meteor.call("get_subject_ids_from_filter", filter, function(error, result){
                    //console.log("result from get subject ids from filter is", result)
                    var ss = Session.get("subjectSelector")
                    ss["subject_id"]["$in"] = result
                    Session.set("subjectSelector", ss)
                })

            })

            /*var newkey = "metrics."+metric


            var gSelector = Session.get("globalSelector")
            if (Object.keys(gSelector).indexOf(entry_type) < 0 ){
                gSelector[entry_type] = {}
            }
            gSelector[entry_type][newkey] = {$gte: extent0[0], $lte: extent0[1]}
            Session.set("globalSelector", gSelector)

            var filter = get_filter(entry_type)
            filter[newkey] = {$gte: extent0[0], $lte: extent0[1]}

            Meteor.call("get_subject_ids_from_filter", filter, function(error, result){
                //console.log("result from get subject ids from filter is", result)
                var ss = Session.get("subjectSelector")
                ss["subject_id"]["$in"] = result
                Session.set("subjectSelector", ss)
            })*/





          })
          //$("#search_metric_"+entry_type).select2({data: metrics, theme:"bootstrap"});

      }
      else{
          console.log("empty parcoords data")
      }


      });
  }
}

Template.demographic.rendered = function() {

      if (!this.rendered){
        this.rendered = true
         }




       this.autorun(function() {
                render_histogram("demographic")

       }); //end autorun



  }





Template.qa.rendered = function() {

      if (!this.rendered){
        this.rendered = true
         }




       this.autorun(function() {
                render_histogram("qa")
                render_parcoor("qa")
       }); //end autorun



  }





Template.ants.rendered = function() {

      if (!this.rendered){
        this.rendered = true
         }




       this.autorun(function() {
                render_histogram("ants")

       }); //end autorun



  }







Template.demographic.helpers({

selector: function(){return get_filter("demographic")},



metric: function(){
        return get_metrics("demographic")
    },
currentMetric: function(){
        return Session.get("current_demographic")
    }



})



Template.qa.helpers({

selector: function(){return get_filter("qa")},



metric: function(){
        return get_metrics("qa")
    },
currentMetric: function(){
        return Session.get("current_qa")
    }



})



Template.ants.helpers({

selector: function(){return get_filter("ants")},



metric: function(){
        return get_metrics("ants")
    },
currentMetric: function(){
        return Session.get("current_ants")
    }



})





   Template.demographic.events({
    "change #metric-select-demographic": function(event, template){
        var metric = $(event.currentTarget).val()
        console.log("metric: ", metric)
        Session.set("current_demographic", metric)
    }
   })



   Template.qa.events({
    "change #metric-select-qa": function(event, template){
        var metric = $(event.currentTarget).val()
        console.log("metric: ", metric)
        Session.set("current_qa", metric)
    }
   })



   Template.ants.events({
    "change #metric-select-ants": function(event, template){
        var metric = $(event.currentTarget).val()
        console.log("metric: ", metric)
        Session.set("current_ants", metric)
    }
   })
