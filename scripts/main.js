/**
 * Created by xuchen509 on 2015/3/15.
 */

// test color wheel

//var n_match  = ntc.name("#CC4444");
//n_rgb        = n_match[0]; // RGB value of closest match
//n_name       = n_match[1]; // Text string: Color name
//n_exactmatch = n_match[2]; // True if exact color match
//
//alert(n_name);



/******************************** Declare Global Variables **********************************/
// set size for canvas to draw charts
var margin = {top: 20, right: 20, bottom: 30, left: 80},
    width = 680 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;


// number of categories of data
var number=1;
// array of colors to fill

// default favorite color
var fav_color="#CC4444";

//var colors={};
var defaultObj = new ColorLib_s(fav_color);
var colors = defaultObj.getLib();
// type of chart -- bar or pie
var chart="bar";
// type of data
var type="";

// tmp variable to save converted RGB and HEX code
var rgbCode=[];
var hexCode=[];
// data structure to store pixel coordinates information
var pixelMap = {};


/********************************* END Declare Global Variables *******************************/



/*************************************** Add Controls *****************************************/

// add control on upload file button
document.getElementById('the_form').addEventListener('submit', handleFileSelect, false);

// add control on column list
$('#columns_list').on('change',':checkbox',function(){
    if (this.checked){
        //alert(this.value);
        addDataFeature(this.value);
        addTabView(this.value);
        if ($("svg").length==0){
            draw_colorWheel("images/colorwheel1.png",function(result){
                //console.log(result);
                pixelMap = result;
                //console.log(pixelMap);
                // future work -- convert color code all to hex and then find x,y and mark it.
            });
            //console.log(pixelMap);
            draw_chart(number,colors,chart);
            //getPosition(colors);
        }
    }else{
        //alert(this.value+'unchecked');
        removeDataFeature(this.value);
        removeTabView(this.value);
    }
});

// add control on chart type
$('#charttype').on('change', function () {
    var value = $(this).find(':selected').text();
    //alert(value);
    if (value=='Bar Chart') {
        chart='bar';
    } else if (value=='Pie Chart') {
        chart='pie';
    }

    // update canvas to draw new chart
    d3.selectAll("svg")
        .remove();
    draw_chart(number,colors,chart);

});

// add control on radio buttons
// on change event for radio buttons to select the type of color code
$(':radio').on('click',function(){
    var value = $('input:radio[name="mode"]:checked').val();
    //alert(value);
    change(value);
});

/*************************************** END Add Controls **************************************/



function handleFileSelect(){
    var file = document.getElementById("the_file").files[0];
    var reader = new FileReader();
    var link_reg = /(http:\/\/|https:\/\/)/i;
    reader.onload = function(file) {
        var content = file.target.result;
        var rows = file.target.result.split(/[\r\n|\n]+/);
        var columnList = document.getElementById('columns_list');
        //var br = document.createElement('br');
            // split the first row to get column names
            var arr = rows[0].split(',');
            // iterate through arr to get each column name
            for (var j = 0; j < arr.length; j++) {
                var colName = arr[j];
                // add checkbox for each column
                var input = document.createElement('input');
                //input.addEventListener('click',updateColumns,false);
                input.setAttribute('id', 'column' + j);
                input.setAttribute('type', 'checkbox');
                input.setAttribute('value',colName);
                var label = document.createElement('label');
                label.innerHTML = colName+"<br>";
                columnList.appendChild(input);
                columnList.appendChild(label);
            }
    };
    reader.readAsText(file);
}

function addDataFeature(val){
    var p = document.createElement('p');
    var labelClass = document.createElement('label');
    var dataFeature = document.getElementById('data_features');
    var selectClass = document.createElement('select');
    var labelDataType = document.createElement('label');
    var br = document.createElement('br');
    var div = document.createElement('div');
    div.style.width = '100%';
    div.style.height = '15%';
    div.setAttribute('id',val);
    p.style.background = 'white';
    p.style.fontWeight = 'normal';
    p.innerHTML = val;
    div.appendChild(p);
    div.appendChild(br);
    labelClass.innerHTML = 'Number of Data Classes: ';
    div.appendChild(labelClass);

    //label.style.align = 'right';
    selectClass.setAttribute('id','barnumber');
    selectClass.setAttribute('name','bar_number');
    //select.style.float = 'right';
    // create dropdown for num of classes
    for(var i=1; i<7;i++){
        var optionClass = document.createElement('option');
        optionClass.setAttribute('value',i);
        optionClass.innerHTML = i;
        //option.style.float = '';
        selectClass.appendChild(optionClass);
    }
    div.appendChild(selectClass);
    div.appendChild(br);

    labelDataType.innerHTML = 'Type of Data: ';
    div.appendChild(labelDataType);
    var selectDataType = document.createElement('select');
    selectDataType.setAttribute('id','datatype');
    selectDataType.setAttribute('name','data_type');
    // create dropdown for data type
    var optionDataType1 = document.createElement('option');
    var optionDataType2 = document.createElement('option');
    var optionDataType3 = document.createElement('option');
    optionDataType1.setAttribute('value','Sequential');
    optionDataType1.selected = true;
    optionDataType1.innerHTML = 'Sequential';
    selectDataType.appendChild(optionDataType1);
    optionDataType2.setAttribute('value','Diverging');
    optionDataType2.innerHTML = 'Diverging';
    selectDataType.appendChild(optionDataType2);
    optionDataType3.setAttribute('value','Qualitative');
    optionDataType3.innerHTML = 'Qualitative';
    selectDataType.appendChild(optionDataType3);
    div.appendChild(selectDataType);

    // append newly created DOM element to dataFeature
    dataFeature.appendChild(div);
    // add control
    $('#'+val+' select#barnumber' ).on('change',function(){
        var value = $('#'+val+' select#barnumber').find(':selected').text();
        number = parseInt(value);

        // update canvas to draw new chart

        d3.selectAll("svg")
            .remove();
        draw_chart(number,colors,chart);

        //alert('barnumber updated:')
    });
    $('#'+val+' select#datatype').on('change',function(){
        var value = $('#'+val+' select#datatype').find(':selected').text();
        updateDataType(value.toLowerCase());
        //alert('datatype updated')
    });
}

function removeDataFeature(val){
    // for debug purpose
    //console.log(val);
    var divToRemove = document.getElementById(val);
    var dataFeature = document.getElementById('data_features');
    dataFeature.removeChild(divToRemove);
}

function addTabView(val){
    var ul = document.getElementById('tab_view');
    var li = document.createElement('li');
    var a = document.createElement('a');
    li.setAttribute('id',val);
    if(ul.childElementCount == 0){
        li.setAttribute('class','active');
    }
    a.setAttribute('href','#'+val);
    a.innerHTML = val;
    li.appendChild(a);
    ul.appendChild(li);
    //addTabContent(val);
    addTabControl();
}

function addTabContent(tabID){
    var parentDiv = document.getElementById('color_wheel');
    var divToAdd = document.createElement('div');
    var content = document.createElement('p');
    divToAdd.setAttribute('id',tabID);
    if(parentDiv.childElementCount == 0){
        divToAdd.setAttribute('class','tab active');
    }
    else{
        divToAdd.setAttribute('class','tab');
    }
    //divToAdd.style.width = '100%';
    //divToAdd.style.height = '50%';
    content.innerHTML = tabID+' : Color Wheel to be added';
    divToAdd.appendChild(content);
    parentDiv.appendChild(divToAdd);
}



function removeTabView(val){
    var liToRemove = document.getElementById(val);
    var ul = document.getElementById('tab_view');
    ul.removeChild(liToRemove);
}

function addTabControl(){
    // JQuery for tab view
    $(document).ready(function() {
        $('.tabs .tab-links a').on('click', function(e)  {
            //console.log('clicked');
            var currentAttrValue = $(this).attr('href');
            var currentColumn = currentAttrValue.substring(1);

            // Show/Hide Tabs
            $('#color_wheel ' + currentAttrValue).fadeIn(400).siblings().hide();

            // change chart area
            // get param to draw chart
            var txt = $('#'+currentColumn+' select#barnumber').find(':selected').text();
            number = parseInt(txt);

            type = $('#'+currentColumn+' select#datatype').find(':selected').text();

            var chartType = $('#charttype').find(':selected').text();

            chart = chartType=="Bar Chart"?"bar":"pie";

            // update canvas to show new chart
            d3.selectAll("svg")
                .remove();
            //console.log("number: "+number+"type: "+type+ "chart: "+chart+"colors:"+colors);

            draw_chart(number,colors,chart);

            draw_colorWheel();
            // Change/remove current tab to active
            $(this).parent('li').addClass('active').siblings().removeClass('active');

            e.preventDefault();

        });
    });
}


// chart ///
// draw bar chart
function draw_bars(number_bar, color_bar) {

    var barPadding = 5;
    var dataset = [];
    // save the colors used in current chart
    var color_legend = [];

    // generate random numbers to draw chart
    for (var i = 0; i < number_bar; i++) {
        var randomnumber=Math.floor(Math.random()*10+10);
        dataset.push(randomnumber);
    }

    // draw a bar chart
    var charts = d3.select("#color_chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("align","center");

    charts.append("g")
        .attr("class", "chart")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

    charts.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return i * (width / dataset.length);
        })
        .attr("y", function(d) {
            return height - (d * 4);
        })
        .attr("width", width / dataset.length - barPadding)
        .attr("height", function(d) {
            return d * 4;
        })
        .attr("fill", function(d,i) {
            color_legend.push(color_bar[i]);
            return color_bar[i];
        });

    // draw color index for the bar chart
    var colorbars = d3.select("#color_index")
        .append("svg")
        .attr("width", width)
        .attr("height", height/2)
        .attr("align","center");

    colorbars.append("g") //make a group to hold our pie chart
        .attr("class", "colorbars")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

    colorbars.selectAll("rect")
        .data(color_legend)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return i * (width/color_legend.length);
        })
        .attr("y", 50)
        .attr("width", width/color_legend.length - barPadding)
        .attr("height", 30)
        .attr("fill", function(d,i) {
            return color_legend[i];
        });

    // add text to color index
    colorbars.selectAll("text")
        .data(color_legend)
        .enter()
        .append("text")
        .attr("x", function(d, i) {
            return i * (width/color_legend.length);
        })
        .attr("y", 90)
        .style("text-anchor", "center")
        .style("font-size", "65%")
        .text(function(d,i) {
            return color_legend[i];
        });
}

// draw pie chart
function draw_pie(number_slice, color_pie) {
    //alert('draw pie');
    var r = 100;
    var barPadding = 5;

    var data = [];
    // save the colors used in current chart
    var color_legend_pie = [];

    // generate random numbers to create bar chart
    for (var i = 0; i < number_slice - 1; i++) {
        var randomnumber=Math.floor(Math.random()*10+10);
        data.push(randomnumber);
    }

    var lastnumber=100 - d3.sum(data);
    data.push(lastnumber);

    // draw a pie chart
    var vis = d3.select("#color_chart")
        .append("svg") //create the SVG element inside the <body>
        .data([data]) //associate our data with the document
        .attr("class","vis")
        .attr("width", width) //set the width and height of our visualization (these will be attributes of the <svg> tag
        .attr("height", height)
        .attr("align","center")
        .append("g") //make a group to hold our pie chart
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

    var arc = d3.svg.arc() //this will create <path> elements for us using arc data
        .outerRadius(r);

    var pie = d3.layout.pie() //this will create arc data for us given a list of values
        .value(function(d) { return d; }); //we must tell it out to access the value of each element in our data array

    var arcs = vis.selectAll("g.slice") //this selects all <g> elements with class slice (there aren't any yet)
        .data(pie) //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
        .enter() //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
        .append("g") //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
        .attr("class", "slice"); //allow us to style things in the slices (like text)

    arcs.append("path")
        .attr("fill", function(d, i) {
            color_legend_pie.push(color_pie[i]);
            return color_pie[i]; } ) //set the color for each slice to be chosen from the color function defined above
        .attr("d", arc); //this creates the actual SVG path using the associated data (pie) with the arc drawing function

    // draw color index for pie chart
    var colorpies = d3.select("#color_index")
        .append("svg")
        .attr("width", width)
        .attr("height", height/2)
        .attr("align","center");

    colorpies.append("g") //make a group to hold our pie chart
        .attr("class", "colorpies")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

    colorpies.selectAll("rect")
        .data(color_legend_pie)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return i * (width/color_legend_pie.length);
        })
        .attr("y", 50)
        .attr("width", width/color_legend_pie.length - barPadding)
        .attr("height", 30)
        .attr("fill", function(d,i) {
            return color_legend_pie[i];
        });

    // add text to color index
    colorpies.selectAll("text")
        .data(color_legend_pie)
        .enter()
        .append("text")
        .attr("x", function(d, i) {
            return i * (width/color_legend_pie.length);
        })
        .attr("y", 90)
        .style("text-anchor", "center")
        .style("font-size", "65%")
        .text(function(d,i) {
            return color_legend_pie[i];
        });

}

// decide which chart to draw
function draw_chart(number, colors, chart) {
    //console.log("draw_chart executing...")
    var colorsToUse = colors[number];
    //console.log(colorsToUse);
    if (chart == 'bar') {
        draw_bars(number,colorsToUse);
    } else if (chart == 'pie') {
        draw_pie(number,colorsToUse);
    }

}

// convert HEX code to RGB code
function hexToRgb(hex_code) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex_code);
    rgbCode = [];
    var r = parseInt(result[1], 16);
    rgbCode.push(r);
    var g = parseInt(result[2], 16);
    rgbCode.push(g);
    var b = parseInt(result[3], 16);
    rgbCode.push(b);
    return rgbCode;
}

// convert RGB code to HEX code
function rgbToHex(rgb_code) {

    var result_2 = rgb_code.substring(4, rgb_code.length - 1 ).split(",");

    var r_c = parseInt(result_2[0].trim());
    var g_c = parseInt(result_2[1].trim());
    var b_c = parseInt(result_2[2].trim());

    hexCode = "#"+toHex(r_c)+toHex(g_c)+toHex(b_c);

    return hexCode;

}

// sub-function of rgbToHex(rgb_code)
function toHex(n) {

    n = parseInt(n,10);
    if (isNaN(n)) return "00";
    n = Math.max(0,Math.min(n,255));
    return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);

}

// trigger event on switching color code between HEX and RGB
function change(value) {
    var id = $("li.active").attr("id");
    var t = $('#'+id+' select#barnumber').find(':selected').text();
    var numberOfClasses = parseInt(t);
    var colorsToChange = colors[numberOfClasses];
    if (value == "rgb") {
        // convert current hex code array to rgb code array

        for (var i=0; i<colorsToChange.length; i++) {
            //console.log(colorsToChange[i]);
            rgbCode=hexToRgb(colorsToChange[i]);
            colorsToChange[i] = "rgb("+rgbCode[0].toString()+","+rgbCode[1].toString()+","+rgbCode[2].toString()+")";
            //console.log(colorsToChange[i]);
        }
        // update canvas to show new chart
        d3.selectAll("svg")
            .remove();
        draw_chart(number,colors,chart);

    } else if (value == "hex") {
        // convert current rgb code array to hex code array
        for (var i=0; i<colorsToChange.length; i++) {
            colorsToChange[i]=rgbToHex(colorsToChange[i]);
        }
        // update canvas to show new chart
        d3.selectAll("svg")
            .remove();
        draw_chart(number,colors,chart);
    }

}

// update colors - general methods
function update_color(fav) {
    //alert('update_color is executing');
    // update favorate color
    //fav_color=fav;

    // get current value of the chosen type of data
    var type_tmp=document.getElementById('datatype');
    var type_chosen=type_tmp.options[type_tmp.selectedIndex];
    var type=type_chosen.value.toLowerCase();

    // update the colors of the bars or pie slices using the chosen type of data
    switch (type) {

        case 'qualitative':

            var colorLib_q = new ColorLib_q(fav);
            colors = colorLib_q.getLib();
            getPosition(colors);
            //colors=update_color_q(fav_color);
            //alert('updated colors'+colors[1]);
            break;

        case 'sequential':

            var colorLib_s = new ColorLib_s(fav);
            colors = colorLib_s.getLib();

            //colors=update_color_s(fav_color);

            break;

        case 'diverging':

            var colorLib_d = new ColorLib_d(fav);
            colors = colorLib_d.getLib();

            //colors=update_color_d(fav_color);

            break;

    }
    //alert(colors);
    // check which color code is checked
    var color_code = document.getElementById('rgbbox');
    var first_digit = "";

    // keep color array updated with chosen color code
    if (color_code.checked) {
        first_digit=colors[0].substring(0,1);
        if (first_digit === "#") {
            for (var i=0; i<colors.length; i++) {
                rgbCode=hexToRgb(colors[i]);
                colors[i] = "rgb("+rgbCode[0].toString()+","+rgbCode[1].toString()+","+rgbCode[2].toString()+")";
            }
        }
    }

    // update canvas to draw new chart
    d3.selectAll("svg")
        .remove();
    draw_chart(number,colors,chart);

}

function updateDataType(value){
    // update colors and type of data with the value chosen in dropdown menu
    switch (value) {

        case 'qualitative':
            var colorLib_q = new ColorLib_q(fav_color);
            colors = colorLib_q.getLib();
            //colors = update_color_q(fav_color);
            type = "qualitative";
            break;

        case 'sequential':

            var colorLib_s = new ColorLib_s(fav_color);
            colors = colorLib_s.getLib();
            //colors = update_color_s(fav_color);
            type = "sequential";
            break;

        case 'diverging':

            var colorLib_d = new ColorLib_d(fav_color);
            colors = colorLib_d.getLib();

            //colors = update_color_d(fav_color);
            type = "diverging";
            break;

    }

    // check which color code is checked
    var color_code_2 = document.getElementById('rgbbox');
    var first_digit_2 = "";

    // keep color array updated with chosen color code
    if (color_code_2.checked) {
        first_digit_2 = colors[0].substring(0, 1);
        if (first_digit_2 === "#") {
            for (var i = 1; i < 7; i++) {
                rgbCode = hexToRgb(colors[i]);
                colors[i] = "rgb(" + rgbCode[0].toString() + "," + rgbCode[1].toString() + "," + rgbCode[2].toString() + ")";
            }
        }
    }
    // update canvas to draw new chart
    d3.selectAll("svg")
        .remove();
    draw_chart(number,colors,chart);
}


function getPosition(colorMap){
    var color_rgb;
    for(var key in colorMap){
        //color = colorList[i];
        console.log("for loop: "+colorMap[key]);
        var value = $('input:radio[name="mode"]:checked').val();
        //alert(value);
        //if (value == "hex"){
        //    color_rgb = hexToRgb(colorMap[key]);
        //}else{
        //    color_rgb = colorMap[key];
        //}

        if (color_rgb in pixelMap){
            console.log("map: "+pixelMap[color_rgb]);
        }else{
            console.log("not in map");
        }
        //console.log(colorList[i]);
        //var color_rgb = hexToRgb(color);
        //if (color_rgb in pixelMap){
        //    posList = pixelMap[color_rgb];
        //    console.log("position: "+posList);
        //}
    }
}