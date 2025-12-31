//read in and process BRFSS estimated parameters
$.ajax({
  url: 'data/param_file.csv',
  async: false,
  success: function (response) {
    var temp_params=response.split('""');//split long file into separate arrays for each row of csv file
for (i=0;i<temp_params.length;i++){
	temp_params.splice(i+1,1);
};

var name=[]; 


for (i=1;i<temp_params.length;i++){	//for each array in temp_params...
   var ptemp=[];
   var temp=(temp_params[i].split(',')) //split rows into an array for each disease (first row of file will become array of variable names)
   name.push(temp[1])   //use the next element(name) for the names of the parameter arrays
   temp.splice(0,2) //delete the first element(a blank) disease name from the array
   for (j=0;j<temp.length;j++){
   ptemp.push(parseFloat(temp[j])) //convert values to numeric
   }
   window[name[i-1]]=ptemp //create the arrays for the disease

	}    
  }
});

var dbetas=[diabetes, cvd, hattack, stroke, asthma, copd, skincancer, othercancer];
dbetas.push(); //put the disease arrays into debetas array



//read and process MEPS parameters
var temp_params=[];//reset temp params

$.ajax({
  url: 'data/cost_file.csv',
  async: false,
  success: function (response) {
    var temp_params=response.split('""');//split long file into separate arrays for each row of csv file
for (i=0;i<temp_params.length;i++){
	temp_params.splice(i+1,1);
};

var cost_vars=[]; 

for (i=1;i<temp_params.length;i++){	//for each array in temp_params...
   var ptemp=[];
   var temp=(temp_params[i].split(',')) //split rows into an array for use and cost betas (first row of file will become array of variable names)
   cost_vars.push(temp[1])   //use the next element(cost_vars) for the names of the parameter arrays
   temp.splice(0,2) //delete the first element(a blank) disease name from the array
   for (j=0;j<temp.length;j++){
   ptemp.push(parseFloat(temp[j])) //convert values to numeric
   }
   window[cost_vars[i-1]]=ptemp //create the arrays for the disease

	}    
  }
});


///////////////////////////////////////////////////////////////////////////////DOT PLOT////////////////////////////////////
var init=['.02','.02','.02','.02','.02','.02'];
var labels=['18-24', '25-34', '35-44','45-54','55-64','65+'];


var margin={top:10, right:30, bottom:50, left:50}
var width =350-margin.left-margin.right;
var height=320-margin.top-margin.bottom;
var radius=4.5;

var xScale = d3.scale.ordinal()
	.domain(d3.range(0,init.length))
	.rangePoints([0,width],.7)
var xLabels = d3.scale.ordinal()
	.domain(labels)
	.rangePoints([0,width],.7)
var yScale=d3.scale.linear()
    .domain([0,1.0])  	
    .range([height,0]);


var riskgraph=d3.select('#dis_prob').append('svg')
  .attr('width',width+margin.left+margin.right)
  .attr('height', height+margin.top+margin.bottom)
  .style('background','rgba(245,245,250,.98)')
  
 
 
  riskgraph.append('g') //dots at 0
  .attr("transform","translate("+margin.left+","+margin.top+")")
  .selectAll('circle').data(init)
  .enter().append('circle')
  .attr('class','circ')
  .style('fill','#cc0000')
  .attr('r',radius)
  .attr('cx',function(d,i){return xScale(i)})
  .attr('cy',function(d){return yScale(d)})
  
  

 riskgraph.append('g') //ref lines at 0
  .attr("transform","translate("+(margin.left)+","+margin.top+")")
  .selectAll('circle').data(init)
  .enter().append('circle')
  .attr('class','reflines')
  .style('fill','#FFA500')
  .attr('r',radius)
  .attr('cx',function(d,i){return xScale(i)})
  .attr('cy',function(d){return yScale(d)})
 
///REF CIRCLES
refdata=[];
refdata.push(init[0]); 
 riskgraph.append('g') //dots at 0
  .attr("transform","translate("+margin.left+","+margin.top+")")
  .selectAll('circle').data(refdata)
  .enter().append('circle')
  .attr('id','refcircUser')
  .attr('class','circ')
  .style('fill','none')
  .attr('stroke','blue')

  .attr('r',radius+.5)
  .attr('cx',function(d,i){return xScale(i)})
  .attr('cy',function(d){return yScale(d)})


 riskgraph.append('g') //dots at 0
  .attr("transform","translate("+margin.left+","+margin.top+")")
  .selectAll('circle').data(refdata)
  .enter().append('circle')
  .attr('id','refcircRef')
  .attr('class','circ')
  .style('fill','none')
  .attr('stroke','blue')
  
  .attr('r',radius+.5)
  .attr('cx',function(d,i){return xScale(i)})
  .attr('cy',function(d){return yScale(d)})  
  
var hAxis=d3.svg.axis()
	.scale(xLabels)
	.orient('bottom')
	.ticks(init.length)
var hGuide=d3.select('svg').append('g')
	hAxis(hGuide)
	hGuide.attr("transform","translate("+(margin.left)+","+(height+margin.top)+")")
	hGuide.selectAll('path')
		.style({fill: 'none', stroke:"#000"})
	hGuide.selectAll('line')
		.style({stroke:"#000"})
var vAxis=d3.svg.axis()
	.scale(yScale)
	.orient('left')
	.ticks(10)
var vGuide=d3.select('svg').append('g')
	vAxis(vGuide)
	vGuide.attr("transform","translate("+margin.left+","+margin.top+")")
	vGuide.selectAll('path').style({fill:'none',stroke:"#000"})
	vGuide.selectAll('line').style({stroke:"#000"})

//Y and X axis labels	
var riskYAxisLabel1= riskgraph.append('text')
  .text('Predicted')
  .attr('x',55)
  .attr('y',15)  
var riskYAxisLabel1= riskgraph.append('text')
  .text('Probability')
  .attr('x',55)
  .attr('y',25)    
var riskXAxisLabel= riskgraph.append('text')
  .text('Age Groups (in years)')
  .attr('x',130)
  .attr('y',305)    
	
//Legend
/*var risklegend=d3.select('#dis_graphic').append('svg')
  .attr('width',25).attr('height', 125)
  .style('background','rgba(245,245,250,.98)')

risklegend.append('circle')
.style('fill','#cc0000')
  .attr('r',radius)
  .attr('cx',10)
  .attr('cy',25)
risklegend.append('circle')
.style('fill','#FFA500')
  .attr('r',radius)
  .attr('cx',10)
  .attr('cy',85)
*/

/////////////////////////////////////////////////////////////////////// COST BAR ///////////////////////////
var costinit=['10','10','10','10','10','10'];
var costlabels=['18-24', '25-34', '35-44','45-54','55-64','65+'];

var cmargin={top:10, right:30, bottom:50, left:50}
var cwidth =350-cmargin.left-cmargin.right;
var cheight=325-cmargin.top-cmargin.bottom;

var xScaleCost = d3.scale.ordinal() //scale transformations
	.domain(d3.range(0,costinit.length))
	.rangeBands([0,cwidth],.3)
var xLabelsCost = d3.scale.ordinal()
	.domain(costlabels)
	.rangeBands([0,cwidth],.3)
var yScaleCost=d3.scale.linear()
    .domain([0,10000])  	
    .range([0,cheight]);
var yScaleCostAxis=d3.scale.linear()
    .domain([0,10000])  	
    .range([cheight,0]);

var bargraph=d3.select('#cost').append('svg') //append the chart area
  .attr('width',cwidth+cmargin.left+cmargin.right)
  .attr('height', cheight+cmargin.top+cmargin.bottom)
  .style('background','rgba(245,245,250,.98)')
 		
 bargraph.append('g') //bars
  .attr("transform","translate("+cmargin.left+","+cmargin.top+")")
  .selectAll('rect').data(costinit)
  .enter().append('rect')
  .attr('class','urrects')
  .style('fill','#cc0000')
  .style('margin-right','1px')
  .attr('height',function(d){return yScaleCost(d)})
  .attr('width','25')
  .attr('x',function(d,i){return xScaleCost(i);})
  .attr('y', function(d){return cheight-yScaleCost(d);});

 bargraph.append('g') //bars
  .attr("transform","translate("+cmargin.left+","+cmargin.top+")")
  .selectAll('rect').data(costinit)
  .enter().append('rect')
  .attr('class','refrects')
  .style('fill','#FFA500')
  .style('margin-right','1px')
  .attr('height',function(d){return yScaleCost(d)})
  .attr('width','25')
  .attr('x',function(d,i){return xScaleCost(i);})
  .attr('y', function(d){return cheight-yScaleCost(d);});
  
  //REF BAR
  costrefbar=[];
  costrefbar.push(costinit[0])
  bargraph.append('g') //bars
  .attr("transform","translate("+cmargin.left+","+cmargin.top+")")
  .selectAll('rect').data(costrefbar)
  .enter().append('rect')
  .attr('id','costref')
  .attr('class','urrects')
  .style('fill','none')
  .attr('stroke','blue')
  .style('margin-right','1px')
  .attr('height',function(d){return yScaleCost(d)})
  .attr('width','25')
  .attr('x',function(d,i){return xScaleCost(i);})
  .attr('y', function(d){return cheight-yScaleCost(d);});
  
  

var vAxis=d3.svg.axis() //append the y axis
	.scale(yScaleCostAxis)
	.orient('left')
	.ticks(10)
var vGuide=bargraph.append('g')
	vAxis(vGuide)
	vGuide.attr("transform","translate("+margin.left+","+margin.top+")")
	vGuide.selectAll('path').style({fill:'none',stroke:"#000"})
	vGuide.selectAll('line').style({stroke:"#000"})
  
var hAxis=d3.svg.axis() //append the x axis
	.scale(xLabelsCost)
	.orient('bottom')
	.ticks(costinit.length)
var hGuide=bargraph.append('g')
	hAxis(hGuide)
	hGuide.attr("transform","translate("+(cmargin.left)+","+(cheight+cmargin.top)+")")
	hGuide.selectAll('path')
		.style({fill: 'none', stroke:"#000"})
	hGuide.selectAll('line')
		.style({stroke:"#000"})

var costYAxisLabel1= bargraph.append('text')
  .text('Cost (in $)')
  .attr('x',55)
  .attr('y',15)

var costXAxisLabel= bargraph.append('text')
  .text('Age Groups (in years)')
  .attr('x',130)
  .attr('y',305)   


//Legend
/*var barlegend=d3.select('#cost_graphic').append('svg')
  .attr('width',25).attr('height', 125)
  .style('background','rgba(245,245,250,.98)')

barlegend.append('rect')
.style('fill','#cc0000')
  .attr('x',8)
  .attr('y',25)
  .attr('width',10)
  .attr('height',20)
  
barlegend.append('rect')
.style('fill','#FFA500')
.attr('x',8)
  .attr('y',85)
  .attr('width',10)
  .attr('height',20)
*/

//////////////////////////////////////////////////////////////////////////////////////CALL UPDATEVIZ FUNCTION		

function updateDisease(){
	//event.preventDefault();//prevents page from reloading everytime submit is hit -> this screws up Firefox
//data for dotplot		

var sex=document.forms["userinput"].sex.value;
var age=document.forms["userinput"].age.value;
var race=document.forms["userinput"].race.value;
var ht_ft=parseFloat(document.forms["userinput"].ft.value);
var ht_in=parseFloat(document.forms["userinput"].inch.value);
var weight=parseFloat(document.forms["userinput"].weight.value);
var smoker=document.forms["userinput"].smoke.value;
var chol=document.forms["userinput"].chol.value;
var bp=document.forms["userinput"].bp.value;
//var alco=parseFloat(document.forms["userinput"].alco.value);
var exer=document.forms["userinput"].exer.value;
var income=document.forms["userinput"].income.value;
var disease=document.forms["userinput"].disease.value;



//Age
if (age=="18-24"){age_index=0
	}else if (age=="25-34") {age_index=1
		}else if (age=="35-44") {age_index=2
			}else if (age=="45-54") {age_index=3
				}else if (age=="55-64") {age_index=4
					}else if (age=="65+") {age_index=5};




//height and weight validation alerts
if (ht_ft>7 || ht_ft<4){alert ('Please enter a height feet value between 4 and 7')};
if (ht_in>12 || ht_ft<0){alert ('Please enter a height inches value between 0 and 12')};
if (weight>600 || weight<70){alert ('Please enter a weight value between 70 and 600')};

//Create BMI variable
var BMIcat='';
var height_tot_inches=(ht_ft*12)+ht_in;
var BMI=(weight/(height_tot_inches*height_tot_inches))*703;

 if (BMI<18.5){BMIcat=="underweight"
	}else if (BMI>=18.5 && BMI<25){BMIcat="normal"
		}else if (BMI>=25 && BMI<30){BMIcat="overweight"
			}else if (BMI>=30){BMIcat="obese"}
document.getElementById('BMIcat').innerText=BMIcat;
//END BMI variable creation

//Output text summarizing risk factors
 if (smoker=="nsmoker"){smoking_text="are non-smokers"
	} else if (smoker=="fsmoker"){smoking_text="are former smokers"
		}else if (smoker=="ssmoker"){smoking_text="who sometimes smoke"
			} else if (smoker=="smoker"){smoking_text="are daily smokers"}

//cholesterol			
if (chol=="yes"){chol_text="high cholesterol"
	}else {chol_text="normal cholesterol"}

//blood pressure
if (bp=="yes"){bp_text="high blood pressure"
	}else {bp_text="normal blood pressure"}

//exercise
if (exer=="yes"){exer_text=""
	}else {exer_text="not"}
	
//race	
if (race=="black"){race_text="Black"
} else if (race=="asian"){race_text="Asian"
	}else if (race=="HPI"){race_text="Hawaiian/Pacific Islander"
		}else if (race=="Alaskan"){race_text="Native American or Alaskan"
			}else if (race=="multiracial"){race_text="multiracial or other"
				}else if (race=="hispanic"){race_text="Hispanic"
					}else {race_text="White"
					};

//diseases
if (disease=="diabetes"){diseaseText="Diabetes"
	}else if (disease=="chd"){diseaseText="Coronary Heart Disease"
		}else if (disease=="hattack") {diseaseText="Heart Attack"
			}else if (disease=="stroke") {diseaseText="Stroke"
				}else if (disease=="copd") {diseaseText="COPD"
					}else if (disease=="asthma"){diseaseText="Asthma"
						}else if (disease=="scancer"){diseaseText="Skin Cancer"
							}else if (disease=="ocancer"){diseaseText="Other Cancer"}
							
/*
//jquery html text				
outputtext="Disease and cost probability predictions are shown below for "+ age+" year old "+race_text+" "+sex+"s, in the $"+income+" income bracket, are in the "+BMIcat+" BMI category, "+smoking_text+", have "+bp_text+" and "+chol_text+", and have "+exer_text+" excercised in the last month.";
$("#outputtext").html(outputtext).fadeIn();
 // age race smoker chol bp exer BMIcat; 
*/
$("#disease_name").html(diseaseText).fadeIn();


function age_group (in_array,ref_array,incost_array,costref_array){ //constructor function for age-group objects
	this.input=in_array;
	this.ref=ref_array;
	this.cost=incost_array;
	this.costref=costref_array;
}
//create age-group objects
var a18_24=new age_group([1,0,0,0,0,0],[1,0,0,0,0,0],[1,0,0,0,0,0],[1,0,0,0,0,0])
var a25_34=new age_group([1,1,0,0,0,0],[1,1,0,0,0,0],[1,1,0,0,0,0],[1,1,0,0,0,0])
var a35_44=new age_group([1,0,1,0,0,0],[1,0,1,0,0,0],[1,0,1,0,0,0],[1,0,1,0,0,0])
var a45_54=new age_group([1,0,0,1,0,0],[1,0,0,1,0,0],[1,0,0,1,0,0],[1,0,0,1,0,0])
var a55_64=new age_group([1,0,0,0,1,0],[1,0,0,0,1,0],[1,0,0,0,1,0],[1,0,0,0,1,0])
var a65=new age_group([1,0,0,0,0,1],[1,0,0,0,0,1],[1,0,0,0,0,1],[1,0,0,0,0,1])

var inputobjs=[];
inputobjs.push(a18_24,a25_34,a35_44,a45_54,a55_64,a65)



//create input and reference arrays
for (i=0;i<inputobjs.length;i++){
	
//SEX	
if (sex=="male"){
	inputobjs[i].input.push(0);
	inputobjs[i].ref.push(0);
	inputobjs[i].cost.push(0);
	inputobjs[i].costref.push(0);
	
	}else {
		inputobjs[i].input.push(1);
		inputobjs[i].ref.push(1);
		inputobjs[i].cost.push(1);
		inputobjs[i].costref.push(1);
		};


//RACE
if (race=="black"){
	inputobjs[i].input.push(1,0,0,0,0,0);
	inputobjs[i].ref.push(1,0,0,0,0,0);
	inputobjs[i].cost.push(1,0,0); //cost dummy
	inputobjs[i].costref.push(1,0,0);
} else if (race=="asian"){
	inputobjs[i].input.push(0,1,0,0,0,0);
	inputobjs[i].ref.push(0,1,0,0,0,0);
	inputobjs[i].cost.push(0,0,1); //cost dummy
	inputobjs[i].costref.push(0,0,1);
	}else if (race=="HPI"){
		inputobjs[i].input.push(0,0,1,0,0,0);
		inputobjs[i].ref.push(0,0,1,0,0,0);
		inputobjs[i].cost.push(0,0,1); //cost dummy
		inputobjs[i].costref.push(0,0,1);
		}else if (race=="Alaskan"){
			inputobjs[i].input.push(0,0,0,1,0,0);
			inputobjs[i].ref.push(0,0,0,1,0,0);
			inputobjs[i].cost.push(0,0,1); //cost dummy
			inputobjs[i].costref.push(0,0,1);
			}else if (race=="multiracial"){
				inputobjs[i].input.push(0,0,0,0,1,0);
				inputobjs[i].ref.push(0,0,0,0,1,0);
				inputobjs[i].cost.push(0,0,1);//cost dummy
				inputobjs[i].costref.push(0,0,1);
				}else if (race=="hispanic"){
					inputobjs[i].input.push(0,0,0,0,0,1);
					inputobjs[i].ref.push(0,0,0,0,0,1);
					inputobjs[i].cost.push(0,1,0);//cost dummy
					inputobjs[i].costref.push(0,1,0);
					}else {//if white
						inputobjs[i].input.push(0,0,0,0,0,0);
						inputobjs[i].ref.push(0,0,0,0,0,0);
						inputobjs[i].cost.push(0,0,0);//cost dummy
						inputobjs[i].costref.push(0,0,0);
					};
					
if (income=="75K+"){
	inputobjs[i].input.push(1,0,0);
	inputobjs[i].ref.push(1,0,0);
	inputobjs[i].cost.push(1,0,0);//cost dummy
	inputobjs[i].costref.push(1,0,0);
	}else if (income=="50-75K"){
		inputobjs[i].input.push(0,1,0);
		inputobjs[i].ref.push(0,1,0);
		inputobjs[i].cost.push(0,1,0);//cost dummy
		inputobjs[i].costref.push(0,1,0);
		}else if (income=="25-50K"){
			inputobjs[i].input.push(0,0,1);
			inputobjs[i].ref.push(0,0,1);
			inputobjs[i].cost.push(0,0,1);//cost dummy
			inputobjs[i].costref.push(0,0,1);
			}else {
			inputobjs[i].input.push(0,0,0);
			inputobjs[i].ref.push(0,0,0);
			inputobjs[i].cost.push(0,0,0);//cost dummy
			inputobjs[i].costref.push(0,0,0);
}



inputobjs[i].ref.push(0,0,0,0,0,0,0,0,1);//fill out the rest of the reference arrays with 0s. 
//console.log(inputobjs[i].cost,inputobjs[i].costref)
//SMOKING
if (smoker=="smoker"){inputobjs[i].input.push(1,0,0)
	}else if (smoker=="ssmoker"){inputobjs[i].input.push(0,1,0)
		}else if (smoker=="fsmoker"){inputobjs[i].input.push(0,0,1)
			}else {inputobjs[i].input.push(0,0,0)};				

//BMI
if (BMIcat=="obese"){inputobjs[i].input.push(1,0,0)
	}else if (BMIcat=="overweight"){inputobjs[i].input.push(0,1,0)
		}else if (BMIcat=="underweight"){inputobjs[i].input.push(0,0,1)
			}else {inputobjs[i].input.push(0,0,0)}

//HIGH BLOOD PRESSURE
if (bp=="yes"){inputobjs[i].input.push(1)
//	} else if (bp=="preg"){inputobjs[i].input.push(0,0,1)
//		} else if (bp=="borderline"){inputobjs[i].input.push(1,0,0)
			} else {inputobjs[i].input.push(0)}

//HIGH CHOLESTEROL
if (chol=="yes"){inputobjs[i].input.push(1)
	}else {inputobjs[i].input.push(0)}


//ALCOHOL
//inputobjs[i].input.push(alco)

//EXERCISE
if (exer=="yes"){inputobjs[i].input.push(0)
	}else {inputobjs[i].input.push(1)}


}


//declare arrays for disease and reference probabilities
dprobs=[];
refprobs=[];
//calculate disease and reference probabilities
for (h=0;h<dbetas.length;h++){//for each disease (h)
dprobs_age=[];
refprobs_age=[];
	for (i=0;i<inputobjs.length;i++){ //for each age object (i)
		
		est=[];
		refest=[];
		for(j=0;j<dbetas[h].length;j++){//...for each element in the input and ref arrays in each age object (j) 
			
			est[j]=inputobjs[i].input[j]*dbetas[h][j]; //multiply each element in input by parameter and put into est array
			refest[j]=inputobjs[i].ref[j]*dbetas[h][j]; //multiply each element in refvec by parameter and put into refest array
			}
	est_sum=Math.exp(est.reduce( function(total, num){ return total + num }, 0)); //take sum of elements of est and ref arrays and expoentiate
	ref_sum=Math.exp(refest.reduce( function(total, num){ return total + num }, 0));
	dprob=est_sum/(1+est_sum); //calculate predicted probability
	rprob=ref_sum/(1+ref_sum);

	dprobs_age.push(dprob);//add predicted prob to array	
	refprobs_age.push(rprob);
	
}
dprobs.push(dprobs_age)
refprobs.push(refprobs_age)



}
//COST
//[Constant, female, black, hispanic, other,income75,income50,income25, 25-34, 35-44, 45-54, 55-64, >=65, canc0th,scanc, cvd,hattack,stroke,asthma,diabetes,copd]
//use_betas= [0.5234296, 0.9404223, -0.6340633, -0.9513254, -0.7371657, 0.5989095, 0.3531322, 0.1345292, 0.0698582, 0.3124895, 0.5588682, 1.006837, 1.500938, 0.9360697, 0.9935723, 0.7210982, 0.4882903, 1.257125, 0.8912495, 1.923493, 1.027033]
//cost_betas=[2489.28, 748.7467, -690.084, -991.619, -358.7623, -136.2432, -319.9693, -3.713928, 731.9015, 449.0629, 1366.977, 1995.802, 2585.374, 7258.352, 3220.967, 3373.299, 2964.747, 3762.306, 797.8805, 3959.069, 2315.363];

//push disease probabilities into cost betas array
for (h=0;h<dprobs.length;h++){
for (i=0;i<inputobjs.length;i++){
	inputobjs[i].cost.push(dprobs[h][i])
	inputobjs[i].costref.push(refprobs[h][i])

}

}

uruse=[];
refUse=[];
urcost=[];
refcost=[];	
use=[];
use_ref=[];
for (i=0;i<inputobjs.length;i++){ //for the six age groups
est=[];
refest=[];
for (j=0;j<cost_betas.length;j++){ //for each element in the cost and cost ref arrays
		
		use[j]=inputobjs[i].cost[j]*use_betas[j];
		use_ref[j]=inputobjs[i].cost[j]*use_betas[j];
		est[j]=inputobjs[i].cost[j]*cost_betas[j]; //multiply each element in cost by parameter and put into est array
		refest[j]=inputobjs[i].costref[j]*cost_betas[j];//multiply each element in costref by parameter and put into est array

}
	use_sum=Math.exp(use.reduce( function(total, num){ return total + num }, 0)); //take sum of elements of use and use_ref arrays 
	use_ref_sum=Math.exp(use_ref.reduce( function(total, num){ return total + num }, 0));
	use_prob=use_sum/(1+use_sum)
	refUse_prob=use_ref_sum/(1+use_ref_sum)
	uruse.push(use_prob)
	refUse.push(refUse_prob)
	
	est_sum=est.reduce( function(total, num){ return total + num }, 0); //take sum of elements of est and ref arrays 
	ref_sum=refest.reduce( function(total, num){ return total + num }, 0);
	urcost.push(est_sum) //push into arrays urcost and refcost
	refcost.push(ref_sum)
}

adjCost=[];
refAdjCost=[];
for (i=0;i<urcost.length;i++){
	adjCost[i]=uruse[i]*urcost[i];
	refAdjCost[i]=refUse[i]*refcost[i];
}



//////////////////////////////////////////////////////////////////////////////////UPDATE FIGURE
	if (document.forms[0].disease.value =="ocancer"){
	usergroup=dprobs[7];
	refgroup=refprobs[7];
	} else if (document.forms[0].disease.value =="scancer"){
		usergroup=dprobs[6];
		refgroup=refprobs[6];
	} else if (document.forms[0].disease.value =="chd"){
		usergroup=dprobs[1];
		refgroup=refprobs[1];
	} else if (document.forms[0].disease.value =="hattack"){
		usergroup=dprobs[2];
		refgroup=refprobs[2];
	} else if (document.forms[0].disease.value =="stroke"){
		usergroup=dprobs[3];
		refgroup=refprobs[3];
	} else if (document.forms[0].disease.value =="asthma"){
		usergroup=dprobs[4];
		refgroup=refprobs[4];
	} else if (document.forms[0].disease.value =="diabetes"){
		usergroup=dprobs[0];
		refgroup=refprobs[0];
	} else if (document.forms[0].disease.value =="copd"){
		usergroup=dprobs[5];
		refgroup=refprobs[5];
	} 
		
	
	d3.selectAll('.circ').data(usergroup)
		.transition().duration(1000).delay(50)
		.attr('cy', function(d){return yScale(d)});
  	d3.selectAll('.reflines').data(refgroup)
  		.transition().duration(1000).delay(50)
  		.attr('cy',function(d){return yScale(d)});
 
 
refdataUser=[];
refdataUser.push(usergroup[age_index]); 

  d3.select('#refcircUser').data(refdataUser)
  	.transition().duration(1000).delay(50)
  	.attr('cx',function(d,i){return xScale(age_index)})
  	.attr('cy',function(d){return yScale(d)})
 
refdataRef=[];
refdataRef.push(refgroup[age_index]); 
  d3.select('#refcircRef').data(refdataRef)
  	.transition().duration(1000).delay(50)
  	.attr('cx',function(d,i){return xScale(age_index)})
  	.attr('cy',function(d){return yScale(d)})

 

	d3.selectAll('.refrects').data(refAdjCost)
		.transition().duration(1000).delay(50)
		.attr('height',function (d){return yScaleCost(d)})
		.attr('y', function(d){return cheight-yScaleCost(d);});
	d3.selectAll('.urrects').data(adjCost)
		.transition().duration(1000).delay(50)
		.attr('height',function (d){return yScaleCost(d)})
		.attr('y', function(d){return cheight-yScaleCost(d);});

refcost=[];
refcost.push(adjCost[age_index])
d3.select('#costref').data(refcost)
	.transition().duration(1000).delay(50)
  .attr('height',function(d){return yScaleCost(d)})
  .attr('x',function(d,i){return xScaleCost(age_index);})
  .attr('y', function(d){return cheight-yScaleCost(d);});

}






