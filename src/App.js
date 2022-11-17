import React, {useState, useEffect} from "react";
import "./index.css";

const buttonList = [
  {buttonId: "one", buttonText: "1", action: "digit"}, {buttonId: "two", buttonText: "2", action: "digit"}, 
  {buttonId: "three", buttonText: "3", action: "digit"}, {buttonId: "four", buttonText: "4", action: "digit"}, 
  {buttonId: "five", buttonText: "5", action: "digit"}, {buttonId: "six", buttonText: "6", action: "digit"}, 
  {buttonId: "seven", buttonText: "7", action: "digit"}, {buttonId: "eight", buttonText: "8", action: "digit"}, 
  {buttonId: "nine", buttonText: "9", action: "digit"}, {buttonId: "zero", buttonText: "0", action: "zero"}, 
  {buttonId: "add", buttonText: "+", action: "op1"}, {buttonId: "subtract", buttonText: "-", action: "op1"}, 
  {buttonId: "multiply", buttonText: "*", action: "op2"}, {buttonId: "divide", buttonText: "/", action: "op2"}, 
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
    console.log(props.actions, bId);
    let result = 0
    switch (props.actions){
      case "digit":
        if (props.currentNum !== "0"){props.setNums(props.currentNum + bText)}
        else {props.setNums(bText)}
        break;
      case "zero":
        if (props.currentNum !== "0"){
          props.setNums(props.currentNum + bText)}
        break;
      case "op1": //add and subtract
        if (props.currentNum !== "0")
        {let op_text = props.currentNum + bText; props.setDisplay(props.currentDisplay + op_text); props.setNums('0')}
        break;
      case "op2": // multiply and divide
        if (props.currentNum !== "0")
        {let op_text = props.currentNum + bText; props.setDisplay(props.currentDisplay + op_text); props.setNums('0')}
        break;
      case "decimal":
        if (!props.currentNum.includes(".")){props.setNums(props.currentNum + bText)}
        break;
      case "equal":
        props.setDisplay(props.currentDisplay + props.currentNum); props.setNums("");
        break;
      case "clear":
        props.setDisplay(""); props.setNums("0");
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
  const [numbers, setNumbers] = useState("0")
  const [display, setDisplay] = useState("")
  
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