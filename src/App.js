import React, {useState} from "react";
import "./index.css";

const buttonList = [
  {buttonId: "one", buttonText: "1", action: "digit"}, {buttonId: "two", buttonText: "2", action: "digit"}, 
  {buttonId: "three", buttonText: "3", action: "digit"}, {buttonId: "four", buttonText: "4", action: "digit"}, 
  {buttonId: "five", buttonText: "5", action: "digit"}, {buttonId: "six", buttonText: "6", action: "digit"}, 
  {buttonId: "seven", buttonText: "7", action: "digit"}, {buttonId: "eight", buttonText: "8", action: "digit"}, 
  {buttonId: "nine", buttonText: "9", action: "digit"}, {buttonId: "zero", buttonText: "0", action: "zero"}, 
  {buttonId: "add", buttonText: "+", action: "op"}, {buttonId: "subtract", buttonText: "-", action: "sub"}, 
  {buttonId: "multiply", buttonText: "*", action: "op"}, {buttonId: "divide", buttonText: "/", action: "op"}, 
  {buttonId: "decimal", buttonText: ".", action: "decimal"}, {buttonId: "equals", buttonText: "=", action: "equal"}, 
  {buttonId: "clear", buttonText: "C", action: "clear"}, 
]

// buttons mapped from buttonList objects
// pass click function through props in CalcFace

function Buttons(props) {
  const classN = "-button";
  const bId = props.buttonId; 
  const bText = props.buttonText; 
  const toDisplay = () => {
    
    switch (props.actions){

      case "digit":
        if (props.currentDisplay.indexOf("=") !== -1){props.setDisplay("")};
        if (props.currentNum !== "0"){props.setNums(props.currentNum + bText)}
        
        else {props.setNums(bText)}
        break;

      case "zero":
        if (props.currentDisplay.indexOf("=") !== -1){props.setDisplay("")};
        if (props.currentNum !== "0"){
          props.setNums(props.currentNum + bText)}
        break;

      case "op": //all operations except subtraction
        if (props.currentNum !== "0"){
        let op_text = props.currentNum + bText; props.setDisplay(props.currentDisplay + op_text); props.setNums('0')}
        break;
      case "sub": //needs to allow for negative numbers
        let subRegex = /[*+-/]$/;
        if (props.currentNum !== "0") {
            let op_text = props.currentNum + bText; props.setDisplay(props.currentDisplay + op_text); props.setNums('0')
            break; 
          }
        if (props.currentNum === "0" || subRegex.test(props.currentDisplay)){
            props.setNums('-'); 
        }
        break;

      case "decimal":
        if (!props.currentNum.includes(".")){props.setNums(props.currentNum + bText)}
        break;

      case "equal":
        if (props.currentDisplay.indexOf("=") !== -1) {props.setNums(props.currentDisplay.slice(1,));props.setDisplay(""); break;}
        
        // while loop for list of operations, first go through * & / then + & -
        // during while loops, remove used elements from op_list and combine values in numsList where operator applies
        // assign the first value to the product/quotient/whatever, then remove the second value
        let result_str = props.currentDisplay + props.currentNum; props.setNums(""); 
        let numsList = result_str.split(/[^0-9.]/g).map(x => Number(x));
        let ops_list = result_str.split(/[0-9.]/g).filter(x=>x); let result = 0;

        // check for strings in ops_list > 2 length and use only the last operator
        while (numsList.length > ops_list.length + 1){numsList.splice(numsList.indexOf(0),1);};
        ops_list = ops_list.map(function cb (item) {if (item.length > 2){return item.slice(-1)} return item});

        // order of operations - multiply and divide first, then multiply/divide negatives
        // while conditional on "*" or "/" in list of operations
        // inner conditions check which operations come first and executes them in left-right order
        
        while (ops_list.indexOf("*") !== -1 || ops_list.indexOf("/") !== -1 ){
          let multCount = ops_list.indexOf("*"); let divCount = ops_list.indexOf("/");
          
          if ((multCount !== -1 && (multCount < divCount)) || (divCount === -1 && multCount !== -1)){
            let product =  numsList[multCount] * numsList[multCount+1]; numsList[multCount] = product;
            numsList.splice(multCount+1,1); ops_list.splice(multCount,1);}
          if ((divCount !== -1 && (divCount < multCount)) || (multCount === -1 && divCount !== -1)){
            let quotient =  numsList[divCount] / numsList[divCount+1]; numsList[divCount] = quotient;
            numsList.splice(divCount+1,1); ops_list.splice(divCount,1);}
          }
        while ( ops_list.indexOf("*-") !== -1 || ops_list.indexOf("/-") !== -1 ){
          let negMultCount = ops_list.indexOf("*-"); let negDivCount = ops_list.indexOf("/-");
          if ((negMultCount !== -1 && (negMultCount < negDivCount)) || (negDivCount === -1 && negMultCount !== -1)){
            
            let product = numsList[negMultCount] * -numsList[negMultCount+1]; numsList[negMultCount] = product;
            numsList.splice(negMultCount+1,1); ops_list.splice(negMultCount, 1); }
          if ((negDivCount !== -1 && (negDivCount < negMultCount)) || (negMultCount === -1 && negDivCount !== -1)){
            
            let quotient = numsList[negDivCount] / -numsList[negDivCount+1]; numsList[negDivCount] = quotient;
            numsList.splice(negDivCount+1,1); ops_list.splice(negDivCount,1);
          }
        }

        // order of operations - add and subtract last
        while (ops_list.indexOf("+") !== -1 || ops_list.indexOf("-") !== -1){
          let plusCount = ops_list.indexOf("+"); let minusCount = ops_list.indexOf("-");
          
          if ((plusCount !== -1 && (plusCount < minusCount)) || (minusCount === -1 && plusCount !== -1)){
            let addition = numsList[plusCount] + numsList[plusCount+1]; numsList[plusCount] = addition;
            numsList.splice(plusCount+1,1); ops_list.splice(plusCount,1);
          }

          if ((minusCount !== -1 && (minusCount < plusCount)) || (plusCount === -1 && minusCount !== -1)){
            let subtraction = numsList[minusCount] - numsList[minusCount+1]; numsList[minusCount] = subtraction;
            numsList.splice(minusCount+1,1); ops_list.splice(minusCount,1);
          }}
        // .toFixed()
        result = numsList[0]; let resultAsStr = result.toString(); 
        if (resultAsStr.indexOf(".") !== -1){let regextest = /.[0-9]{4,}/; if (regextest.test(resultAsStr)){result=result.toFixed(4)}}

        props.setDisplay(`=${result}`); props.setNums("")
        
        break;
      case "clear":
        props.setDisplay(""); props.setNums("0"); result = 0;
        break;
      default:
        props.setDisplay(props.currentNum)
        break;
  }};
  return (
    <div className={classN} id={bId} onClick={toDisplay}>{bText}</div>
  )
}

function MapButtons(props){
  const Mapped = buttonList.map(button => (
    <Buttons buttonId={button.buttonId} buttonText={button.buttonText} 
    key={button.buttonText} actions={button.action} 
    setDisplay={props.setDisplay} currentDisplay={props.currentDisplay}
    currentNum={props.currentNum} setNums={props.setNums}  />
  ))
  return (<>{Mapped}</>)
}

// readout display 
// display function take props from calcface and use switch statement

function Readout (props) {

  return (
    
    <div className="display" id="display">{props.showDisplay}{props.currentNum}</div>
    
  )
}

// container for subcomponents

function CalcFace (){
  const [numbers, setNumbers] = useState("0");
  const [display, setDisplay] = useState("");
  
  return (
    <div className="calcFace" id="calcface">
      <Readout showDisplay={display} currentNum={numbers} />
      <div className="buttonsFlex">
        <MapButtons setDisplay={setDisplay} setNums={setNumbers} 
        currentNum={numbers} currentDisplay={display} />
      </div>
    </div>
  )
}

export function App () {
  return (
    <div className="outerWrap">
      <CalcFace />
    </div>
  )
}