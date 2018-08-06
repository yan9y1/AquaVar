var arrayMap = arraymap();
var gridster;
var currentId = 1;
var gutter = 15; // ul#sortable li
var item_padding = 5;
var right_margin = 20;
var sortable_margin_top = 60; // ul#sortable
var aqv_remove_height = 15; // div.aqv-item-control
var cols_max = 6;
var bloc_width = Math.floor(($(window).width() - right_margin - 7 * gutter) / 6);
var bloc_height = Math.floor(($(window).height() - 5 * gutter - sortable_margin_top) / 4);
var left_v;
var top_v;
var w_width;
var h_height;
var d3 = Plotly.d3;
var LivePlotId = 0;

var plotNum = 0;
var widgetsNum = 1;

function arraymap() {
    var ids = [];
    var maps = [];
    return {
        addMap: function (id, map) {
            var i;
            for (i = 0; i < ids.length && ids[i] != id; i++);
            if (i < ids.length)
                maps[i] = map;
            else {
                ids.push(id);
                maps.push(map);
            }
        },
        getMap: function (id) {
            var i;
            for (i = 0; i < ids.length && ids[i] != id; i++);
            if (i < ids.length)
                return maps[i];
            return undefined;
        }
    }
}

//// resize ////

function resizeItem($li) {
    var $item = $li.find('.aqv-item');
    if ($item.hasClass("aqv-plot")) {
        var adjust_layout = {
            width: $li.innerWidth() - item_padding,
            height: $li.innerHeight() - aqv_remove_height - item_padding
        };
        Plotly.relayout($item.attr("id"), adjust_layout);
    }
    else if ($item.hasClass("aqv-map")) {
        $item.width($li.innerWidth() - item_padding);
        $item.height($li.innerHeight() - aqv_remove_height - item_padding);
        setTimeout(function () { arrayMap.getMap($item.attr("id")).invalidateSize() }, 400);
    }
    else if ($item.hasClass("aqv-iframe")) {
        $item.width($li.innerWidth() - item_padding);
        $item.height($li.innerHeight() - aqv_remove_height - item_padding);
        var $iframe = $item.find("iframe")
        $iframe.width($item.innerWidth());
        $iframe.height($item.innerHeight());
    }
}

//// grilles ////

function resizeAll() {
    $(".aqv-item").fadeOut(500, function () {
        gridster.resize_widget_dimensions({
            widget_base_dimensions: [bloc_width, bloc_height],
            // max_cols: cols_max,
            widget_margins: [gutter, gutter]
        })
    });
    setTimeout(function () {
        $(".aqv-widget").each(function () {
            resizeItem($(this));
        });
        $(".aqv-item").fadeIn(500)
    },
        800
    );
}

function resize2x3() {
    var draggables=document.getElementsByClassName("draggable");
    for(i = 0; i < draggables.length; i++){
        draggables[i].style.width = "30%";
        draggables[i].style.height = "45%";
        draggables[i].style.top = (10 + parseInt(i / 3) * 50) + "%";
        draggables[i].style.left = (i % 3 * 33) + "%";
    }
}

function resize3x4() {
    cols_max = 8;
    bloc_width = Math.floor(($(window).width() - right_margin - 9 * gutter) / 8);
    bloc_height = Math.floor(($(window).height() - 7 * gutter - sortable_margin_top) / 6);
    resizeAll();
}

function resize3x3() {
    cols_max = 6;
    bloc_width = Math.floor(($(window).width() - right_margin - 7 * gutter) / 6);
    bloc_height = Math.floor(($(window).height() - 7 * gutter - sortable_margin_top) / 6);
    resizeAll();
}

//// widgets ////
// function qui crée un widget pour le plot
// function newWidgetPlot(wclass) {
//     var imgr = "<img class=\"aqv-remove\" src=\"images/remove.png\">";
//     var id = newId();
//     var div2 = "<div id=\"" + id + "\" class=\"aqv-item " + wclass + "\"></div>";
//     var newli = "<li class=\"aqv-widget\">" + div2 + imgr + "</li>";
//     return { li: newli, id: id };
// }

function newId() {
    return "aqv-id-" + currentId++;
}

//ajout d'un widget radar à la grille, ce widget peut-être aussi supprimé de la grille
function newRadar() {
    widgetsNum++;
    var header = document.getElementById("header");
    var map = document.createElement("div");
    map.setAttribute("class","draggable");
    map.setAttribute("onmousedown","firstLayout(this)");
    map.setAttribute("style","position:absolute;z");
    var iframe = "<iframe width=\"100%\" height=\"90%\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" src=\"http://www.radareu.cz\" onload=\"trigger();\"></iframe>"
    var img = "<div id = \"Imgs\">"
    var img1 = "<img id=\"image\" onclick = \"removeWidget(this)\" src=\"images/close.png\">";
    var img2 = "<img id=\"plus\" onclick=\"relargeWidget(this)\" src=\"images/plus.png\" alt=\"\">";
    var img3 = "<img id=\"minus\" onclick=\"rebackWidget(this)\" src=\"images/minus.png\" alt=\"\"> </div>";
    img = img + img1 + img2 + img3;
    var inner = iframe + img;
    map.innerHTML = inner;
    map.style.zIndex = widgetsNum;
    header.parentNode.insertBefore(map,header.nextSibling);

    $( ".draggable" ).draggable();
    $( ".draggable" ).resizable();
}

//ajout d'un widget SIGMap de la grille, ce widget peut-être aussi supprimé de la grille
function newSIGMap() {
    widgetsNum++;
    var header = document.getElementById("header");
    var map = document.createElement("div");
    map.setAttribute("class","draggable");
    map.setAttribute("onmousedown","firstLayout(this)");
    map.setAttribute("style","position:absolute;");
    var iframe = "<iframe width=\"100%\" height=\"90%\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" src=\"https://sig.nicecotedazur.org/appli/?site=signcajs_aquavar\" onload=\"trigger();\"></iframe>"
    
    var img = "<div id = \"Imgs\">"
    var img1 = "<img id=\"image\" onclick = \"removeWidget(this)\" src=\"images/close.png\">";
    var img2 = "<img id=\"plus\" onclick=\"relargeWidget(this)\" src=\"images/plus.png\" alt=\"\">";
    var img3 = "<img id=\"minus\" onclick=\"rebackWidget(this)\" src=\"images/minus.png\" alt=\"\"> </div>";
    img = img + img1 + img2 + img3;

    var inner = iframe + img;
    map.innerHTML = inner;
    map.style.zIndex = widgetsNum;
    header.parentNode.insertBefore(map,header.nextSibling);

    $( ".draggable" ).draggable();
    $( ".draggable" ).resizable();
}

function getDataByPeriod(layerValue,deviceID, canalID, dateDebut, dateFin, typeOfData, xaxis_title, yaxis_title, line_color) {
    var ncaurl = "https://scows.nicecotedazur.org/services/1.2/REST/getDataByPeriod/" + deviceID + "/" + canalID + "/" + dateDebut + "/" + dateFin;
    // var auth = '{ "login": "MadouzaT", "password": "Nlro1LMe5eBoe5G9eZ" }';
    console.log(ncaurl);
    var graph_title = layerValue + ' - ' + typeOfData;

    // var xhttp = new XMLHttpRequest();
    // xhttp.open("POST", ncaurl, true);
    // xhttp.setRequestHeader("Content-type", "application/json");
    // xhttp.send(auth);
    // var response = JSON.parse(xhttp.response);
    // console.log(JSON.stringify(response));

    // jQuery.ajax({
    //     type: "POST",
    //     url: ncaurl,
    //     contentType: "application/json; charset=utf-8",
    //     headers: { "Access-Control-Request-Headers": "x-requested-with" },
    //     dataType: "json",
    //     data: JSON.stringify(auth),
    //     crossDomain: true,
    //     processData: false,
    //     success: function (result) {
    //         console.log("succes");
    //     },

    //     error: function (error) {
    //         console.log("error");
    //     }

    // });

    jQuery.ajax({
        async: true,
        crossDomain: true,
        url: ncaurl,
        method: "POST",
        headers: {"content-type": "application/json"},
        processData: false,
        data: "{\"login\":\"Madouza\",\n\"password\":\"Ph5dFf265LhgfdH1Jg\"}",
        success: function (result) {
            console.log("succes");
        },
        error: function (error) {
            console.log("error");
        }
    }).done(function (response) {
        var datas=response.elaboratedData[0].basicDataValue;
        var values=[];
        var times=[];
      
        function compare(a,b) {
            var diff = Date.parse(a.canalTime.Value) - Date.parse(b.canalTime.Value);
            return diff;
        }
        datas.sort(compare);
        
        for (j = 0; j < datas.length; j++) {
            
          var time;
          var value;
          if(datas[j].canalTime==null){
            time=null;
          } 
          
          if(datas[j].canalTime!=null){
            time=datas[j].canalTime.Value;
          }

        //   var time=moment(datas[j].canalTime.Value).format('LT');
          times.push(time);

          if(datas[j].sensorValue==null){
            value = null;
          }

          if(datas[j].sensorValue!=null){
            value = datas[j].sensorValue.text;
          }
          
          values.push(value);
          console.log("time:" + time + " value:" +  value);
        };
        newCapteurPlot(times,values, graph_title, xaxis_title, yaxis_title,line_color);
    });
}


function newCapteurTimeSeries(x_data, y_data, graph_title, xaxis_title, yaxis_title, line_color) {
    var neww = newWidgetPlot("aqv-plot");
    var newli = neww.li;
    var id = neww.id;

    gridster.add_widget(newli, 2, 2);

    $("#" + id).next().click(function () {
        gridster.remove_widget($(this).parent());
    });

    var trace = {
        type: "scatter",
        mode: "lines",
        name: yaxis_title,
        x: x_data,
        y: y_data,
        line: {
            color: line_color
        }
    };

    var data = [trace];

    var layout = {
        title: graph_title,
        width: $("#" + id).parent().innerWidth() - item_padding,
        height: $("#" + id).parent().innerHeight() - aqv_remove_height - item_padding
    };

    Plotly.newPlot(id, data, layout);
}

function resizeFun(obj){
    var hheight = obj.style.height;
    var wwidth = obj.style.width;

    var heightArray = hheight.split("p");
    var heightInt = parseInt(heightArray[0]) * 0.94;

    var widthArray = wwidth.split("p");
    var widthInt = parseInt(widthArray[0]) * 0.96;

    if(widthArray.length == 1){
        var widthPercentArray = wwidth.split("%");
        var wInt = parseInt(widthPercentArray[0]);
        widthInt = $(window).width() * wInt / 100 * 0.96;

    }

    if(heightArray.length == 1){
        var heightPercentArray = hheight.split("%");       
        var hInt = parseInt(heightPercentArray[0]);
        heightInt = $(window).height() * hInt / 100 * 0.94;
    }

    var update = {
        width:widthInt,
        height:heightInt
    };
    Plotly.relayout(obj.children[0],update);
}

function newTimeSeries() {
    widgetsNum++;
    plotNum++;
    var header = document.getElementById("header");
    var map = document.createElement("div");
    map.setAttribute("class","draggable graph");
    map.setAttribute("onmousedown","firstLayout(this)");
    map.setAttribute("style","position:absolute; height:300px; width:500px;");
    map.setAttribute("onresize","resizeFun(this)");
    var child = "<div class = \"plot\" style = \"height:94%; width:96%; margin-left:2%;\"></div>";
   
    var img = "<div id = \"Imgs\">"
    var img1 = "<img id=\"image\" onclick = \"removeWidget(this)\" src=\"images/close.png\">";
    var img2 = "<img id=\"plus\" onclick=\"relargeWidget(this)\" src=\"images/plus.png\" alt=\"\">";
    var img3 = "<img id=\"minus\" onclick=\"rebackWidget(this)\" src=\"images/minus.png\" alt=\"\"> </div>";
    img = img + img1 + img2 + img3;
    map.innerHTML = child + img;

    map.style.zIndex = widgetsNum;
    header.parentNode.insertBefore(map,header.nextSibling);

    $( ".draggable" ).draggable();
    $( ".draggable" ).resizable();

    var plot = document.getElementsByClassName("plot");
    plot[0].onmousedown = function(event){
        event.stopPropagation();
    }

    
   d3.csv("csv/finance-charts-apple.csv", function (err, rows) {

        function unpack(rows, key) {
            return rows.map(function (row) {
                return row[key];
            });
        }

        var trace1 = {
            type: "scatter",
            mode: "lines",
            name: 'AAPL High',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'AAPL.High'),
            line: {
                color: '#17BECF'
            }
        };

        var trace2 = {
            type: "scatter",
            mode: "lines",
            name: 'AAPL Low',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'AAPL.Low'),
            line: {
                color: '#7F7F7F'
            }
        };

        var data = [trace1, trace2];

        var layout = {
            title: 'Basic Time Series',
            width: 480,
            height: 280,
        };

        Plotly.newPlot(plot[0], data, layout);
    });
}

function newCapteurPlot( x_data, y_data, graph_title, xaxis_title, yaxis_title, line_color){
    var neww = newWidgetPlot("aqv-plot");
    var newli = neww.li;
    var id = neww.id;

    gridster.add_widget(newli, 2, 2);

    $("#" + id).next().click(function () {
        gridster.remove_widget($(this).parent());
    });

    var data = [{
        x: x_data,
        y: y_data,
        mode: 'lines',
        line: {
            color: line_color
        }
    }];
    var layout = {
      title: graph_title,
      width: $("#" + id).parent().innerWidth() - item_padding,
      height: $("#" + id).parent().innerHeight() - aqv_remove_height - item_padding, 
      xaxis: {
        title: xaxis_title
      },
      yaxis: {
        title: yaxis_title,
        rangemode: 'tozero',
        autorange: true
      }
    };
    Plotly.newPlot(id, data, layout);
    resizeItem($("#" + id).parent());
}

function enlargeWidget(obj){
    var parnode=obj.parentNode;
    left_v=parnode.parentNode.style.left;
    top_v=parnode.parentNode.style.top;
    w_width=parnode.parentNode.style.width;
    h_height=parnode.parentNode.style.height;
    parnode.parentNode.style.width="80%";
    parnode.parentNode.style.height="70%";
    parnode.parentNode.style.left="20px";
    parnode.parentNode.style.top="80px";
    resizeFun(parnode.parentNode);
}

function restoreWidget(obj){
    var parnode=obj.parentNode;
    parnode.parentNode.style.width=w_width;
    parnode.parentNode.style.height=h_height;
    parnode.parentNode.style.left=left_v;
    parnode.parentNode.style.top=top_v;
    resizeFun(parnode.parentNode);
}

//arrange button
function arrange(awidth,aheight,aline) {
    var draggables=document.getElementsByClassName("draggable");
    for(i = 0; i < draggables.length; i++){
        draggables[i].style.width = awidth;
        draggables[i].style.height = aheight;
        draggables[i].style.top = (10 + parseInt(i / aline) * (parseInt(aheight) + 5)) + "%";
        draggables[i].style.left = (i % aline * (parseInt(awidth) + 3)) + "%";
    }

    var graphDiv = document.getElementsByClassName("graph");
    for(var i = 0; i < graphDiv.length; i++){
        resizeFun(graphDiv[i]);
    }
}

function arrange1x1(){
    var awidth = "95%";
    var aheight = "85%";
    var aline = 1;
    arrange(awidth,aheight,aline);
}

function arrange1x2(){
    var awidth = "47%";
    var aheight = "85%";
    var aline = 2;
    arrange(awidth,aheight,aline);
}

function arrange2x3(){
    var awidth = "30%";
    var aheight = "40%";
    var aline = 3;
    arrange(awidth,aheight,aline);
}

function arrange3x3(){
    var awidth = "30%";
    var aheight = "25%";
    var aline = 3;
    arrange(awidth,aheight,aline);
}

function arrange3x4(){
    var awidth = "22%";
    var aheight = "25%";
    var aline = 4;
    arrange(awidth,aheight,aline);
}

function arrange4x5(){
    var awidth = "16%";
    var aheight = "18%";
    var aline = 5;
    arrange(awidth,aheight,aline);
}

function liveDataPlot() {
    widgetsNum++;
    plotNum++;
    var header = document.getElementById("header");
    var map = document.createElement("div");
    map.setAttribute("class","draggable graph");
    map.setAttribute("onmousedown","firstLayout(this)");
    map.setAttribute("style","position:absolute; height:300px; width:500px;");
    map.setAttribute("onresize","resizeFun(this)");
    var child = "<div class = \"plot\" style = \"height:94%; width:96%; margin-left:2%;\"></div>";

    var img = "<div id = \"Imgs\">"
    var img1 = "<img id=\"image\" onclick = \"removeWidget(this)\" src=\"images/close.png\">";
    var img2 = "<img id=\"plus\" onclick=\"relargeWidget(this)\" src=\"images/plus.png\" alt=\"\">";
    var img3 = "<img id=\"minus\" onclick=\"rebackWidget(this)\" src=\"images/minus.png\" alt=\"\"> </div>";
    img = img + img1 + img2 + img3;

    map.innerHTML = child + img;
    map.style.zIndex = widgetsNum;
    header.parentNode.insertBefore(map,header.nextSibling);

    $( ".draggable" ).draggable();
    $( ".draggable" ).resizable();

    var plot = document.getElementsByClassName("plot");
    plot[0].onmousedown = function(event){
        event.stopPropagation();
    }

    var time = new Date();

    var data = [{
        x: [time],
        y: [Math.random()],
        mode: 'lines',
        line: {
            color: '#80CAF6'
        }
    }];

    var layout = {
        title: 'Basic Live Data',
        width: 500,
        height: 300
    };
    Plotly.newPlot(plot[0], data, layout);
    var cnt = 0;

    var interval = setInterval(function () {

        var time = new Date();

        var update = {
            x: [[time]],
            y: [[Math.random()]]
        };

        Plotly.extendTraces(plot[0], update, [0]);

        if (cnt === 100)
            clearInterval(interval);
    }, 1000);
}

$(document).ready(function () {
    // affichage de l'heure
    setInterval(function () {
        var now = new Date();
        $("#dateGMT").text(now.toString());
        $("#dateUTC").text(now.toGMTString());
    }, 1000);

    // right menu bindings
    $("#aqv-liveDataPlot").click(liveDataPlot);
    $("#aqv-timeSeriesPlot").click(newTimeSeries);
    $("#aqv-newRadar").click(newRadar);
    $("#aqv-newSIGMap").click(newSIGMap);
    $("#aqv-resize2x3").click(resize2x3);
    $("#aqv-resize3x3").click(resize3x3);
    $("#aqv-resize3x4").click(resize3x4);

    $("#aqv-arrange1x1").click(arrange1x1);
    $("#aqv-arrange1x2").click(arrange1x2);
    $("#aqv-arrange2x3").click(arrange2x3);
    $("#aqv-arrange3x3").click(arrange3x3);
    $("#aqv-arrange3x4").click(arrange3x4);
    $("#aqv-arrange4x5").click(arrange4x5);



    gridster = $(".gridster ul").gridster({
        widget_base_dimensions: [bloc_width, bloc_height],
        // max_cols: cols_max,
        widget_margins: [gutter, gutter],
        resize: {
            enabled: true,
            start: function (x, y, z) {
                z.find('.aqv-item').hide();
            },
            stop: function (x, y, z) {
                z.find('.aqv-item').show();
                resizeItem(z);
            }
        }
    }).data('gridster');

    $.sidebarMenu($('.sidebar-menu'));
    $.sidebarMenu($('.sidebar-menu-rtl'));

    $('#menu-button').click(function () {
        $('.animate-menu-right').toggleClass('animate-menu-open');
    })
});

function removeWidget(obj){
    widgetsNum--;
    var p = obj.parentNode;
    var gp = p.parentNode;
    gp.parentNode.removeChild(gp);
}

function cycle(){
    var draggables = document.getElementsByClassName("draggable");
    var l = draggables.length;
    for(var i = 0; i < l; i++){
        var item = draggables[i];
        var indexTmp = item.style.zIndex;
        if(indexTmp == 1){
            item.style.zIndex = l;
        }else{
            item.style.zIndex = indexTmp - 1;
        }
    }
}

//click the widget,let it come to the first layout
function firstLayout(obj){
    var draggables=document.getElementsByClassName("draggable");
    var l = draggables.length;
    for(var i = 0; i < l; i++){
        var item = draggables[i];
        var indexTmp = item.style.zIndex;
        if(indexTmp > obj.style.zIndex){
            item.style.zIndex = indexTmp - 1;
        }
    }
    obj.style.zIndex = l;
}

//when the size of the broswer is changed, call this function.
function windowResize(){
    var graphDiv = document.getElementsByClassName("graph");
    for(var i = 0; i < graphDiv.length; i++){
        resizeFun(graphDiv[i]);
    }

    //modify the bkground's size;
    var bkground = document.getElementById("bkground");
    var w = $(window).width() + "px";
    var h = $(window).height() + "px";
    bkground.style.height = h;
    bkground.style.width = w;
}

window.onresize = windowResize;

//add the keyboard event
document.onkeydown=function(e){ 
    var keyNum=window.event ? e.keyCode :e.which;       
    if(keyNum==39){
        cycle();
    }
}   