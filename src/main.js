// global variables

Global_base_hsl=0

// init

function init(){
  // event listeners
  document.getElementById("generate").addEventListener("click", drawBoxPass)
  document.getElementById("variables").addEventListener("click", updateSliders)
  document.getElementById("variables").addEventListener("mousemove", updateSliders)
  document.getElementById("output").addEventListener("click", reportColors)
  //reset buttons
  document.getElementById("rangeReset").addEventListener("click", resetSliders)
  document.getElementById("columnsReset").addEventListener("click", resetSliders)
  // draw elements on load
  centerGenerator()
  drawBoxPass()
  reportColors("init")
  // set slider values
  document.getElementById("rangeVar").innerHTML=" "+document.getElementById("range").value
  document.getElementById("columnsVar").innerHTML=" "+document.getElementById("columns").value
  setInterval(centerGenerator, 100)
}

// parsing

function parseHSL(hsl){
  return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`
}

function parseHEX(rgb){
  if(rgb.slice(0, 1)=="r"){
    rgb=deparse(rgb)
  }
  var l=rgb.length
  while(l>0){
    rgb[--l]=parseInt(rgb[l]).toString(16)
    if(rgb[l].length<2){
      rgb[l]=`0${rgb[l]}`
    }
  }
  return `#${rgb[0]}${rgb[1]}${rgb[2]}`
}

function deparse(color){
  color=color.split(" ")
  color[0]=parseInt(color[0].slice(4, color[0].length-1))
  color[1]=parseInt(color[1].slice(0, color[1].length-1))
  color[2]=parseInt(color[2].slice(0, color[2].length-1))
  return color
}

// number generation

function generateRange(range, count){
  range=range/count
  list=[]
  while(count>0){
    list.push(range*count--)
  }
  return list
}

// color generating

function dodge(base, range){
  var ret=[]
  var l=range.length
  while(l>0){
    ret.push([base[0], base[1], base[2]-range[--l]])
  }
  return ret
}

function burn(base, range){
  var ret=[]
  var l=range.length
  while(l>0){
    ret.push([base[0], base[1], base[2]+range[--l]])
  }
  return ret
}

function generateColorHSL(count){
  range=parseInt(document.getElementById("range").value)
  if(parseInt(count)==NaN || count==undefined){
    count=3
  }
  base=[
    Math.floor(Math.random()*360),
    100,
    50]
  c=(count-1)/2
  dark=burn(base, generateRange(range, c))
  light=dodge(base, generateRange(range, c))
  var l=c
  var ret=[]
  while(l>0){
    ret.push(light[--l])
  }
  ret.push(base)
  while(l<c){
    ret.push(dark[l++])
  }
  return ret
}

function updateColorsHSL(color){

}

function RGBtoHSL(rgb){
  var hsl=[0, 0, 0]
  var rgb=[rgb[0]/255, rgb[1]/255, rgb[2]/255]
  var max = arrayMax(rgb)
  var min = arrayMin(rgb)
  hsl[2]=(max+min)/2
  if(rgb[0]==rgb[1]&&rgb[1]==rgb[2]){
    return hsl
  }
  if(hsl[2]<=0.5){
    hsl[1]=(max-min)/max+min
  }
  if(hsl[2]>0.5){
    hsl[1]=(max-min)/(2-max-min)
  }
  hsl[1]=Math.round(hsl[1]*100)
  hsl[2]=Math.round(hsl[2]*100)
  var maxIndex=rgb.indexOf(max)
  if(maxIndex==0){
    hsl[0]=Math.floor(((rgb[1]-rgb[2])/(max-min))*60)
    if(hsl[0]<0){
      hsl[0]+=360
    }
    return hsl
  }
  if(maxIndex==1){
    hsl[0]=Math.floor((2+((rgb[2]-rgb[0])/(max-min)))*60)
    if(hsl[0]<0){
      hsl[0]+=360
    }
    return hsl
  }
  if(maxIndex==2){
    hsl[0]=Math.floor((4+((rgb[0]-rgb[1])/(max-min)))*60)
    if(hsl[0]<0){
      hsl[0]+=360
    }
    return hsl
  }
}

// DOM interaction

function centerGenerator(){
  center=document.getElementById("center")
  margin=parseInt(window.getComputedStyle(center).width.slice(0, -2))
  center.style.marginLeft=`${margin/-2}px`

}

function drawBox(colors){
  centerWidth=window.getComputedStyle(document.getElementById("center")).width.slice(0, -2)
  var l=colors.length
  var width=`${100/l}%`
  document.getElementById("output").innerHTML=""
  while(l>0){
    box='<div class="colorBox" id="colorNum'+l+'"></div>'
    document.getElementById("output").innerHTML+=box
    document.getElementById("colorNum"+l).style.width=width
    document.getElementById("colorNum"+l).style.backgroundColor=parseHSL(colors[--l])
  }
  reportColors("init")
}

function drawBoxPass(){
  drawBox(generateColorHSL(document.getElementById("columns").value))
}

function updateSliders(loc){
  loc=loc.toElement.id
  values=["range", "columns"]
  if(values.indexOf(loc)!=-1){
    document.getElementById(`${loc}Var`).innerHTML=" "+document.getElementById(loc).value
  }
}

function resetSliders(loc){
  loc=loc.toElement.value
  document.getElementById(loc).value=document.getElementById(loc).default
  document.getElementById(`${loc}Var`).innerHTML=` ${document.getElementById(loc).value}`
}

function reportColors(loc){
  if(loc=="init"){
    loc=document.getElementById(`colorNum${(document.getElementsByClassName("colorBox").length+1)/2}`)
  }else{
    loc=loc.toElement
  }
  document.getElementById("hex").innerHTML=parseHEX(loc.style.backgroundColor)
  document.getElementById("rgb").innerHTML=loc.style.backgroundColor
  document.getElementById("hsl").innerHTML=parseHSL(RGBtoHSL(deparse(loc.style.backgroundColor)))
}
// data

function arrayMin(array){
  var ret=array[0]
  var l=array.length
  while(l>1){
    if(array[--l]<ret){
      ret=array[l]
    }
  }
  return ret
}

function arrayMax(array){
  var ret=array[0]
  var l=array.length
  while(l>1){
    if(array[--l]>ret){
      ret=array[l]
    }
  }
  return ret
}
