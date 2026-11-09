"use strict";

import {htmlContainerForApplyNewAlarms,htmlNumbersHour,htmlNumbersMinutes,htmlContainerOptionsVibration,htmlContainerOptionsSounds,htmlContainerOptionsSnooze,crateContainerOfNewAlarm,createHtmlToAcivateAlarm,htmlCustomMinutesSnooze,htmlButtonsOfModeSelectingAlarms,
  htmlContainerButtonsTurnOnOfAlarm
} from "./htmlContainers.js";

const $ = selector=>{
  return document.querySelector(selector)
}

const $$ = selector=>{
  return document.querySelectorAll(selector)
}

let sounds = {
  optionSelected:"sound1",
  active:false,
  nameOptionSelected:"Sound 1"
},
vibrations = {
  "basic-call":[1200],
  heartbeat:[150,80,150],
  ticktock:[280,230,180],
  waltz:[400,200,100,350,100],
  "zig-zig-zig":[300,200,300,200,300],
  optionSelected:"basic-call",
  active:false,
  nameOptionSelected:"Basic Call"
},
snooze = {
  minutes:5,
  repeat:2,
  active:false
}

let observersNumbers = {
  minutes:null,
  hours:null
}

let daysSelected = [],
ALARMS = new Map (),
ALARMSSELECTED = new Map ();

//nos indica si ya se esta ejecutando el settime out que va actualizando el tiempo
let callUpdateTimeInGeneral = false;

//claves de las alarmas mas cercanas para activarse , puede haber un mas cercana desactivada y una siguiente activada

let keysOfAlarmNear = [];

const $APLICATION = $(".container-aplication");

const $CONTAINERHOME = $(".container-home");

let $TEXTTOSHOWINTOPCONTAINER = $(".container-top-aplication .container-buttons .text-alarm");

const $CONTAINERTEXTSALARM = $(".container-top-aplication .container-texts-alarm");

const $TEXTTIMEMISSING = $(".text-time-for-alarm-active");

const $TEXTDATEOFALARMNEAR = $(".text-date-of-alarm");

function stopAnimationOfScrollToPressContainer (event) {
  $CONTAINERHOME[event] = () => {
    $CONTAINERHOME.removeAttribute("data-scrollendwithanimation");
  
    $CONTAINERHOME.scrollTo({
      behavior:"auto",
      top:$CONTAINERHOME.scrollTop
    })
  }
}

stopAnimationOfScrollToPressContainer("ontouchstart");
stopAnimationOfScrollToPressContainer("onmousedown");

$CONTAINERHOME.onscroll = scrollContainerHome;

$CONTAINERHOME.onscrollend = scrollEndContainerHome;

$APLICATION.onclick = clickAplication;

function applyHeightToContainerOfAlarms () {
  const $CONTAINERFORALARMS = $(".container-aplication .container-added-alarms"),
  $CONTAINERBUTTONADDALARM = $(".container-aplication .container-top-aplication .container-buttons");
  
  let {height} = $CONTAINERBUTTONADDALARM.getBoundingClientRect();
  
  setPropertyElement($CONTAINERFORALARMS,"height",`calc(100% - ${height}px`);
}

applyHeightToContainerOfAlarms()

function scrollEndContainerHome ({target}) {
  let {scrollHeight,clientHeight,scrollTop} = $CONTAINERHOME;
  
  let scrollMax = scrollHeight - clientHeight;
  
  let halfScrollMax = scrollMax / 2;
  
  const {scrollendwithanimation} = target.dataset;
  
  if (!scrollendwithanimation) $CONTAINERHOME.scrollTo({
    behavior:"smooth",
    top:scrollTop >= halfScrollMax ? scrollMax : 0
  })
  
  target.setAttribute("data-scrollendwithanimation","true");
}

function getPercentageOfScroll (valueHigher,valueLess,halfScrollMax) {
  let percentageScrollInHalf = (valueHigher - valueLess) * 100 / halfScrollMax;
  
  if (Math.round(percentageScrollInHalf) === 100) percentageScrollInHalf = Math.round(percentageScrollInHalf);
  
  return percentageScrollInHalf;
}

function scrollContainerHome ({target}) {
  let {scrollHeight,clientHeight,scrollTop} = target;
  
  let scrollMax = scrollHeight - clientHeight;
  
  let halfScrollMax = scrollMax / 2;
  
  const $TEXTAMOUNTSELECTALARM = $(".container-top-aplication .container-buttons-mode-selection-alarms .text-select-alarm");
  
  if (scrollTop >= halfScrollMax) {
    let percentageOpacity = getPercentageOfScroll(scrollTop,halfScrollMax,halfScrollMax);
    
    setPropertyElement($CONTAINERTEXTSALARM,"opacity",`0%`);
    
    setPropertyElement($TEXTAMOUNTSELECTALARM ?? $TEXTTOSHOWINTOPCONTAINER,"opacity",`${percentageOpacity}%`);
  } else {
    let percentageOpacity = getPercentageOfScroll(halfScrollMax,scrollTop,halfScrollMax);
    
    setPropertyElement($TEXTAMOUNTSELECTALARM ?? $TEXTTOSHOWINTOPCONTAINER,"opacity",`0%`);
    
    setPropertyElement($CONTAINERTEXTSALARM,"opacity",`${percentageOpacity}%`);
  }
}

function setPropertyElement ($element,property,value) {
  $element.style.setProperty(property,value)
}

function numberHasIntersecting (target,observer) {
  let numberIs,
  NUMBER,
  amountNums;
  
  const {hour,minute} = target.dataset;
  
  if (hour) {
    numberIs = "hour";
    NUMBER = Number(hour);
    amountNums = 24;
  }
  else if (minute) {
    numberIs = "minute";
    NUMBER = Number(minute);
    amountNums = 60;
  }
  
  const $CONTAINERNUMBERS = target.parentElement;
  
  let numsOutOfLimit = $CONTAINERNUMBERS.children.length > amountNums;
  
  const removeHour = (location,rangeTravel) => {
    const {start,end} = rangeTravel;
    
    for (let number = start;number <= end;number++) {
      const $ALLNUMBERS = numberIs === "hour" ? $$(`.container-hours div[data-hour='${number}']`) : $$(`.container-minutes div[data-minute='${number}']`);
    
      const $NUMTOREMOVE = $ALLNUMBERS[location === "fromEnd" ? $ALLNUMBERS.length - 1 : 0];
      
      let {hour,minute} = $NUMTOREMOVE.dataset;
    
      if ((numberIs === "hour" && Number(hour) === 20 && location === "fromEnd") || (numberIs === "hour" && Number(hour) === 4 && location === "fromStart") || (numberIs === "minute" && Number(minute) === 55 && location === "fromEnd") || (numberIs === "minute" && Number(minute) === 3 && location === "fromStart")) observer.unobserve($NUMTOREMOVE)
      
      $NUMTOREMOVE.remove();
    }
  }
  
  const updateNumberToObserve = (number,last) => {
    let methodCorrect = last ? $$ : $;
    
    const $NUMBERTOOBSERVE = numberIs === "hour" ? methodCorrect(`.container-hours div[data-hour='${number}']`) : methodCorrect(`.container-minutes div[data-minute='${number}']`);
    
    if (last) observer.observe($NUMBERTOOBSERVE[$NUMBERTOOBSERVE.length - 1]);
    else observer.observe($NUMBERTOOBSERVE);
  }
  
  if (numsOutOfLimit && numberIs === "hour") {
    removeHour(NUMBER === 4 ? "fromEnd" : "fromStart",{start:1,end:24});
    updateNumberToObserve(NUMBER === 4 ? 20 : 4);
  }
  else if (numsOutOfLimit && numberIs === "minute") {
    removeHour(NUMBER === 3 ? "fromEnd" : "fromStart",{start:0,end:59});
    updateNumberToObserve(NUMBER === 3 ? 55 : 3);
  }
  
  if (NUMBER === 4 || NUMBER === 3) {
    $CONTAINERNUMBERS.insertAdjacentHTML("afterbegin",numberIs === "hour" ? htmlNumbersHour : htmlNumbersMinutes);
    
    observer.unobserve(target);
    
    updateNumberToObserve(numberIs === "hour" ? 4 : 3);
  }
  else if (NUMBER === 20 || NUMBER === 55) {
    $CONTAINERNUMBERS.insertAdjacentHTML("beforeend",numberIs === "hour" ? htmlNumbersHour : htmlNumbersMinutes);
    
    observer.unobserve(target);
    
    updateNumberToObserve(numberIs === "hour" ? 20 : 55,"last");
  }
}

function theContainerWasObserved (entries,observer) {
  entries.forEach(entry=>{
    if (entry.isIntersecting) {
      numberHasIntersecting(entry.target,observer);
      console.log(entry.target.parentElement.children.length)
    }
    else {
      console.log(entry.target.innerText,'fuera de la vista')
    }
  })
}

function observerContainerStartAndEndTime ($CONTAINERNUMBERS) {
  let observerNUMBERtime = new IntersectionObserver(theContainerWasObserved,{
    root:$CONTAINERNUMBERS,
    threshold:0.01
    });
    
  observersNumbers[$CONTAINERNUMBERS.classList.contains("container-minutes") ? "minutes" : "hours"] = observerNUMBERtime;
  
  let indexLastNumbers = $CONTAINERNUMBERS.children.length - 1;
  
  //OBSERVA EL CONTAINER RETROSEDIENDO 4 POSICIONES DESDE EL FINAL
  //EL EL CONTENEDOR DE LAS HORAS ES EL NUMERO 20 Y EL DE MINUTOS ES 55
  const $LASTNUMBERTOOBSERVE = $CONTAINERNUMBERS.children[indexLastNumbers - 4];
  
  //OBSERVA EL 4TO CONTAINER DESDE EL PRINCIPIO
  //EN EL CONTENEDOR HORAS ES EL NUMERO 4 Y EL DE MINUTOS ES 3
  const $FIRSTNUMBERTOOBSERVE = $CONTAINERNUMBERS.children[3];
  
  observerNUMBERtime.observe($FIRSTNUMBERTOOBSERVE);
  observerNUMBERtime.observe($LASTNUMBERTOOBSERVE);
}

function showHourAndMinute (hour,minute) {
  const $CONTAINERHOURS = $(".container-for-apply-alarm .container-hours");
  
  const $CONTAINERMINUTES = $(".container-for-apply-alarm .container-minutes");
  
  if (isNaN(hour)) {
    //MARCA LA HORA 6
    $CONTAINERHOURS.scrollTo({behavior:"smooth",top:360});
    
    //MARCA EL MINUTO 30
    $CONTAINERMINUTES.scrollTo({behavior:"smooth",top:2610});
  }
  else {
    let topScrollContainerHours,
    topScrollContainerMinutes;
    
    if (hour === 1 || hour === 24) {
      $CONTAINERHOURS.insertAdjacentHTML("afterbegin",htmlNumbersHour);
      topScrollContainerHours = hour === 1 ? 23 * 90 : 22 * 90;
    } else topScrollContainerHours = (hour - 2) * 90;
    
    if (minute === 0 || minute === 59) {
      $CONTAINERMINUTES.insertAdjacentHTML("afterbegin",htmlNumbersMinutes);
      topScrollContainerMinutes = minute === 0 ? 59 * 90 : 58 * 90;
    } else topScrollContainerMinutes = (minute - 1) * 90;
    
    $CONTAINERHOURS.scrollTo({
      behavior:"auto",
      top:topScrollContainerHours
    })
    
    $CONTAINERMINUTES.scrollTo({
      behavior:"auto",
      top:topScrollContainerMinutes
    })
  }
  
  $CONTAINERHOURS.setAttribute("data-establishednumber",hour ?? 6);
  $CONTAINERMINUTES.setAttribute("data-establishednumber",minute ?? 30);
}

function setDateSelectedOfAlarm (mode,keyAlarm) {
  const $INPUTDATE = $(".container-for-apply-alarm #set-date input");
  
  let year,month,date;
  
  if (mode === "add") {
    let dateCurrent = new Date();
    
    [date,month,year] = dateCurrent.toLocaleDateString().split("/").map(val=>{return Number(val)});
  }
  else {
    let propsAlarm = ALARMS.get(keyAlarm);
    
    date = propsAlarm.date;
    month = propsAlarm.month + 1;
    year = propsAlarm.year;
  }
  
  $INPUTDATE.value = `${year}-${formatNumber(month)}-${formatNumber(date)}`;
}

function getTimeSelected () {
  const timeOfAlarm = $(".container-for-apply-alarm").dataset.timealarm;
  
  let hour = Number($(`.container-for-apply-alarm .container-hours`).dataset.establishednumber),
  minute = Number($(`.container-for-apply-alarm .container-minutes`).dataset.establishednumber);
  
  if (timeOfAlarm) {
    [hour,minute] = timeOfAlarm.split("-").map(time=>{return Number(time)})
  }
  
  return {hour:hour === 24 ? 0 : hour,minute}
}

function updateDateAlarm () {
  const $INPUTDATE = $(".container-date-current #set-date input");
  
  let value = $INPUTDATE.value;
  
  let [year,month,day] = value.split("-").map((val,index)=>{
    if (index === 1) return Number(val - 1)
    return Number(val)
  });
  
  const {hour,minute} = getTimeSelected();
  
  let dateSelected = new Date(year,month,day),dateNow = new Date();
  
  let dateSelectedForToday = day === dateNow.getDate() && month === dateNow.getMonth() && year === dateNow.getFullYear(),
  lateTime = hour < dateNow.getHours() || (hour === dateNow.getHours() && minute <= dateNow.getMinutes());
  
  let {todayfromtomorrow} = $INPUTDATE.dataset;
  
  let dateSelectedToString;
  
  if (lateTime && (todayfromtomorrow || dateSelectedForToday)) {
    let dayTomorrow = new Date(dateNow.getFullYear(),dateNow.getMonth(),dateNow.getDate() + 1);
    
    let [day,month,date] = dayTomorrow.toDateString().split(" ");
    
    let [_,monthAsNum,yearAsNum] = dayTomorrow.toLocaleDateString().split("/");
    
    dateSelectedToString = `Tomorrow-${day} ${month} ${date}`;
    
    $INPUTDATE.value = `${yearAsNum}-${formatNumber(monthAsNum)}-${date}`;
    
    $INPUTDATE.setAttribute("data-todayfromtomorrow","true");
  }
  else if (todayfromtomorrow || dateSelectedForToday) {
    let [day,month,date] = dateNow.toDateString().split(" ");
    
    let [_,monthAsNum,yearAsNum] = dateNow.toLocaleDateString().split("/");
    
    dateSelectedToString = `Today-${day} ${month} ${date}`;
    
    $INPUTDATE.value = `${yearAsNum}-${formatNumber(monthAsNum)}-${date}`;
    
    $INPUTDATE.removeAttribute("data-todayfromtomorrow");
  }
  else if (dateSelected.getTime() < dateNow.getTime()) {
    let [_,month,year] = dateNow.toLocaleDateString().split("/");
    
    let date = dateNow.toDateString().split(" ")[2];
    
    $INPUTDATE.value = `${year}-${formatNumber(month)}-${date}`;
    
    updateDateAlarm();
    
    return;
  }
  else {
    let [day,month,date,year] = dateSelected.toDateString().split(" ");
    
    dateSelectedToString = `${day} ${month} ${date}`;
   
    if (dateSelected.getFullYear() > dateNow.getFullYear()) dateSelectedToString += ` ${year}`;
  }
  
  if (daysSelected.length === 0) {
    const $TEXTDATEALARMCURRENT = $(".container-for-apply-alarm .container-date-current .text-day-alarm");
    
    $TEXTDATEALARMCURRENT.innerText = dateSelectedToString;
  }
}

function backToHomeWithTransition () {
  const $CONTAINERTOOLSFORAPPLYALARM = $(".container-for-apply-alarm");
  
  $CONTAINERTOOLSFORAPPLYALARM.ontransitionend = () => {
    
    observersNumbers.minutes.disconnect();
    observersNumbers.hours.disconnect();
    
    console.log(observersNumbers,"desconectamos los Observers")
    
    $CONTAINERTOOLSFORAPPLYALARM.remove()
    
    setPropertyElement($CONTAINERHOME,"overflow","auto");
    
    $APLICATION.onclick = clickAplication;
  }
  
  setPropertyElement($CONTAINERTOOLSFORAPPLYALARM,"top","100%");
}

function openContainerForSettingAlarm (hour,minute,nameAlarm,keyAlarm) {
  $APLICATION.onclick = null;
  
  setPropertyElement($CONTAINERHOME,"overflow","hidden");
  
  $APLICATION.insertAdjacentHTML("beforeend",htmlContainerForApplyNewAlarms);
  
  const $CONTAINERTOOLSFORAPPLYALARM = $(".container-for-apply-alarm");
  
  $CONTAINERTOOLSFORAPPLYALARM.setAttribute("data-timealarm",`${hour}-${minute}`);
  $CONTAINERTOOLSFORAPPLYALARM.setAttribute("data-alarmtomodify",keyAlarm);
  
  const $CONTAINERHOURS = $CONTAINERTOOLSFORAPPLYALARM.querySelector(".container-hours");
  
  const $CONTAINERMINUTES = $CONTAINERTOOLSFORAPPLYALARM.querySelector(".container-minutes");
  
  const setEventsContainerTime = ($CONTAINER)=>{
    setPropertyElement($CONTAINER,"overflow","auto");
    
    $CONTAINER.onscrollend = scrollEndContainerNumbersTime;
    
    $CONTAINER.ontouchstart = pulseContainerNumbersOfTime;
    
    $CONTAINER.ontouchend = pulseContainerNumbersOfTime;
    
    $CONTAINER.onmousedown = pulseContainerNumbersOfTime;
    
    $CONTAINER.onmouseup = pulseContainerNumbersOfTime;
  }
  
  $CONTAINERTOOLSFORAPPLYALARM.ontransitionend = () => {
    $CONTAINERHOME.scrollTop = 0;
    
    scrollContainerHome({target:$CONTAINERHOME});
    
    $APLICATION.onclick = clickAplication;
    
    $CONTAINERHOURS.onscrollend = () => {
      setEventsContainerTime($CONTAINERHOURS);
      observerContainerStartAndEndTime($CONTAINERHOURS);
    }
  
    $CONTAINERMINUTES.onscrollend = () => {
      setEventsContainerTime($CONTAINERMINUTES)
      observerContainerStartAndEndTime($CONTAINERMINUTES);
    }
    
    showHourAndMinute(hour,minute);
    
    if (hour === 2) {
      setEventsContainerTime($CONTAINERHOURS);
      observerContainerStartAndEndTime($CONTAINERHOURS);
    }
    
    if (minute === 1) {
      setEventsContainerTime($CONTAINERMINUTES)
      observerContainerStartAndEndTime($CONTAINERMINUTES);
    }
  
    setOrRemoveEventClickContainerOptions("set",$$(".container-all-options > div"),clickOptionInSettingAlarm);
    
    setOrRemoveEventClickContainerOptions("set",[$(".container-all-days-week")],clickDayOfWeek);
    
    $CONTAINERTOOLSFORAPPLYALARM.ontransitionend = null;
  }

  showContainerWithAnimation($CONTAINERTOOLSFORAPPLYALARM)
  
  activateOrDesactivateSwitchOptions()
  
  showDaysSelected();
  
  setDateSelectedOfAlarm("modify",keyAlarm);
  
  if (daysSelected.length) setTextWithallDaysOfWeekSelected();
  
  $(".container-for-apply-alarm #set-date input").onchange = changeDateInput;
  
  $(".container-for-apply-alarm .name-for-apply-alarm").value = nameAlarm;
}

function openContainerForAddAlarm () {
  $APLICATION.onclick = null;
  
  setPropertyElement($CONTAINERHOME,"overflow","hidden");
  
  $APLICATION.insertAdjacentHTML("beforeend",htmlContainerForApplyNewAlarms);
  
  const $CONTAINERTOOLSFORAPPLYALARM = $(".container-for-apply-alarm");
  
  const $CONTAINERHOURS = $CONTAINERTOOLSFORAPPLYALARM.querySelector(".container-hours")
  
  const $CONTAINERMINUTES = $CONTAINERTOOLSFORAPPLYALARM.querySelector(".container-minutes")
  
  const setEventsContainerTime = ($CONTAINER)=>{
    setPropertyElement($CONTAINER,"overflow","auto");
    
    $CONTAINER.onscrollend = scrollEndContainerNumbersTime;
    
    $CONTAINER.ontouchstart = pulseContainerNumbersOfTime;
    
    $CONTAINER.ontouchend = pulseContainerNumbersOfTime;
    
    $CONTAINER.onmousedown = pulseContainerNumbersOfTime;
    
    $CONTAINER.onmouseup = pulseContainerNumbersOfTime;
  }
  
  $CONTAINERTOOLSFORAPPLYALARM.ontransitionend = () => {
    $CONTAINERHOME.scrollTop = 0;
    
    scrollContainerHome({target:$CONTAINERHOME});
    
    $APLICATION.onclick = clickAplication;
    
    $CONTAINERHOURS.onscrollend = () => {
      observerContainerStartAndEndTime($CONTAINERHOURS);
      
      setEventsContainerTime($CONTAINERHOURS);
    }
    
    $CONTAINERMINUTES.onscrollend = () => {
      observerContainerStartAndEndTime($CONTAINERMINUTES);
      
      setEventsContainerTime($CONTAINERMINUTES);
      
      setOrRemoveEventClickContainerOptions("set",$$(".container-all-options > div"),clickOptionInSettingAlarm);
      
      setOrRemoveEventClickContainerOptions("set",[$(".container-all-days-week")],clickDayOfWeek);
    }
    
    showHourAndMinute();
    
    $CONTAINERTOOLSFORAPPLYALARM.ontransitionend = null;
  }

  showContainerWithAnimation($CONTAINERTOOLSFORAPPLYALARM)
  
  activateOrDesactivateSwitchOptions()
  
  showDaysSelected();
  
  setDateSelectedOfAlarm("add")
  
  if (daysSelected.length) setTextWithallDaysOfWeekSelected();
  
  if (!callUpdateTimeInGeneral) updateTime();
  
  $(".container-for-apply-alarm #set-date input").onchange = changeDateInput;
}

function positionPseudoelementsAfterBefore () {
  const $CONTAINERNUMBER = $(".container-for-apply-alarm .container-hours");
  
  let offSetTop = $CONTAINERNUMBER.offsetTop
  
  setPropertyElement($APLICATION,"--topAfterPseudoelementNumbers",`${offSetTop}px`);
  setPropertyElement($APLICATION,"--topBeforePseudoelementNumbers",`${offSetTop + 180}px`);
  
  //180 equivale a dos contenedores de numeros con un height de 90 px
}

function clickAplication ({target}) {
  let {id} = target,
  keyAlarmToModify = $(".container-for-apply-alarm")?.getAttribute("data-alarmtomodify");
  
  if (id === "add-new-alarm") {
    openContainerForAddAlarm();
    positionPseudoelementsAfterBefore()
  }
  else if (id === "close-container-setting-alarm-for-apply") {
    setOrRemoveEventClickContainerOptions("remove",$$(".container-all-options > div"),clickOptionInSettingAlarm);
    
    setOrRemoveEventClickContainerOptions("remove",[$(".container-all-days-week")],clickDayOfWeek);
    
    $APLICATION.onclick = null;
    
    backToHomeWithTransition();
  }
  else if (id === "set-date") {
    const $DATEINPUT = $(".container-for-apply-alarm .container-date-current .icon-calendar input");
    
    $DATEINPUT.click();
  }
  else if (id === "save-alarm" && keyAlarmToModify) {
    let {hour,minute} = getTimeSelected();
    
    let activeAlarmOnlyDaysSelected = daysSelected.length > 0;
    
    const dateToApply = new Date($(".container-for-apply-alarm #set-date input").value + "T00:00:00");
    
    let existRepeatAlarm = repeatALARM(dateToApply,hour,minute,activeAlarmOnlyDaysSelected,keyAlarmToModify);
    
    if (existRepeatAlarm) {
      showPseudoelementOfTimeAlarm("Repeat Alarm");
      return;
    }
    
    const $ALARMTOMODIFY = $(`.container-home .container-alarm-apply#${keyAlarmToModify}`);
    
    $ALARMTOMODIFY.querySelector("audio")?.remove();
    
    const $NAMEALARM = $ALARMTOMODIFY.querySelector(".name"),
    $TIMEALARM = $ALARMTOMODIFY.querySelector(".time"),
    $SWITCH = $ALARMTOMODIFY.querySelector(".switch");
    
    $NAMEALARM.innerText = $(".name-for-apply-alarm").value;
    
    if ($(".container-actived-alarm")?.getAttribute("data-keyofalarm") === keyAlarmToModify) {
      stopVibrationCurrent(ALARMS.get(keyAlarmToModify));
      hideModalOfAlarmActivated();
    }
    
    ALARMS.delete(keyAlarmToModify);
    
    setTextSnoozeAlarm(keyAlarmToModify,"")
    
    let hourToString = formatNumber(hour === 0 ? 24 : hour),
    minuteToString = formatNumber(minute);
    
    $TIMEALARM.innerText = `${hourToString}:${minuteToString}`;
    
    setDateToActiveAlarm($ALARMTOMODIFY);
    
    setOrRemoveEventClickContainerOptions("remove",$$(".container-all-options > div"),clickOptionInSettingAlarm);
    
    setOrRemoveEventClickContainerOptions("remove",[$(".container-all-days-week")],clickDayOfWeek);
    
    $APLICATION.onclick = null;
    
    backToHomeWithTransition();
    
    setValuesOfAlarmSave($ALARMTOMODIFY);
    
    getKeysOfAlarmsNear();
    
    $SWITCH.classList.add("active");
    
    activateOrDesactivateALARM($ALARMTOMODIFY,true);
  }
  else if (id === "save-alarm") {
    const nameAlarm = $(".name-for-apply-alarm").value;
    
    let {hour,minute} = getTimeSelected();
    
    let activeAlarmOnlyDaysSelected = daysSelected.length > 0;
    
    const dateToApply = new Date($(".container-for-apply-alarm #set-date input").value + "T00:00:00");
    
    let existRepeatAlarm = repeatALARM(dateToApply,hour,minute,activeAlarmOnlyDaysSelected);
    
    if (existRepeatAlarm) {
      showPseudoelementOfTimeAlarm("Repeat Alarm")
      return;
    }
    
    let hourToString = formatNumber(hour === 0 ? 24 : hour),
    minuteToString = formatNumber(minute)
    
    const htmlAlarmSave = crateContainerOfNewAlarm(nameAlarm,hourToString,minuteToString);
    
    $(".container-added-alarms").insertAdjacentHTML("beforeend",htmlAlarmSave);
    
    const $ALARM = $(".container-added-alarms").lastElementChild;
    
    setDateToActiveAlarm($ALARM);
    
    setOrRemoveEventClickContainerOptions("remove",$$(".container-all-options > div"),clickOptionInSettingAlarm);
    
    setOrRemoveEventClickContainerOptions("remove",[$(".container-all-days-week")],clickDayOfWeek);
    
    $APLICATION.onclick = null;
    
    backToHomeWithTransition();
    
    setValuesOfAlarmSave($ALARM);
    
    showOrHiddeTextNoAlarms();
    
    getKeysOfAlarmsNear();
    
    setTextDateOfAlarmApplied(ALARMS.get($ALARM.id));
    
    $ALARM.onclick = clickAlarmApply;
    
    let isMovil = window.matchMedia("(pointer:coarse)").matches;
    
    let eventsSet = [];
    
    if (isMovil) eventsSet = ["ontouchstart","ontouchmove","ontouchend"];
    else eventsSet = ["onmousedown","onmousemove","onmouseup"];
    
    eventsSet.forEach(event=>{
      $ALARM[event] = touchAlarmContainer;
    })
  }
  else if (id === "select-all-alarms") {
    target.classList.toggle("active");
    
    let selectedAllAlarms = target.classList.contains("active");
    
    let colorBorder = selectedAllAlarms ? "transparent" : "var(--colorBorderCircleOptionsDefault)";
    
    setPropertyElement(target,"border-color",colorBorder)
    
    selectOrNotAllAlarmsAvaliables(selectedAllAlarms);
    
    const $DELETEALARMTEXT = $(".container-buttons-turn-off-on-alarm #delete-alarm p");
    
    if (selectedAllAlarms) $DELETEALARMTEXT.innerText = "Delete All";
    else $DELETEALARMTEXT.innerText = "Delete";
    
    ALARMS.keys().forEach(keyAlarm=>{
      if (selectedAllAlarms) ALARMSSELECTED.set(keyAlarm,ALARMS.get(keyAlarm).active);
      else ALARMSSELECTED.delete(keyAlarm);
    })
    
    showButtonsTurnOffOnAndDeleteAlarm();
    
    setTextOfUpcomingAlarm()
  }
  else if (id === "out-of-select-alarm") closeToolsOfSelectionAlarm();
}

function closeToolsOfSelectionAlarm () {
  $APLICATION.removeAttribute("data-modeselectionalarmactive");
  
  ALARMS.entries().forEach(([_,props])=>{
    delete props.idSetTimeOutPressingAlarm
  })
  
  ALARMSSELECTED.clear();
  
  $(".container-top-aplication .container-buttons-mode-selection-alarms").remove();
  
  const $TEXTALARM = $(".container-top-aplication .container-buttons .text-alarm"),
  $BUTTONADDALARM = $(".container-top-aplication .container-buttons #add-new-alarm");
  
  [$TEXTALARM,$BUTTONADDALARM].forEach($E=>{
    setPropertyElement($E,"visibility","visible");
  })
  
  const $CONTAINERSCENTERALARM = $$(".container-alarm-apply .center-container"),
  $CONTAINERCIRCLECHECK = $$(".container-alarm-apply .container-circle-select");
  
  $CONTAINERSCENTERALARM.forEach(($CONTAINER,index)=>{
    const $CIRCLE = $CONTAINERCIRCLECHECK[index];
    
    setPropertyElement($CIRCLE,"opacity","0");
    
    setPropertyElement($CONTAINER,"transform","translateX(0px)");
    
    $CIRCLE.ontransitionend = () => {
      $CIRCLE.classList.remove("active");
      $CIRCLE.ontransitionend = null;
      setPropertyElement($CIRCLE,"border-color","var(--colorBorderCircleOptionsDefault)");
    }
  })
  
  $(".container-buttons-turn-off-on-alarm").remove();
  
  scrollContainerHome({target:$CONTAINERHOME});
}

function selectOrNotAllAlarmsAvaliables (select) {
  $$(".container-alarm-apply .container-circle-select").forEach($CIRCLE=>{
    if (select) {
      setPropertyElement($CIRCLE,"border-color","transparent");
      $CIRCLE.classList.add("active");
    }
    else {
      setPropertyElement($CIRCLE,"border-color","var(--colorBorderCircleOptionsDefault)");
      $CIRCLE.classList.remove("active");
    }
  })
}

function setInMapAlarmSelected (keyAlarm,$CIRCLECHECK) {
  if ($CIRCLECHECK.classList.contains("active")) {
    let {active} = ALARMS.get(keyAlarm);
    ALARMSSELECTED.set(keyAlarm,active);
  }
  else ALARMSSELECTED.delete(keyAlarm);
}

function circleSelctedAllAlarmsDesactivateOrActivate () {
  const $CIRCLECHECK = $(".container-top-aplication .container-circle-select"),
  $DELETEALARMTEXT = $(".container-buttons-turn-off-on-alarm #delete-alarm p");
  
  let border;
  if (ALARMSSELECTED.size === ALARMS.size) {
    border = "transparent";
    $CIRCLECHECK.classList.add("active");
    $DELETEALARMTEXT.innerText = "Delete All";
  }
  else {
    border = "var(--colorBorderCircleOptionsDefault)";
    $CIRCLECHECK.classList.remove("active");
    $DELETEALARMTEXT.innerText = "Delete";
  }
  
  setPropertyElement($CIRCLECHECK,"border-color",border);
}

function showButtonsTurnOffOnAndDeleteAlarm () {
  const $CONTAINERMAINBUTTONS = $(".container-buttons-turn-off-on-alarm");
  
  let heightContainer = $CONTAINERMAINBUTTONS.getBoundingClientRect().height;
  
  let topPosition = ALARMSSELECTED.size ? `calc(100% - ${heightContainer}px` : "100%";
  
  setPropertyElement($CONTAINERMAINBUTTONS,"top",topPosition);
  
  let activateButtonTurnOf,
  activateButtonTurnOn;
  
  for (let activeALARM of ALARMSSELECTED.values()) {
    if (activeALARM) activateButtonTurnOf = true;
    else activateButtonTurnOn = true;
    
    if (activateButtonTurnOn && activateButtonTurnOf) break;
  }
  
  if (ALARMSSELECTED.size) {
    setPropertyElement($CONTAINERMAINBUTTONS.querySelector("#turn-on"),"display",activateButtonTurnOn ? "flex" : "none");
  
    setPropertyElement($CONTAINERMAINBUTTONS.querySelector("#turn-off"),"display",activateButtonTurnOf ? "flex" : "none");
  }
}

function touchAlarmContainer ({currentTarget,type}) {
  let keyAlarm = currentTarget.id,
  propsAlarm = ALARMS.get(keyAlarm);
  
  if (type === "touchmove" || type === "mousemove") currentTarget.setAttribute("data-movetouch","true");
  
  console.log(type,"v2")
  
  if (type === "touchstart" || type === "mousedown") {
    currentTarget.removeAttribute("data-movetouch");
    
    propsAlarm.idSetTimeOutPressingAlarm = setTimeout(()=>{
      currentTarget.setAttribute("data-movetouch","true");
      
      $APLICATION.setAttribute("data-modeselectionalarmactive","true");
      
      const $CENTERCONTAINERSOFALARMS = $$(".container-alarm-apply .center-container"),
      $CONTAINERCIRCLESCHECK = $$(".container-alarm-apply .container-circle-select");
      
      $CENTERCONTAINERSOFALARMS.forEach(($CONTAINER,index)=>{
        const $CIRCLECHECK = $CONTAINERCIRCLESCHECK[index];
        
        setPropertyElement($CONTAINER,"transform","translateX(49px)");
        setPropertyElement($CIRCLECHECK,"opacity","1");
        
        if ($CIRCLECHECK === currentTarget.querySelector(".container-circle-select")) {
          $CIRCLECHECK.classList.add("active");
          setPropertyElement($CIRCLECHECK,"border-color","transparent");
          setInMapAlarmSelected(keyAlarm,$CIRCLECHECK);
        }
      })
      
      const $CONTAINERTOPAPLICATION = $(".container-top-aplication .container-buttons");
      
      if (!$CONTAINERTOPAPLICATION.querySelector(".container-buttons-mode-selection-alarms")) {
        const $TEXTALARM = $CONTAINERTOPAPLICATION.querySelector("p"),
        $BUTTONADDALARM = $TEXTALARM.nextElementSibling;
        
        setPropertyElement($TEXTALARM,"visibility","hidden");
        setPropertyElement($BUTTONADDALARM,"visibility","hidden");
        
        $CONTAINERTOPAPLICATION.insertAdjacentHTML("beforeend",htmlButtonsOfModeSelectingAlarms)
        
        scrollContainerHome({target:$CONTAINERHOME});
        
        $APLICATION.insertAdjacentHTML("beforeend",htmlContainerButtonsTurnOnOfAlarm);
        
        $(".container-buttons-turn-off-on-alarm").onclick = clickButtonsTurnOffOnAndDelete;
      }
      
      setTimeout(()=>{
        setPropertyElement($(".container-top-aplication .container-buttons .container-circle-select"),"opacity","1");
        
        showButtonsTurnOffOnAndDeleteAlarm();
      },0)
      
      circleSelctedAllAlarmsDesactivateOrActivate()
      
      setTextOfUpcomingAlarm()
    },1000);
  }
  else if (type === "touchmove" || type === "touchend" || type === "mousemove" || type === "mouseup") clearTimeout(propsAlarm.idSetTimeOutPressingAlarm);
  
  let {movetouch} = currentTarget.dataset,
  {modeselectionalarmactive} = $APLICATION.dataset;
  
  if (!movetouch && (type === "touchend" || type === "mouseup")&& modeselectionalarmactive) {
    const $CIRCLECHECKCONTAINER = currentTarget.querySelector(".container-circle-select");
    
    $CIRCLECHECKCONTAINER.classList.toggle("active");
    
    let colorBorder = $CIRCLECHECKCONTAINER.classList.contains("active") ? "transparent" : "var(--colorBorderCircleOptionsDefault)";
    
    setPropertyElement($CIRCLECHECKCONTAINER,"border-color",colorBorder);
    
    setInMapAlarmSelected(keyAlarm,$CIRCLECHECKCONTAINER);
    
    setTextOfUpcomingAlarm()
    
    circleSelctedAllAlarmsDesactivateOrActivate();
    
    showButtonsTurnOffOnAndDeleteAlarm();
  }
}

function clickButtonsTurnOffOnAndDelete ({target}) {
  let button = target.id;
  
  if (button === "delete-alarm") {
    ALARMSSELECTED.keys().forEach(key=>{
      if (key === $(".container-actived-alarm")?.dataset.keyofalarm) {
        let propsAlarm = ALARMS.get(key);
        stopVibrationCurrent(propsAlarm);
        hideModalOfAlarmActivated();
      }
      
      ALARMS.delete(key);
      
      const $ALARM = $(`.container-alarm-apply#${key}`);
      
      $ALARM.classList.add("delete-alarm-effect");
      
      setTimeout(()=>{
        $ALARM.remove();
      },201)
    })
    showOrHiddeTextNoAlarms();
  }
  else {
    const keyOfAlarmActive = $(".container-actived-alarm")?.dataset.keyofalarm;
    
    ALARMSSELECTED.keys().forEach(keyAlarm=>{
      turnOffOnAlarm(keyAlarm,keyOfAlarmActive,button === "turn-on");
    })
  }
  
  closeToolsOfSelectionAlarm();
  getKeysOfAlarmsNear();
}

function turnOffOnAlarm (keyAlarm,keyOfAlarmActive,turnOn) {
  let propsAlarm = ALARMS.get(keyAlarm);
  
  if (keyOfAlarmActive === keyAlarm) {
    deleteTimeStartAlarm(keyAlarm);
    pauseSoundAlarmActive(keyAlarm);
    stopVibrationCurrent(propsAlarm);
    hideModalOfAlarmActivated();
  }
  
  if (keyOfAlarmActive === keyAlarm || keyAlarm.includes("snooze")) {
    deactivateALARM($(`.container-alarm-apply#${keyAlarm}`),keyAlarm,propsAlarm);
    applyAlarmForNextDate(keyAlarm);
    getKeysOfAlarmsNear();
    return;
  }
  
  let methodClass = turnOn ? "add" : "remove";
  
  propsAlarm.active = turnOn;
  
  const $ALARM = $(`.container-alarm-apply#${keyAlarm}`);
  
  const $SWITCH = $ALARM.querySelector(".switch");
  
  $SWITCH.classList[methodClass]("active");
  
  activateOrDesactivateALARM($ALARM,turnOn);
}

//OBTENEMOS LAS KEYS DE LAS ALARMAS CERCANAS , YA QUE PUEDE HABER UNO DESACTIVADO Y EL SIGUIENTE ACTIVADO
function getKeysOfAlarmsNear () {
  let milisecondsFromNow = Date.now(),
  beforeDiferenceOfTime = Infinity;
  
  let keyOfAlarmNearActived,
  keyOfAlarmNearDesactived;
  
  ALARMS.entries().forEach(([key,values],index)=>{
    let {
      yearWithSnooze,
      year,
      monthWithSnooze,
      month,
      dateWithSnooze,
      date,
      hourWithSnooze,
      hour,
      minuteWithSnooze,
      minute,active
    } = values;
    
    let yearToUse = yearWithSnooze ?? year,
    monthToUse = monthWithSnooze ?? month,
    dateToUse = dateWithSnooze ?? date,
    hourToUse = hourWithSnooze ?? hour,
    minuteToUse = minuteWithSnooze ?? minute
    
    let alarmTime = new Date (yearToUse,monthToUse,dateToUse,hourToUse,minuteToUse);
    
    let diferenceTime = alarmTime.getTime() - milisecondsFromNow;
    
    if (diferenceTime < beforeDiferenceOfTime && active) {
      beforeDiferenceOfTime = diferenceTime;
      keyOfAlarmNearActived = key;
    }
  });
  
  let propsAlarmNearActived = ALARMS.get(keyOfAlarmNearActived) ?? {};
  
  beforeDiferenceOfTime = Infinity;
  
  ALARMS.entries().forEach(([key,values])=>{
    let {year,month,date,hour,minute,active} = values;
    
    let alarmTime = new Date (year,month,date,hour,minute),
    alarmTimeActived = new Date (
      propsAlarmNearActived.yearWithSnooze ?? propsAlarmNearActived.year,
      propsAlarmNearActived.monthWithSnooze ?? propsAlarmNearActived.month,
      propsAlarmNearActived.dateWithSnooze ?? propsAlarmNearActived.date,
      propsAlarmNearActived.hourWithSnooze ?? propsAlarmNearActived.hour,
      propsAlarmNearActived.minuteWithSnooze ?? propsAlarmNearActived.minute
      );
    
    let diferenceTime;
    
    if ((diferenceTime = alarmTime.getTime() - milisecondsFromNow) < beforeDiferenceOfTime && (!keyOfAlarmNearActived || alarmTime.getTime() < alarmTimeActived.getTime()) && !active) keyOfAlarmNearDesactived = key;
  });
  
  keysOfAlarmNear = [];
  
  if (keyOfAlarmNearDesactived) keysOfAlarmNear.push({key:keyOfAlarmNearDesactived,active:false})
  
  if (keyOfAlarmNearActived) keysOfAlarmNear.push({key:keyOfAlarmNearActived,active:true})
}

function getMissingHoursFromNow (dateNow,dateAlarm) {
  return (((dateAlarm.getTime() - dateNow.getTime()) / 1000) / 60) / 60;
}

function setTextDateOfAlarmApplied ({year,month,date,hour,minute}) {
  let dateNow = new Date (),
  dateAlarm = new Date (year,month,date,hour,minute);
  
  let missingHours = getMissingHoursFromNow(new Date (dateNow.getFullYear(),dateNow.getMonth(),dateNow.getDate(),dateNow.getHours(),dateNow.getMinutes()),dateAlarm);
  
  let textToShow;
  
  if (missingHours >= 24) {
    let dateToString = dateAlarm.toDateString().split(" ").slice(0,-1).join(" ");
    
    textToShow = `Alarm Set For ${formatNumber(hour === 0 ? 24 : hour)}:${formatNumber(minute)} On ${dateToString}`;
  }
  else {
    let [hour,decimals] = String(missingHours).split(".");
    
    let missingTime = hour !== "0" ? `${hour} Hour(s) And` : "";
    
    if (decimals) missingTime += ` ${Math.round(Number("0." + decimals) * 60)} Minute(s)`;
    
    textToShow = `Alarm Set For ${missingTime} From Now`;
  }
  
  showPseudoelementOfTimeAlarm(textToShow);
}

function showPseudoelementOfTimeAlarm (text) {
  setPropertyElement($APLICATION,"--opacityTextDateOfAlarm","1");
  
  setPropertyElement($APLICATION,"--textDateOfAlarm",`"${text}"`);
  
  setTimeout(()=>{
    setPropertyElement($APLICATION,"--opacityTextDateOfAlarm","0");
  },1500)
}

function setTextOfAmountAlarmSelected () {
  let amountAlarmSelected = ALARMSSELECTED.size ? `${ALARMSSELECTED.size} Selected` : "Selected Alarms";
  
  $TEXTTIMEMISSING.innerText = amountAlarmSelected;
  
  $(".container-top-aplication .text-select-alarm").innerText = amountAlarmSelected
}

function setTextOfUpcomingAlarm () {
  let {modeselectionalarmactive} = $APLICATION.dataset;
  
  if (modeselectionalarmactive) {
    setTextOfAmountAlarmSelected();
    $TEXTDATEOFALARMNEAR.innerText = "";
    return;
  }
  
  if (!keysOfAlarmNear.some(alarmNear=>alarmNear.active) || $(".container-actived-alarm")) {
    $TEXTTIMEMISSING.innerText = "Alarm"
    $TEXTDATEOFALARMNEAR.innerText = "";
    return;
  }
  
  let keyOfAlarmActive = keysOfAlarmNear.find(alarmNear=>alarmNear.active).key;
  
  let {year,yearWithSnooze,month,monthWithSnooze,date,dateWithSnooze,hour,hourWithSnooze,minute,minuteWithSnooze} = ALARMS.get(keyOfAlarmActive);
  
  let alarmNear = new Date (yearWithSnooze ?? year,monthWithSnooze ?? month,dateWithSnooze ?? date,hourWithSnooze ?? hour,minuteWithSnooze ?? minute),
  dateNow = new Date ();
  
  dateNow = new Date (dateNow.getFullYear(),dateNow.getMonth(),dateNow.getDate(),dateNow.getHours(),dateNow.getMinutes());
  
  let missingHours = getMissingHoursFromNow(dateNow,alarmNear);
  
  let textToShowInTimeMissing;
  
  if (missingHours >= 24) {
    let daysMissing = Math.floor(missingHours / 24);
    
    textToShowInTimeMissing = `Alarm In ${daysMissing} Day(s)`;
  }
  else {
    let [hour,decimals] = String(missingHours).split(".");
    
    let missingTime = hour !== "0" ? `${hour} Hour(s)` : "";
    
    if (decimals) missingTime += ` ${Math.round(Number("0." + decimals) * 60)} Minute(s)`;

    textToShowInTimeMissing = `Alarm In ${missingTime}`;
  }

  $TEXTTIMEMISSING.innerText = textToShowInTimeMissing;
  
  let dateInStringAsArray = alarmNear.toDateString().split(" ");
  
  dateInStringAsArray.pop();
  
  let hourApply = alarmNear.getHours(),
  minutesApply = alarmNear.getMinutes();
  
  $TEXTDATEOFALARMNEAR.innerText = `${dateInStringAsArray.join(" ")}, ${formatNumber(hourApply === 0 ? 24 : hourApply)}:${formatNumber(minutesApply)}`
}

function formatNumber (number) {
  return String(number).padStart(2,"0");
}

function showOrHiddeTextNoAlarms () {
  const $TEXT = $(".container-added-alarms .text-show-no-alarms");
  
  if (ALARMS.size) setPropertyElement($TEXT,"visibility","hidden");
  else setPropertyElement($TEXT,"visibility","visible");
}

function removeDaysRepeat (daysForActiveAlarm) {
  let newDaysAvaliables = [];
  daysSelected.forEach(day=>{
    if (!daysForActiveAlarm.includes(day)) newDaysAvaliables.push(day);
  })
  return newDaysAvaliables;
}

function repeatALARM (dateToApply,hour,minute,activeOnlyDaysSelected,keyAlarmModify) {
  
  for (let [key,value] of ALARMS.entries()) {
    if (keyAlarmModify === key) continue;
    
    if (activeOnlyDaysSelected && value.allDaysToApplyAlarm.length > 0 && value.hour === hour && value.minute === minute) {
      let daysAvaliablesToUseAlarm = removeDaysRepeat(value.allDaysToApplyAlarm);
      
      if (daysAvaliablesToUseAlarm.length === 0) return true;
      else daysSelected = daysAvaliablesToUseAlarm;
    }
    else if (activeOnlyDaysSelected && value.hour === hour && value.minute === minute) {
      let daysAvaliablesToUse = [],
      copyDaysSelected = [...daysSelected];
      
      for (let amountDays = 0;;amountDays++) {
        let dateCurrent = new Date();
      
        let nextDay = new Date (dateCurrent.getFullYear(),dateCurrent.getMonth(),dateCurrent.getDate() + amountDays);
      
        let [nameDay] = nextDay.toDateString().split(" ");
      
        let dayAvaliable = copyDaysSelected.find(day=>day.startsWith(nameDay));
      
        if (dayAvaliable && value.month === nextDay.getMonth() && value.date === nextDay.getDate() && value.year === nextDay.getFullYear()) {
          let indexDay = copyDaysSelected.indexOf(dayAvaliable);
          copyDaysSelected.splice(indexDay,1);
        }
        else if (dayAvaliable) {
          let indexDay = copyDaysSelected.indexOf(dayAvaliable),
          dayAccept = copyDaysSelected.splice(indexDay,1);
          
          daysAvaliablesToUse.push(dayAccept[0]);
        }
        
        if (copyDaysSelected.length === 0) break
      }
      
      if (daysAvaliablesToUse.length === 0) return true;
       else daysSelected = daysAvaliablesToUse;
    }
    else if (!activeOnlyDaysSelected && value.allDaysToApplyAlarm.length > 0 && value.hour === hour && value.minute === minute) {
      let copyDaysActiveAlarm = [...value.allDaysToApplyAlarm];
      
      for (let amountDays = 0;;amountDays++) {
        let dateCurrent = new Date();
      
        let nextDay = new Date (dateCurrent.getFullYear(),dateCurrent.getMonth(),dateCurrent.getDate() + amountDays);
      
        let [nameDay] = nextDay.toDateString().split(" ");
      
        let dayAvaliable = copyDaysActiveAlarm.find(day=>day.startsWith(nameDay));
      
        if (dayAvaliable && dateToApply.getDate() === nextDay.getDate() && dateToApply.getMonth() === nextDay.getMonth() && dateToApply.getFullYear() && nextDay.getFullYear()) return true;
        
        if (dayAvaliable) copyDaysActiveAlarm.splice(copyDaysActiveAlarm.indexOf(dayAvaliable),1);
        
        if (copyDaysActiveAlarm.length === 0) break;
      }
    }
    else if (!activeOnlyDaysSelected && value.hour === hour && value.minute === minute && dateToApply.getDate() === value.date && dateToApply.getMonth() === value.month && dateToApply.getFullYear() === value.year) return true;
  }
  
  return false;
}

function changeDateInput ({target}) {
  daysSelected = [];
  
  target.removeAttribute("data-todayfromtomorrow");
  
  $$(".container-all-days-week div.active").forEach($E=>{$E.classList.remove("active")});
}

function setDateToActiveAlarm ($ALARM) {
  const $CONTAINERDAYS = $ALARM.querySelector(".days");
  
  if (daysSelected.length > 0) {
    $CONTAINERDAYS.innerHTML = `<p class="Sunday">S<span></span></p>
    <p class="Monday">M<span></span></p>
    <p class="Tuesday">T<span></span></p>
    <p class="Wednesday">W<span></span></p>
    <p class="Thursday">T<span></span></p>
    <p class="Friday">F<span></span></p>
    <p class="Saturday">S<span></span></p>`;
    
    daysSelected.forEach(dayName=>{
    const $DAY = $CONTAINERDAYS.querySelector(`.${dayName}`);
    $DAY.classList.add("selected");
    })
  }
  else {
    const $INPUTDATE = $(".container-for-apply-alarm #set-date input");
    
    let dateForAlarm = new Date($INPUTDATE.value + "T00:00:00");
    
    let [day,month,date] = dateForAlarm.toDateString().split(" ");
    
    $CONTAINERDAYS.innerHTML = `<p class="date">${day}, ${date} ${month}</p>`;
  }
}

function activateOrDesactivateALARM ($ALARM,active) {
  const $NAME = $ALARM.querySelector(".name"),$TIME = $ALARM.querySelector(".time"),
  $DAYOFALARM = $ALARM.querySelector(".days");
  
  let $ELEMENTS = [$NAME,$DAYOFALARM,$TIME];
  for (let i = 0;i < $ELEMENTS.length;i++) {
    const $ELEMENT = $ELEMENTS[i];
    if (active) $ELEMENT.classList.remove("opacity-middle");
    else $ELEMENT.classList.add("opacity-middle");
  }
}

function clickAlarmApply ({target,currentTarget}) {
  let modeSelection = $APLICATION.getAttribute("data-modeselectionalarmactive");
  
  if (modeSelection) return;
  
  if (target.classList.contains("switch")) {
    let keyAlarm = currentTarget.id;
    
    const keyOfAlarmActive =$(".container-actived-alarm")?.dataset.keyofalarm;
    
    turnOffOnAlarm(keyAlarm,keyOfAlarmActive,!target.classList.contains("active"))
    
    console.log(keyAlarm)
    
    getKeysOfAlarmsNear();
    
    return;
  }
  
  let keyAlarm = target.id;
  
  let {allDaysToApplyAlarm,hour,minute,snoozeAlarm,soundAlarm,vibrationAlarm,name} = ALARMS.get(keyAlarm);
  
  daysSelected = allDaysToApplyAlarm;
  
  sounds.optionSelected = soundAlarm.optionSelected;
  sounds.nameOptionSelected = soundAlarm.nameOptionSelected;
  sounds.active = soundAlarm.active;
  
  vibrations.optionSelected = vibrationAlarm.optionSelected;
  vibrations.nameOptionSelected = vibrationAlarm.nameOptionSelected;
  vibrations.active = vibrationAlarm.active;
  
  snooze.minutes = snoozeAlarm.minutes;
  snooze.repeat = snoozeAlarm.repeat;
  snooze.active = snoozeAlarm.active;
  
  openContainerForSettingAlarm(hour === 0 ? 24 : hour,minute,name,keyAlarm);
}

function setValuesOfAlarmSave ($ALARM) {
  const $INPUTATE = $(".container-date-current #set-date input"),
  $INPUTNAMEALARM = $(".container-setting-sound-and-name .name-for-apply-alarm");
  
  let {hour,minute} = getTimeSelected();
  
  let alarmToSave = new Date($INPUTATE.value + "T00:00:00"),
  month = alarmToSave.getMonth(),
  year = alarmToSave.getFullYear(),
  date = alarmToSave.getDate(),
  name = $INPUTNAMEALARM.value;
  
  let dateAlarmWithTime = new Date (year,month,date,hour,minute);
  
  let snoozeAlarm = {
    minutes:snooze.minutes,
    repeat:snooze.repeat,
    active:snooze.active
  },soundAlarm = {
    optionSelected:sounds.optionSelected,
    nameOptionSelected:sounds.nameOptionSelected,
    active:sounds.active
  },vibrationAlarm = {
    optionSelected:vibrations.optionSelected
    ,nameOptionSelected:vibrations.nameOptionSelected,
    active:vibrations.active
  }
  
  let variablesALARM = {
    hour,
    minute,
    date,
    month,
    year,
    allDaysToApplyAlarm:daysSelected,
    name,
    snoozeAlarm,
    vibrationAlarm,
    soundAlarm,
    active:true
  }
  
  applyAlarmInDaysSelected(null,variablesALARM,$ALARM,dateAlarmWithTime);
  
  let {optionSelected} = sounds,
  $SOUNDSELECTED;
  
  if (($SOUNDSELECTED = sounds[optionSelected])) {
    const $CLONESOUNDSELECTED = $SOUNDSELECTED.cloneNode(true);
    
    $CLONESOUNDSELECTED.load();
    
    $CLONESOUNDSELECTED.setAttribute("loop","true");
    
    $ALARM.appendChild($CLONESOUNDSELECTED)
  }
  else {
    let $SOUND = new Audio ();
    
    $SOUND.src = `./sounds/${optionSelected}.mp3`;
    
    $SOUND.load();
    
    $SOUND.setAttribute("loop","true");
    
    $ALARM.appendChild($SOUND);
  }
}

function applyAlarmInDaysSelected (keyAlarmLast,propsAlarm,$ALARM,dateSelectedInInput) {
  let dateCurrent = new Date(),
  {hour,minute,allDaysToApplyAlarm} = propsAlarm;
  
  let newKeyAlarm;
  
  const applyDateAndKeyAlarm = (dateCorrect) => {
    let date = dateCorrect.getDate(),
    month = dateCorrect.getMonth(),
    year = dateCorrect.getFullYear();
    
    propsAlarm.date = date;
    propsAlarm.month = month;
    propsAlarm.year = year;
    
    let dateAlarm = new Date (year,month,date,hour,minute),
    keyAlarm = "alarm-" + dateAlarm.getTime();
    
    ALARMS.set(keyAlarm,propsAlarm);
    
    $ALARM.setAttribute("id",keyAlarm);
    
    return keyAlarm;
  }
  
  if (allDaysToApplyAlarm.length) {
    let [dayName] = dateCurrent.toDateString().split(" ");
    
    let hourCurrent = dateCurrent.getHours(),
    minuteCurrent = dateCurrent.getMinutes();
    
    if (allDaysToApplyAlarm.some(day=>day.startsWith(dayName)) && ((hour > hourCurrent) || (hour === hourCurrent && minute > minuteCurrent))) {
      let newKey = applyDateAndKeyAlarm(dateCurrent);
      
      changeKeyOfAlarmInSettingContainer(keyAlarmLast,newKey);
      
      return;
    }
    
    for (let amountDays = 1;;amountDays++) {
      let nextDay = new Date (dateCurrent.getFullYear(),dateCurrent.getMonth(),dateCurrent.getDate() + amountDays);
      
      let [nameDay] = nextDay.toDateString().split(" ");
      
      let dayAvaliable = allDaysToApplyAlarm.some(day=>day.startsWith(nameDay));
      
      if (dayAvaliable) {
        newKeyAlarm = applyDateAndKeyAlarm(nextDay);
        break;
      }
    }
  }
  else {
    let keyAlarm = `alarm-${dateSelectedInInput.getTime()}`;
    
    ALARMS.set(keyAlarm,propsAlarm);
  
    $ALARM.setAttribute("id",keyAlarm);
    
    newKeyAlarm = keyAlarm;
  }
  
  changeKeyOfAlarmInSettingContainer(keyAlarmLast,newKeyAlarm)
}

function showDaysSelected () {
  daysSelected.forEach(day=>{
    $(`.container-all-days-week #${day}`).classList.add("active")
  })
}

function activateOrDesactivateSwitchOptions () {
  const $SWITCH_SOUND = $(".container-all-options #sound .switch"),
  $SWITCH_VIBRATION = $(".container-all-options #vibration .switch"),
  $SWITCH_SNOOZE = $(".container-all-options #snooze .switch");
  
  if (sounds.active) $SWITCH_SOUND.classList.add("active");
  
  if (vibrations.active) $SWITCH_VIBRATION.classList.add("active");
  
  if (snooze.active) $SWITCH_SNOOZE.classList.add("active");
  
  setNameOptionSelected("sound");
  setNameOptionSelected("vibration");
  setNameOptionSelected("snooze");
}

function setOrRemoveEventClickContainerOptions (method,$containers,functionToCall) {
  $containers.forEach($CONTAINEROPTION=>{
    if (method === "set") $CONTAINEROPTION.onclick = functionToCall;
    else $CONTAINEROPTION.onclick = null;
  })
}

function showContainerWithAnimation ($CONTAINER) {
  setTimeout(function(){
    setPropertyElement($CONTAINER,"top","0px");
  },0)
}

function clickOptionInSettingAlarm ({currentTarget,target}) {
  let id = target.id;
  
  let classListTarget = target.classList;
  
  if (classListTarget.contains("container-switch")) return;
  
  if (classListTarget.contains("switch")) {
    let {option} = target.dataset;
    
    target.classList.toggle("active");
    
    let objectToChange;
    
    if (option === "sound") objectToChange = sounds;
    else if (option === "vibration") objectToChange = vibrations;
    else if (option === "snooze") objectToChange = snooze;
    
    objectToChange.active = classListTarget.contains("active");
    
    setNameOptionSelected(option)
    
    return;
  }
  
  let htmlInsert,functionToCall;
  
  if (id === "vibration") {
    htmlInsert = htmlContainerOptionsVibration;
    functionToCall = clickOptionVibration;
  }
  else if (id === "sound") {
    htmlInsert = htmlContainerOptionsSounds;
    functionToCall = clickOptionSound;
  }
  else if (id === "snooze") {
    htmlInsert = htmlContainerOptionsSnooze;
    functionToCall = clickOptionSnooze;
  }
  
  $APLICATION.insertAdjacentHTML("beforeend",htmlInsert);
  
  $APLICATION.onclick = null;
  
  setOrRemoveEventClickContainerOptions("remove",$$(".container-all-options > div"));
  
  setOrRemoveEventClickContainerOptions("remove",[$(".container-all-days-week")]);
  
  const $CONTAINERMAINOPTION = $(".container-main-of-option");
  
  if (id === "sound") preLoadSoundsDefault();
  
  //ACTIVAMOS EL CIRCLE FILL PARA SABER LA OPCION ACTUAL SELECCIONADA
  
  if (id === "snooze") {
    let $OPTIONMINUTE = $CONTAINERMAINOPTION.querySelector(`.container-option#minutes-${snooze.minutes}`),
    $OPTIONREPEAT = $CONTAINERMAINOPTION.querySelector(`.container-option#repeat-${snooze.repeat}`);
    
    if (!$OPTIONMINUTE) {
      $CONTAINERMAINOPTION.querySelector(".container-options").insertAdjacentHTML("beforeend",htmlCustomMinutesSnooze);
      
      const $INPUTCUSTOMMINUTES = $CONTAINERMAINOPTION.querySelector(".container-custom-time-snooze input");
      
      $INPUTCUSTOMMINUTES.value = snooze.minutes;
      
      writingMinutesSnooze({target:$INPUTCUSTOMMINUTES});
      
      $INPUTCUSTOMMINUTES.oninput = writingMinutesSnooze;
      
      $OPTIONMINUTE = $CONTAINERMAINOPTION.querySelector(".container-option#minutes-custom");
    }
    
    selectNewOption($OPTIONMINUTE.parentElement,$OPTIONMINUTE);
    selectNewOption($OPTIONREPEAT.parentElement,$OPTIONREPEAT);
  }
  else {
    let ID = id === "sound" ? sounds.optionSelected : vibrations.optionSelected;
    
    const $OPTION = $CONTAINERMAINOPTION.querySelector(`.container-option#${ID}`);
    
    selectNewOption($OPTION.parentElement,$OPTION);
  }
  
  const $BUTTONBACK = $CONTAINERMAINOPTION.querySelector(".container-top #back");
  
  showContainerWithAnimation($CONTAINERMAINOPTION);
  
  $CONTAINERMAINOPTION.ontransitionend = () => {
    const $CONTAINEROPTIONS = $CONTAINERMAINOPTION.querySelectorAll(".container-options");
  
    $CONTAINEROPTIONS.forEach($E=>{
      $E.onclick = functionToCall;
    })
    
    $BUTTONBACK.onclick = ()=>{
      $CONTAINEROPTIONS.forEach($E=>{
        $E.onclick = null;
      })
      
      $BUTTONBACK.onclick = null;
      
      $CONTAINERMAINOPTION.ontransitionend = ()=>{
        $APLICATION.onclick = clickAplication
        $CONTAINERMAINOPTION.remove();
        
        setOrRemoveEventClickContainerOptions("set",$$(".container-all-options > div"),clickOptionInSettingAlarm);
        setOrRemoveEventClickContainerOptions("set",[$(".container-all-days-week")],clickDayOfWeek);
      }
      
      setPropertyElement($CONTAINERMAINOPTION,"top","100%");
      
      setNameOptionSelected(id)
    };
  }
}

function setNameOptionSelected (option) {
  if (option === "sound") {
    let {optionSelected,nameOptionSelected,active} = sounds;
    
    sounds[optionSelected]?.pause();
    
    $(".container-all-options #sound .text-selection").innerText = active ? nameOptionSelected : "Off";
  }
  else if (option === "vibration") {
    navigator.vibrate([]);
    
    let {optionSelected,nameOptionSelected,active} = vibrations;
    
    $(".container-all-options #vibration .text-selection").innerText = active ? nameOptionSelected : "Off";
  }
  else {
    let {minutes,repeat,active} = snooze;
    
    const $CONTAINEROPTIONSCATEGORY = $(".container-all-options");
    
    $CONTAINEROPTIONSCATEGORY.querySelector("#snooze .text-selection").innerText = active ? `${minutes} Minutes , ${repeat === "forever" ? "Forever" : repeat + " Times"}` : "Off";
  }
}

function setTextWithallDaysOfWeekSelected () {
  const $TEXTDAYALARM = $(".container-date-current .text-day-alarm");
  
  let daysConcat = daysSelected.map(day=>{
    return day.substring(0,3);
  }).join(", ");
  
  $TEXTDAYALARM.innerText = "Every" +`${daysSelected.length === 7 ? " Days" : ` ${daysConcat}`}`;
}

function textWithDaysSelected () {
  const $DAYSSELECTED = $$(".container-all-days-week div.active");
  
  daysSelected = [];
  
  $DAYSSELECTED.forEach($DAY=>{
    let day = $DAY.id;
    daysSelected.push(day);
  })
  
  if ($DAYSSELECTED.length > 0) setTextWithallDaysOfWeekSelected();
}

function clickDayOfWeek ({target}) {
  target.classList.toggle("active");
  textWithDaysSelected();
}

function preLoadSoundsDefault () {
  $$(".container-main-of-option .container-options .container-option").forEach(({id})=>{
    sounds[id] = new Audio ();
    sounds[id].src = `./sounds/${id}.mp3`;
  })
}

function writingMinutesSnooze ({target}) {
  let valueInputAsString = target.value,
  valueInputAsNumber = Number(target.value);
  
  if (valueInputAsString.length > 2 || valueInputAsNumber > 60) {
    target.value = valueInputAsString.slice(0,-1);
    valueInputAsNumber = Number(target.value);
  }
  
  let textOfMinute = valueInputAsNumber > 1 ? "Minutes" : "Minute";
  
  $(".container-custom-time-snooze p.text-minutes-custom").innerText = textOfMinute;
  
  snooze["minutes"] = valueInputAsNumber === 0 ? 5 : valueInputAsNumber;
}

function clickOptionSnooze ({target,currentTarget}) {
  let [typeValue,value] = target.id.split("-");
  
  let listClassTarget = target.classList;
  
  if (listClassTarget.contains("container-custom-time-snooze") || target.nodeName === "INPUT" || listClassTarget.contains("text-minutes-custom") || (value === "custom" && $(".container-custom-time-snooze"))) return;
  
  if (typeValue === "minutes") $(".container-custom-time-snooze")?.remove();
  
  if (value === "custom") {
    currentTarget.insertAdjacentHTML("beforeend",htmlCustomMinutesSnooze);
    
    snooze["minutes"] = 5;
    
    $(".container-custom-time-snooze input").oninput = writingMinutesSnooze;
  }
  else snooze[typeValue] = value === "forever" ? value : Number(value);
  
  selectNewOption(currentTarget,target)
}

function clickOptionVibration ({target,currentTarget}) {
  let typeVibration = vibrations[target.id];
  
  navigator.vibrate(typeVibration);
  
  vibrations.optionSelected = target.id;
  vibrations.nameOptionSelected = target.querySelector(".container-name-option p").innerText;
  
  selectNewOption(currentTarget,target);
}

function clickOptionSound ({target,currentTarget}) {
  let srcSound = target.id,
  srcAudioBefore = currentTarget.dataset.srcaudio;
  
  const $AUDIO = sounds[srcSound],
  $AUDIOBEFORE = sounds[srcAudioBefore];
  
  if ($AUDIOBEFORE) $AUDIOBEFORE.pause();
  
  $AUDIO.currentTime = 0;
  $AUDIO.play();
  
  currentTarget.setAttribute("data-srcaudio",srcSound);
  
  sounds.optionSelected = srcSound;
  sounds.nameOptionSelected = target.querySelector(".container-name-option p").innerText;
  
  selectNewOption(currentTarget,target)
}

function selectNewOption ($containerOptions,$option) {
  $containerOptions.querySelector(".circle.active")?.classList.remove("active");
  
  $option.querySelector(".circle").classList.add("active");
}

function scrollEndContainerNumbersTime ({currentTarget}) {
  let {scrollTop} = currentTarget;
  
  let {scrollendwithanimation} = currentTarget.dataset;
  
  console.log("scrollEnd lansado")
  
  if (!scrollendwithanimation) {
    let amountSquareMoving = Math.round(scrollTop / 90);
    
    let topScrollApply = amountSquareMoving * 90;
    
    currentTarget.scrollTo({
      behavior:"smooth",
      top:topScrollApply
    })
    
    if (currentTarget.classList.contains("container-hours")) {
      let numberByScroll = amountSquareMoving + 2;
      
      let hour = numberByScroll > 24 ? numberByScroll - 24 : numberByScroll;
      
      currentTarget.setAttribute("data-establishednumber",hour);
    }
    else {
      let numberByScroll = amountSquareMoving + 1;
      
      let minute = numberByScroll >= 60 ? numberByScroll - 60 : numberByScroll;
      
      currentTarget.setAttribute("data-establishednumber",minute);
    }
  }
  
  currentTarget.setAttribute("data-scrollendwithanimation","true");
  
  $(".container-for-apply-alarm").removeAttribute("data-timealarm");
}

function pulseContainerNumbersOfTime (e) {
  let eventType = e.type;
  
  const {currentTarget} = e;
  
  //ESTO SE EJECUTARA CUANDO EL USUARIO ESTE UN ORDENADOR Y PRESIONE EL BOTON CENTRAL DE EL MAUSE (CIRCULO) EVITAMOS EL SCROLL AUTOMATICO
  
  if (e.button === 1) {
    e.preventDefault();
    return;
  }
  
  if (eventType === "touchstart" || eventType === "mousedown") {
    currentTarget.classList.add("active");
    
    if (currentTarget.dataset.scrollendwithanimation) {
      currentTarget.scrollTo({
        behavior:"auto",
        top:currentTarget.scrollTop
      })
      
      currentTarget.removeAttribute("data-scrollendwithanimation");
    }
    
  }
  else if (eventType === "touchend" || eventType === "mouseup") {
    currentTarget.classList.remove("active");
    currentTarget.removeAttribute("data-scrollendwithanimation");
  }
}

function updateTime () {
  setTimeout(()=>{
    const $INPUTDATE = $(".container-for-apply-alarm #set-date input");
    
    if ($INPUTDATE) updateDateAlarm();
    
    callUpdateTimeInGeneral = true;
    
    setTextOfUpcomingAlarm();
    
    activateAlarm()
    
    updateTime();
  },500)
}

function deleteSecondaryVariablesOfAlarm (propsOfAlarm,keyAlarm) {
  delete propsOfAlarm.idIntervalVibration;
  if (keyAlarm.includes("snooze")) {
    delete propsOfAlarm.yearWithSnooze;
    delete propsOfAlarm.monthWithSnooze;
    delete propsOfAlarm.dateWithSnooze;
    delete propsOfAlarm.hourWithSnooze;
    delete propsOfAlarm.minuteWithSnooze;
    delete propsOfAlarm.snoozeAlarm.timesActivated;
  }
}

function applyAlarmForNextDate (key) {
  let propsOfAlarm = ALARMS.get(key),
  {year,month,date,hour,minute} = propsOfAlarm;
  
  ALARMS.delete(key);
  
  deleteSecondaryVariablesOfAlarm(propsOfAlarm,key);
  
  let onlyDaysSelectedActiveAlarm = propsOfAlarm.allDaysToApplyAlarm.length;
  
  const $ALARM = $(`.container-added-alarms .container-alarm-apply#${key}`);
  
  if (onlyDaysSelectedActiveAlarm) applyAlarmInDaysSelected(key,propsOfAlarm,$ALARM,new Date (year,month,date,hour,minute));
  else {
    let newDateForApply = getDateNextAvaliableForAlarm(year,month,date,hour,minute);
    
    propsOfAlarm.date = newDateForApply.getDate();
    propsOfAlarm.month = newDateForApply.getMonth();
    propsOfAlarm.year = newDateForApply.getFullYear();
    
    let [day,monthString,dateString] = newDateForApply.toDateString().split(" ");
    
    $ALARM.querySelector(".days p").innerText = `${day}, ${dateString} ${monthString}`;
    
    applyAlarmInDaysSelected(key,propsOfAlarm,$ALARM,newDateForApply);
  }
}

function getTimeForRepeatVibration (typeOfVibration) {
  let timesInMiliseconds = vibrations[typeOfVibration];
  
  //1000 en un segundo de pausa despues de que el patron de la vibracion termine
  
  return timesInMiliseconds.reduce((a,b)=>{
    return a + b
  },1000);
}

function stopVibrationCurrent (propsAlarmActivate) {
  clearInterval(propsAlarmActivate.idIntervalVibration);
  navigator.vibrate(0);
}

function activateAlarm () {
  let timeNow = new Date();
  
  keysOfAlarmNear.forEach(({key,active})=>{
    let {
    hour,
    hourWithSnooze,
    minuteWithSnooze,
    minute,
    month,
    monthWithSnooze,
    date,
    dateWithSnooze,
    year,
    yearWithSnooze,
    starTimeAlarm} = ALARMS.get(key);
    
    let activedAlarm = (hourWithSnooze ?? hour) === timeNow.getHours() && (minuteWithSnooze ?? minute) === timeNow.getMinutes() && (dateWithSnooze ?? date) === timeNow.getDate() && (monthWithSnooze ?? month) === timeNow.getMonth() && (yearWithSnooze ?? year) === timeNow.getFullYear();
    
    if (starTimeAlarm && (Date.now() - starTimeAlarm) >= 55000) {
      deleteTimeStartAlarm(key);
      pauseSoundAlarmActive(key);
      stopVibrationCurrent(ALARMS.get(key));
      hideModalOfAlarmActivated();
      
      if ($(".container-actived-alarm button#snooze-alarm")) snoozeAlarm(key);
      else {
        deactivateALARM($(`.container-alarm-apply#${key}`),key,ALARMS.get(key));
        applyAlarmForNextDate(key);
      }
      
      getKeysOfAlarmsNear();
    }
    else if (!starTimeAlarm && activedAlarm && active) {
      let [correctHour,correctMinute] = key.includes("snooze") ? [hourWithSnooze,minuteWithSnooze] : [hour,minute];
      
      const HTMLCONTAINER = createHtmlToAcivateAlarm(formatNumber(correctHour === 0 ? 24 : correctHour),formatNumber(correctMinute));
      
      const {snoozeAlarm,soundAlarm,vibrationAlarm,allDaysToApplyAlarm} = ALARMS.get(key);
      
      $APLICATION.insertAdjacentHTML("beforeend",HTMLCONTAINER);
      
      const $CONTAINERSHOWALARMACTIVATED = $(".container-aplication .container-actived-alarm");
      
      let heightContainer = $CONTAINERSHOWALARMACTIVATED.getBoundingClientRect().height;
      
      $CONTAINERSHOWALARMACTIVATED.onclick = clickModalAlarmActivated;
      
      setTimeout(()=>{
        setPropertyElement($CONTAINERSHOWALARMACTIVATED,"bottom",`calc(100% - ${heightContainer}px - 10px)`);
      },0);
      
      let propsAlarmNearActive = ALARMS.get(key);
      
      propsAlarmNearActive.starTimeAlarm = Date.now();
      
      $CONTAINERSHOWALARMACTIVATED.setAttribute("data-keyofalarm",key)
      
      let {active} = propsAlarmNearActive.snoozeAlarm;
      
      if (!active || snoozeAlarm.timesActivated >= snoozeAlarm.repeat || allDaysToApplyAlarm.length) $CONTAINERSHOWALARMACTIVATED.querySelector("#snooze-alarm").remove();
      
      if (soundAlarm.active) {
        const $AUDIO = $(`.container-alarm-apply#${key} audio`);
        
        $AUDIO.currentTime = 0;
        
        $AUDIO.play();
      }
      
      if (vibrationAlarm.active) {
        let patternVibration = vibrations[vibrationAlarm.optionSelected];
        
        navigator.vibrate(patternVibration);
        
        propsAlarmNearActive.idIntervalVibration = setInterval(function() {
          navigator.vibrate(patternVibration);
        },getTimeForRepeatVibration(vibrationAlarm.optionSelected));
      }
    }
    else if (!starTimeAlarm && activedAlarm) {
      applyAlarmForNextDate(key);
      getKeysOfAlarmsNear();
    }
  })
}

function deleteTimeStartAlarm (keyOfAlarmActivated) {
  let variablesAlarm = ALARMS.get(keyOfAlarmActivated)
  
  delete variablesAlarm.starTimeAlarm;
}

function pauseSoundAlarmActive (keyOfAlarmActivated) {
  $(`.container-alarm-apply#${keyOfAlarmActivated} audio`).pause();
}

function clickModalAlarmActivated ({target,currentTarget}) {
  let BUTTON = target.id,
  keyOfAlarmActivated = currentTarget.getAttribute("data-keyofalarm");
  
  let propsAlarm = ALARMS.get(keyOfAlarmActivated)
  
  if (BUTTON === "deactivate-alarm") {
    deleteTimeStartAlarm(keyOfAlarmActivated);
    pauseSoundAlarmActive(keyOfAlarmActivated);
    stopVibrationCurrent(propsAlarm);
    hideModalOfAlarmActivated();
    
    deactivateALARM($(`.container-alarm-apply#${keyOfAlarmActivated}`),keyOfAlarmActivated,ALARMS.get(keyOfAlarmActivated));
    applyAlarmForNextDate(keyOfAlarmActivated);
    getKeysOfAlarmsNear();
  }
  else if (BUTTON === "snooze-alarm") {
    deleteTimeStartAlarm(keyOfAlarmActivated);
    pauseSoundAlarmActive(keyOfAlarmActivated);
    stopVibrationCurrent(propsAlarm);
    hideModalOfAlarmActivated();
    
    snoozeAlarm(keyOfAlarmActivated);
    getKeysOfAlarmsNear();
  }
}

function setTextSnoozeAlarm (keyAlarm,text) {
  const $PARAGRAPH = $(`.container-alarm-apply#${keyAlarm} .snooze-time`);
  
  $PARAGRAPH.innerText = text;
}

function deactivateALARM ($ALARM,keyAlarm,variablesOfAlarm) {
  setTextSnoozeAlarm(keyAlarm,"");
  
  activateOrDesactivateALARM($ALARM,false)
  
  $ALARM.querySelector(".switch").classList.remove("active");
  
  variablesOfAlarm.active = false;
}

function snoozeAlarm (keyAlarm) {
  let variablesOfAlarm = ALARMS.get(keyAlarm);
  
  let {minutes,timesActivated} = variablesOfAlarm.snoozeAlarm,
  {year,month,date,hour,yearWithSnooze,monthWithSnooze,dateWithSnooze,hourWithSnooze,minuteWithSnooze} = variablesOfAlarm;
  
  if (!timesActivated) variablesOfAlarm.snoozeAlarm.timesActivated = 1;
  else variablesOfAlarm.snoozeAlarm.timesActivated += 1;
  
  let newTimeToAwait = new Date (yearWithSnooze ?? year,
    monthWithSnooze ?? month,
    dateWithSnooze ?? date,
    hourWithSnooze ?? hour,
    (minuteWithSnooze ?? variablesOfAlarm.minute) + minutes);
  
  let existingAlarm = repeatALARM(newTimeToAwait,newTimeToAwait.getHours(),newTimeToAwait.getMinutes());
  
  const $ALARM = $(`.container-added-alarms .container-alarm-apply#${keyAlarm}`)
  
  if (existingAlarm) {
    deactivateALARM($ALARM,keyAlarm,variablesOfAlarm);
    applyAlarmForNextDate(keyAlarm);
    return;
  }
  
  let hourToApply = newTimeToAwait.getHours(),minutesToApply = newTimeToAwait.getMinutes();
  
  setTextSnoozeAlarm(keyAlarm,`Snooze ${formatNumber(hourToApply === 0 ? 24 : hourToApply)}:${formatNumber(minutesToApply)}`);
  
  ALARMS.delete(keyAlarm);
  
  variablesOfAlarm.yearWithSnooze = newTimeToAwait.getFullYear();
  variablesOfAlarm.monthWithSnooze = newTimeToAwait.getMonth();
  variablesOfAlarm.dateWithSnooze = newTimeToAwait.getDate();
  variablesOfAlarm.hourWithSnooze = newTimeToAwait.getHours();
  variablesOfAlarm.minuteWithSnooze = newTimeToAwait.getMinutes();
  
  let newKeyAlarm = "alarm-snooze-" + newTimeToAwait.getTime();
  
  $ALARM.setAttribute("id",newKeyAlarm);
  
  ALARMS.set(newKeyAlarm,variablesOfAlarm);
  
  const {modeselectionalarmactive} = $APLICATION.dataset;
  
  if (modeselectionalarmactive && $ALARM.querySelector(".container-circle-select").classList.contains("active")) {
    ALARMSSELECTED.delete(keyAlarm);
    ALARMSSELECTED.set(newKeyAlarm,variablesOfAlarm.active);
  }
  
  changeKeyOfAlarmInSettingContainer(keyAlarm,newKeyAlarm);
}

function changeKeyOfAlarmInSettingContainer (keyLast,newKey) {
  const $CONTAINERFORAPPLYALARM = $(".container-for-apply-alarm");
  
  if (keyLast === $CONTAINERFORAPPLYALARM?.dataset.alarmtomodify) $CONTAINERFORAPPLYALARM.setAttribute("data-alarmtomodify",newKey);
}

function getTimeWithSnooze (hour,minute,minutesToAdd) {
  if (minute + minutesToAdd < 60) return {minute:minute + minutesToAdd,hour}
  
  let minutesWithSnooze = (minute + minutesToAdd);
  
  let hoursToAdd = Math.floor(minutesWithSnooze / 60);
  
  let newHourForAlarm = (hour + hoursToAdd) % 24;
  
  return {hour:newHourForAlarm,minute:minutesWithSnooze - (hoursToAdd * 60)}
}

function hideModalOfAlarmActivated () {
  const $MINIMODAL = $(".container-actived-alarm");
  
  $MINIMODAL.ontransitionend = () => {
    $MINIMODAL.remove()
  }
  
  setPropertyElement($MINIMODAL,"bottom","101%");
}

function getDateNextAvaliableForAlarm (year,month,date,hour,minute) {
  let dateNowMilisecond = Date.now();
  for (let daysAdd = 1;;daysAdd++) {
    let nextDate = new Date (year,month,date + daysAdd,hour,minute);
    if (nextDate.getTime() > dateNowMilisecond && !repeatALARM(nextDate,hour,minute)) return nextDate;
  }
}