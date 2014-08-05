var OP={};
OP.tFILL = NaN; //null or NaN
/*
OP.stock[0] = { 'stkID'     :'',
                'daily'     :[],
                'monthly'   :[],
                'quarterly' :[],
                'output'    :[] 
              };      
*/ 


OP.loadCSV = function(file){
// console.log('fname: '+file[0]);
// function loadCSV(file) {
    var request,data;
    if (window.XMLHttpRequest) {  // IE7+, Firefox, Chrome, Opera, Safari
        request = new XMLHttpRequest();
    } else {                      // IE6, IE5   
        request = new ActiveXObject('Microsoft.XMLHTTP');
    }
    // load
    request.open('GET', file, false);
//     request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=ISO-8859-1')
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8')
    request.send();
//    OP.FILE = request.responseText;
    return request.responseText;
//    return data;
}

OP.getTitlesFromFile = function(fileName, sep){
    var fileStr = OP.loadCSV(fileName);
    //replace UNIX new lines
    var data = fileStr.replace (/\r\n/g, "\n");
    //replace MAC new lines
    data = data.replace (/\r/g, "\n");
    
    //split into rows
    var rows = data.split(",\n"),
        sperator = sep || ",";        
    var title_cells=rows[0].split(",");
    
    return  title_cells.slice(1);
}

OP.getData = function(file){
  //replace UNIX new lines
  rData = file.replace (/\r\n/g, "\n");
  //replace MAC new lines
  rData = rData.replace (/\r/g, "\n");
  
  //split into rows
  var rows = rData.split("\n");    
  titles=rows[0].split("\t");
  var COL_NUM = titles.length,
      csvdata=[];            
  console.log(csvdata.join(':'));
  for (var i = 0; i < rows.length; i++) {
    if (rows[i]) {   // this line helps to skip empty rows
      var columns = rows[i].split("\t");
      csvdata.push(rows[i].split("\t"));
      }

    for(var j=1;j<COL_NUM;j++){
      csvdata[i][j]=parseFloat(csvdata[i][j]);
    }                             
  } 
  return csvdata;
}


OP.getID_Name = function(file){            
    var rData = OP.loadCSV(file).replace (/\r\n/g, "\n");   // replace UNIX new lines      
    rData = rData.replace (/\r/g, "\n");                    // replace MAC new lines
    var stk = {},
        rows = rData.split("\n");                           // split into rows       
   
    for (var i = 0; i < rows.length; i++) {
        if (rows[i]) {   // this line helps to skip empty rows
            var columns = rows[i].split("\t");
            stk[columns[0]+'']=columns[1];
        }                           
    } 
    return stk;
}

OP.getCategory = function(file){    // a=OP.getCategory('./category.txt')        
    var rData = OP.loadCSV(file).replace (/\r\n/g, "\n");   // replace UNIX new lines      
    rData = rData.replace (/\r/g, "\n");    // replace MAC new lines
    _category = {};
    _category.category = [];
    var rows = rData.split("\n");           // split into rows        
   
    function checkExist(arr,item){
        if( !(arr.indexOf(item)+1)){
//             console.log(item);
            arr.push(item);
        }        
    }
    var len = rows.length;

    for (var i = 0 ; i < len ; i++) {
        if (rows[i]) {   // this line helps to skip empty rows
            var columns = rows[i].split("\t");
            var id = columns[0].trim(), cat = columns[2].trim(), arr=[];

            _category[cat] =    _category[cat] || {} ;
            _category[cat].stockIDs =  _category[cat].stockIDs || []  ;
            arr =  _category[cat].stockIDs.slice();
//             console.log('join:: '+category[cat].stockIDs.join(','));
            checkExist(_category[cat].stockIDs,id);
            checkExist(_category.category,cat);
            _category[cat].stockIDs = arr;            
        }                           
    }             
    return _category;
}


OP.getTitles = function(data){
  return data[0];
}

OP.getIndexes = function(mainArray,subsetArray){
    var iArray=[];
    for(var i=0;i<subsetArray.length;i++){
      iArray.push(mainArray.indexOf(subsetArray[i]));
    }
    return iArray;
}

OP.sliceData = function(OP_data, colArray, sub_data){
    var label = OP_data._label.slice(),
        num   = OP_data._num.slice(),
        len   = colArray.length;
    // clear result holder
    sub_data._label=[];
    sub_data._num=[];

    for(var i=0;i<len;i++){
        sub_data._label.push(OP_data._label[ colArray[i] ] );
    }    
    for(var i=0;i<num.length;i++){
        var row_ele=[];
        for(var j=0;j<len;j++){
            row_ele.push(num[i][colArray[j] ]);
        }
        sub_data._num.push(row_ele);
    }
}


OP.get1colNum = function(matrix,col){
       var column = [];
       for(var i=0; i<matrix.length; i++){
          column.push(matrix[i][col]);
       }
       return column;
}

OP.get1colNum_bk = function(matrix,col){
       var column = [];
       for(var i=0; i<matrix.length; i++){
          column.push(matrix[i][col]);
       }
       return column;
}

OP.getYYYYMM = function(matrix){
       var column = [];
       for(var i=0; i<matrix.length; i++){
          column.push(matrix[i][0].replace('/','-').split('/')[0]);
       }
       return column;
}

 
 
OP.get1stDate = function(OP1_data_num,OP2_data_num){
    var date1 = OP.getYYYYMM(OP1_data_num),
        date2 = OP.getYYYYMM(OP2_data_num);
    return OP.getIndexes(date1,date2);
}
//------------------------------------------------------------------ Merge Data
OP.mergeData = function(OP1,OP2,OPout){
    OPout._label=[];
    OPout._num=[];

    var label1        = OP1._label.slice(),
        label2        = OP2._label.slice(),
//         OPout._label  = OPout._label.concat(label1),
//         OPout._label  =.concat(label2.slice(1)),
        indexDate     = OP.get1stDate(OP1._num, OP2._num),
        len1 = label1.length,
        len2 = label2.length,
        out1= OP1._num.slice(),
        out2= OP2._num.slice(),
        out=[],label=[], 
        temp = [];

    for(var i =0; i< len2-1;i++){ temp.push(OP.tFILL); } 
    // null for zero, NaN for zero

    var count=0;
    for(var i=0;i<out1.length;i++){
        if(i==indexDate[count]) {  // found
//             console.log(i+ " found: " + indexDate.indexOf(i))
            out[i]=out1[i].slice().concat(out2[count].slice(1));
            count++;   
        }
        else {   //------------------------!!!!! auto fill or Null or NaN ?????
//             out[i]=out1[i].slice().concat(temp);
            out[i]=out1[i].slice().concat(out[i-1].slice(len1 ));     // auto fill
        }
    }                        
    label = label1.slice().concat(label2.slice(1));   // slice(1) to remove Date() column
    OPout._num = out.slice();
    OPout._label = label;
}

//----------------------------------------------------------------- Get OP Data  
OP.getArray3 = function(fileName, OP_data, sep){       // return OP._data   
    var fileStr = OP.loadCSV(fileName);
    //replace UNIX new lines
    var data = fileStr.replace (/\r\n/g, "\n");
    //replace MAC new lines
    data = data.replace (/\r/g, "\n");
    
    //split into rows
    var rows = data.split(",\n"),   //!!!!!!!!!!!!!12014.7
        sperator = sep || ","; 
    
    var title_cells=rows[0].split(","),
        COL_NUM =title_cells.length,
        csvdata=[];                     
    
    for (var i = 0; i < rows.length; i++) {                        
        if (rows[i]) {   // this line helps to skip empty rows
            var columns = rows[i].split(",");
            csvdata.push(rows[i].split(","));
//             console.log("c_"+i+": "+ rows[i]+"  len: "+rows[i].split("\t").length);
        }
    }            
      OP_data['_label'] = csvdata[0];
      OP_data['_num'] = csvdata.splice(1,csvdata.length-1);   
      OP_data['_tSpan'] = fileName[0];        //eg. fileName='d2379.csv'
} 

 

OP.ppNumber = function(num){
  for(var i=0;i<num.length;i++){
    num[i][0]=new Date(num[i][0]) ;             
  }  
// dygraph raw data input:  [[Date(), num11, num12,... ], 
//                           [Date(), num21, num22,... ]]    
 return num;
}

 
 
//----------------------------------------------------------------- debug mode
OP.dump=function(array2d){
    for(var i=0;i<array2d.length;i++){
        console.log('i'+i+': '+array2d[i]);
    }                           
}

 



 

OP.doCalculations = function(mergeOP,_op,_oLabel,_aLabel,_bLabel){
var _LABELS = mergeOP._label,
    _NUM    = mergeOP._num,
    colOut  = _LABELS.indexOf(_oLabel),
    colA    = _LABELS.indexOf(_aLabel),
    colB    = 0,
//     _op     = _operator,
    _cols   = _NUM.length;
    valB    = 0,
    valA    = 0,
    valOut  = 0,
    a       = 30;
 var   constB = 0;


if (_op=='+' || _op=='-' || _op=='x' || _op=='/'){   // type A + B operators
  colB = _LABELS.indexOf(_bLabel);
  console.log('label b exists!');
}

if ( _op=='std' || _op=='mav' || _op=='tShift' || _op=='vScale' || _op=='quant' ||
     _op=='Max' || _op=='min' || _op=='moduls' || _op=='vShift' || _op=='pow' ){
  constB = parseFloat(_bLabel);      
  console.log('A+ const')  
}                   

var outLabelExist = !!(colOut+1);
console.log('Does output label exist? '+ outLabelExist);

if (!outLabelExist){
  _LABELS.push(_oLabel);
  colOut = _LABELS.indexOf(_oLabel);
}

var parseTemp=0,
    valOut = 0, avg = 0, sqrt_sum =0;
 



  for (var i=0;i<_cols;i++){
    valA = parseFloat(_NUM[i][colA]);     

    var subA = [], subA_len = 0;
    if(i-constB+1>0){
      for(var b=i-constB+1; b<=i; b++){
        subA.push(_NUM[b][colA]);
      }  
      subA_len = constB;
    }
    else{
      for(var b=0; b<=i; b++){
        subA.push(_NUM[b][colA]);
      } 
      subA_len = i;
    }

          switch (_op) {
            // ============= A + B ========== operator
            case "+":
              valOut = valA + parseFloat(_NUM[i][colB]);
//               console.log(valA + ':'+parseFloat(_NUM[i][colB]) +'; colB: ' + colB )
              break;
            case "-":
              valOut = valA - parseFloat(_NUM[i][colB]);
              break;
            case "x":
              valOut = valA * parseFloat(_NUM[i][colB]);
              break;
            case "/":
              valOut = valA / parseFloat(_NUM[i][colB]);
              break;
            // ============= A only ========== operator
            case "sqrt":
              valOut = Math.sqrt( valA ) ;
              break;
            case "abs":
              valOut = Math.abs( valA );
              break;
            case "log":
              valOut = Math.log( valA ) / Math.ln10 ;
              break;
            case "ln":
              valOut = Math.log( valA ) ;
              break;
            case "ceil":
              valOut = Math.abs( valA );
              break;
            case "floor":
              valOut = Math.abs( valA );
              break;
            case "round":
              valOut = Math.abs( valA );
              break;
            case "tFill":         
              valOut = isNaN( valA )? parseFloat(_NUM[i-1][colOut]) : valA;
              // _NUM[0][colOut] must NOT be NaN
              break;
            // ============= A + ConstantB ========== operator
            case "std":     // to-do
 
              for(var j=0;j<subA_len;j++){ avg += subA(j); }
              avg = avg / subA_len;

              for(var j=0;j<subA_len;j++){ sqrt_sum += Math.pow((valA - avg),2) ;  }
              valOut = Math.sqrt( sqrt / subA_len ) ;  
              break;

 
            case "mav":     // to-do          
              for(var j=0;j<subA_len;j++){ valOut += subA(j); }
              valOut = valOut / subA_len;
              break;
            case "tShift":     // to-do                     
              if(constB>=0){    // [0,1,2,3,4,5] => [ 0,0,0,1,2,3]
                if(i<constB){                    
                  valOut = _NUM[0][colA];
//                   console.log(valOut + ' : ' + i + ' ~ ' + colA);
                }
                else{

                  valOut = _NUM[i-constB][colA];
//                   console.log(valOut + ' : ' + i + ' ~~ ' + colA);
                } 
              }
              else{            // [0,1,2,3,4,5] => [ 2,3,4,5,NaN,NaN]
                absB = Math.abs(constB);

                if(i>=_cols-absB-0){
//                   console.log(absB) ;
                  valOut = OP.tFILL;
                }
                else{
//                   console.log(absB+i);
                  valOut = _NUM[absB+i][colA];
                } 
              }
              break;
            case "vScale":
              valOut = valA * constB;    
              break;
            case "vShift":
              valOut = valA + constB;    
              break;
            case "Max":     // to-do       
                valOut = Math.max.apply(null, subA);         
              break;
            case "min":     // to-do
                valOut = Math.min.apply(null, subA);  
              break;
            default:
              console.log('operator not found');
              break;
          } // end switch
  if(outLabelExist){ _NUM[i][colOut] = valOut; }
  else             { _NUM[i].push( valOut ) ; }

  } // end for loop
 

}

 