
var dg={ };

dg.chartOptions = {  allWidth: 700,
                     allHeight: 800,
                     panelHeight:[[1],[1],[0.7,0.3],[0.5,0.25,0.25]] 
                   };

dg.dgOptions = {
//              labels: ['Date', 'a','b','c','d', 'avg'],
//              ylabel: 'Primary y-axis',
//              y2label: 'Secondary y-axis',
//              yAxisLabelWidth: 90
              title: ''  
              ,titleHeight: 30
//              ,plotter: candlePlotter2,
//              ,plotter: Dygraph.Plotters.linePlotter
              ,connectSeparatedPoints: true  
              ,drawGapEdgePoints: false
              ,strokeWidth:1
              ,pointSize : 5
              ,showRangeSelector:false    // <-------------
              ,showRoller:false

              ,axisLabelColor: 'darkgray' // default black
              ,axisLabelFontSize: 13
              ,axisLabelWidth: 85
              ,axisLineColor: '#696969'//rgba(105,105,105)
              ,axisLineWidth: 0.5 // default 0.3
              ,axisTickSize: 1

              ,drawXAxis: true            // <-------------
              ,drawXGrid: false
              ,drawYGrid: true
              ,gridLineColor: 'lightgray'             

              ,interactionModel:{}  //2014.7
              ,legend: 'always'
//               ,connectSeparatedPoints: true  
              ,labelsSeparateLines: true
              ,labelsDivWidth: 150
              ,labelsDivStyles: {
                'backgroundColor': 'rgba(255, 255, 255, 0)',
//                 'padding': '10px',
                'margin':'0px 0px 0px -20px',
//                 'border': '0px solid black',
//                 'borderRadius': '10px',
//                 'boxShadow': '4px 4px 4px #888'
//                 'right':'30px',
                'text-align':'right'
              },
              highlightCircleSize: 2,            
      
              highlightSeriesOpts: {
                strokeWidth: 3,
                strokeBorderWidth: 0,
                highlightCircleSize: 5,
              }
//               ,animatedZooms: true
              ,colors:  [  "#3366cc","#dc3912","#ff9900","#109618",
                           "#967ADC", "#D770AD", "#ED5565",
                           "#FC6E51", "#A0D468", "#DA4453", "#F6BB42", "#37BC9B", "#E9573F",
                           "#8CC152", "#3BAFDA", "#4A89DC"
                        ]
              ,axes:{       
                        y2: {
//                           labelsKMB: false,
                          drawGrid: false,
                          independentTicks: true,
                highlightCircleSize: 5,
//                           drawPointCallback: Dygraph.Circles.DIAMOND//PENTAGON / STAR  
                          drawHighlightPointCallback: Dygraph.Circles.TRIANGLE
                        },           
                        y: {
                          drawGrid: true,
                          independentTicks: true
                        }

                    }           
                };

// dg.OPTION_OHLC      = { 'plotter': candlePlotter2 };
// dg.OPTION_LINEAR    = { 'plotter': Dygraph.Plotters.linePlotter };
// dg.OPTION_BAR       = { 'plotter': barChartPlotter };
// dg.OPTION_BARS      = { 'plotter': multiColumnBarPlotter };

dg.OPTION_LAST      = { 'showRangeSelector':true,
                        'drawXAxis':true };
dg.OPTION_NOT_LAST  = { 'showRangeSelector':false,
                        'drawXAxis':true };             

//----------------------------------------------------------- chart
  dg.chart = function(panels){
      var blockRedraw=false,
          holder=[];
    
      opt_sync = {
        'drawCallback': function(me, initial){
            if ( blockRedraw || initial ) return;
            blockRedraw = true;
            var range = me.xAxisRange();
            var yrange = me.yAxisRange();
            for (var index in holder) {
                if (holder[index] == me) continue;
                holder[index].updateOptions({
                    dateWindow: range,
//                  valueRange: yrange         //??????
                });
            }
            blockRedraw = false;
          }
        };
    
      $.each(panels,function(i,v){      
          holder.push(v);
          v.updateOptions(opt_sync);
      });                              
      return holder;
  }

//----------------------------------------------------------- panel
    dg.panel = function(dom_id,data){     
        var g = new Dygraph(
                document.getElementById(dom_id),
                data,  
                dg.dgOptions
                );
    //     var lab =  g.getLabels();                                                      
        return g;
    }    

    dg.panel02 = function(dom_id,_OP){             // 2014.7                  
        var dgOption2 = {'labels':_OP._label},     // visibility
            opts = {};

        $.extend(opts,dg.dgOptions,dgOption2);      
        var g = new Dygraph(
                    document.getElementById(dom_id),
                    OP.ppNumber(_OP._num),  
                    opts
                );
    //     var lab =  g.getLabels();                                                      
        return g;
    }

    dg.panel03 = function(dom_id,_OP,_display){             // 2014.7                  
        var dgOption2 = {'labels':_OP._label,   //,
                          'visibility':_display },     // visibility
            opts = {};

        $.extend(opts,dg.dgOptions,dgOption2);      
        var g = new Dygraph(
                    document.getElementById(dom_id),
                    OP.ppNumber(_OP._num),  
                    opts
                );
    //     var lab =  g.getLabels();                                                      
        return g;
    }

    dg.panel05 = function(dom_id,_OP,_display){             // 2014.7                  
        var dgOption2 = {'labels':_OP._label},     // visibility
            opts = {};

        $.extend(opts,dg.dgOptions,dgOption2);      
        var g = new Dygraph(
                    document.getElementById(dom_id),
                    OP.ppNumber(_OP._num),  
                    opts
                );
    //     var lab =  g.getLabels();                                                      
        return g;
    }


 
    dg.setDataVisibility = function(g,label_array){
        g.updateOptions({'visibility':label_array});    
    };
 
//************************************************************ Panel Visibility
dg.setPanelVisibility = function(dg_hold,id_str,panel_shown){
    var numShown  = 0,
        allHeight = Math.floor($(window).height() -40 - $('.ui-header').height()*3.1),//dg.chartOptions['allHeight'],
        allWidth  = Math.floor($(window).width())-30,//dg.chartOptions.allWidth,   
        pHeight,
        $dg,
        iShown    = 0;
    console.log(allHeight + ' : ' + allWidth);
  
    $.each(panel_shown,function(i,v){    // Num. of shown panels
        if(v){ numShown++; }
    }); 
  
    if(numShown==0){  // Display one panel at least
        numShown=1;
        panel_shown[0]=true;
    } 
  
    pHeight = dg.chartOptions.panelHeight[numShown];
  
    $.each(panel_shown,function(i,v){
        $dg = $('#'+id_str[i]);      
        $dg.width(allWidth);
//      $dg.width(allWidth+'px');
        if (v){  
            $dg.height( Math.floor(allHeight * pHeight[iShown]));
            dg_hold[i].updateOptions(dg.OPTION_NOT_LAST);         // 2014.7.14
//          $dg.css('height',allHeight * pHeight[iShown]+'px');
                if(iShown==numShown-1){  // last panel
                  dg_hold[i].updateOptions(dg.OPTION_LAST);
                  console.log('last panel');
                }
            iShown++;
            $dg.show();        
        }
        else{
//             dg_hold[i].updateOptions(dg.OPTION_NOT_LAST);
            $dg.hide();
        }
        ykDOM.updateSW();               
    });         

//   var evt = document.createEvent('UIEvents');
//   evt.initUIEvent('resize', true, false,window,0);
//   window.dispatchEvent(evt);  
};   // end of setPanelVisibility 







//************************************************************ Panel Visibility
dg.setPanelVisibility2 = function(dg_hold,id_str,panel_shown,_scale){
    var numShown  = 0,
        allHeight = Math.floor($(window).height() - $('.ui-header').height()*2.8),//dg.chartOptions['allHeight'],
        allWidth  = Math.floor($(window).width())-30,//dg.chartOptions.allWidth,   
        pHeight,
        $dg,
        iShown    = 0;
  
    $.each(panel_shown,function(i,v){    // Num. of shown panels
        if(v){ numShown++; }
    }); 
  
    if(numShown==0){  // Display one panel at least
        numShown=1;
        panel_shown[0]=true;
    } 
  
    pHeight = dg.chartOptions.panelHeight[numShown];
  
    $.each(panel_shown,function(i,v){
        $dg = $('#'+id_str[i]);      
        $dg.width(allWidth);
        if (v){  
            $dg.height( Math.floor(allHeight * pHeight[iShown] * _scale));
            dg_hold[i].updateOptions(dg.OPTION_NOT_LAST);         // 2014.7.14
                if(iShown==numShown-1){  // last panel
                  dg_hold[i].updateOptions(dg.OPTION_LAST);
                  console.log('last panel');
                }
            iShown++;
            $dg.show();        
        }
        else{
            $dg.hide();
        }
        ykDOM.updateSW();               
    });         


};   // end of setPanelVisibility2 


//------------------------------------------------------------ window resize 

  dg.updateChart=function(){
//     $(window).unbind('resize');
//     console.log('unbind resizeEnd1');

    // patch:
    // https://groups.google.com/forum/#!topic/dygraphs-users/ca53q-4uZ7s
    var preWidth = $(window).width();
    console.log('pre-- '+preWidth);

    var evt = document.createEvent('UIEvents');
    evt.initUIEvent('resize', true, false,window,0);
    window.dispatchEvent(evt);
    console.log('dispatch finish--'+ $(window).width());

    return preWidth;
  }; 
 

dg.setLabel = function(g,_label,_option){   // Y1 or Y2,
//  g.updateOptions({'series':{'volume':{pointSize:3, axis:'y2'}  }});
  var myOption={'series':{}};
  myOption['series'][_label]=_option;    

  g.updateOptions( myOption);
//   console.log(myOption);
};

dg.setPanel = function(g,_option){        
  g.updateOptions(_option);
};

dg.setVisibility = function(g,_label,_boolean){
  g.setVisibility(g.getLabels().indexOf(_label)-1,_boolean);       
}

dg.Y1     = {'axis':'y1'};
dg.Y2     = {'axis':'y2'};
dg.LINEAR = { 'plotter': Dygraph.Plotters.linePlotter };
dg.BAR    = { 'plotter': barChartPlotter };
dg.BARS   = { 'plotter': multiColumnBarPlotter };
dg.OHLC   = { 'plotter': candlePlotter2 };
 
 


// gs only synchronize X-axis

dg.zoomY_bk1 = function(gs){      
  var xRange=gs[0].xAxisRange();
  gs[0].updateOptions({dateWindow: null});
  gs[0].updateOptions({dateWindow:[xRange[0]-3*24*60*60,xRange[1]+3*24*60*60] });

  $.each(gs,function(i,g){
    g.updateOptions({ valueRange: null });   
    var yRange=g.yAxisRanges()[0];     
  
    g.updateOptions({valueRange: [yRange[0],Math.ceil(yRange[1]*1.1)]  }); 
  });       
}

dg.zoomY = function(gs){      
  $.each(gs,function(i,g){
// console.log(i);
    g.updateOptions({ valueRange: null });   
    var yRange=g.yAxisRanges();         
    g.updateOptions({valueRange: [null,Math.ceil(yRange[0][1]*1.2)]  }); 
//  g.updateOptions({valueRange: [yRange[0],Math.ceil(yRange[1]*1.1)]  }); 

//     g.updateOptions({
//       axes:{ y2:{
//       valueRange: [0,Math.ceil( g.yAxisRanges()[1][1]*1.2) ]
//        }}
//     });
  });       
}     

dg.zoomX = function(gs){      
  gs[0].updateOptions({dateWindow: null});
  var xRange=gs[0].xAxisRange();
  gs[0].updateOptions({dateWindow:[xRange[0]-3*24*60*60,xRange[1]+3*24*60*60] });           
}

dg.zoomXY = function(gs){      
  dg.zoomY(gs);
  dg.zoomX(gs);           
}

dg.fullZoom = function(gs){
  $.each(gs,function(i,g){
    g.updateOptions({
      dateWindow: null,
      valueRange: null
    });
  
    var yRange=g.yAxisRanges()[0],
        xRange=g.xAxisRange();
  
    g.updateOptions({
      dateWindow: [xRange[0]-3*24*60*60,xRange[1]+3*24*60*60],
      valueRange: [yRange[0],Math.ceil(yRange[1]*1.0)]
    }); 
  });       
}

dg.DISP_PANEL = [true,true,true]; 
                                                    

function unzoomGraph(g) {   
  g.updateOptions({
    dateWindow: null,
    valueRange: null
  });

  var yRange=g.yAxisRanges()[0],
      xRange=g.xAxisRange();

  g.updateOptions({
    dateWindow: [xRange[0]-3*24*60*60,xRange[1]+3*24*60*60],
    valueRange: [yRange[0],Math.ceil(yRange[1]*1.1)]
  });    
}

function yk_color_maps(){        
//   var cm=['#A2C180','#3D7930','#FFC6A5','#FFFF42','#DEF3BD','#00A5C6','#DEBDDE','#000000'];
  var cm=["#3366cc","#dc3912","#ff9900","#109618","#990099","#0099c6","#dd4477",
          "#66aa00","#b82e2e","#316395","#994499","#22aa99","#aaaa11","#6633cc",
          "#e67300","#8b0707","#651067","#329262","#5574a6","#3b3eac","#b77322",
          "#16d620","#b91383","#f4359e","#9c5935","#a9c413","#2a778d","#668d1c",
          "#bea413","#0c5922","#743411"];
  return cm;     
}



/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
dg.Y2     = {'axis':'y2'};
dg.setLabel = function(g,_label,_option){   // Y1 or Y2,
  var myOption={'series':{}};
  myOption['series'][_label]=_option;  
==> dg.gs[1].updateOptions({'series':{"最低價":{"axis":"Y2"}}});

dg.setLabel(dg.gs[0],'volume',dg.Y2);
dg.setPanel(dg.gs[0],dg.OHLC)
dg.setLabel(dg.gs[0],'ee',dg.LINEAR);   
dg.setLabel(dg.gs[2],'open',dg.Y2)
unzoomGraph(dg.gs[0])   
setVisibility(5, value)   
dg.setVisibility(dg.gs[0],_label,_boolean) 

dg.gs[0].updateOptions({
    valueRange: [g.yAxisRanges()[0][0],g.yAxisRanges()[0][1]]
  }); 

dg.gs[0].updateOptions({
    valueRange: [dg.gs[0].yAxisRanges()[0],dg.gs[0].yAxisRanges()[1]]
  }); 

dg.gs[1].updateOptions({
      axes:{ y2:{
      valueRange: [dg.gs[1].yAxisRanges()[0][1],dg.gs[1].yAxisRanges()[0][1] ]
       }}
    });

dg.gs[1].updateOptions({
      axes:{ y:{
      valueRange: [0,2e9 ]
       }}
    });

 dg.gs[2].updateOptions({
      axes:{ y:{
      valueRange: [0,2e9 ]
       }}
    });
*/




 
