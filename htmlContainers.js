export const htmlNumbersHour = `<div  data-hour="1">
    <p>1</p>
          </div>
          <div  data-hour="2">
            <p>2</p>
          </div>
          <div  data-hour="3">
            <p>3</p>
          </div>
          <div  data-hour="4">
            <p>4</p>
          </div>
          <div  data-hour="5">
            <p>5</p>
          </div>
          <div  data-hour="6">
            <p>6</p>
          </div>
          <div  data-hour="7">
            <p>7</p>
          </div>
          <div  data-hour="8">
            <p>8</p>
          </div>
          <div  data-hour="9">
            <p>9</p>
          </div>
          <div  data-hour="10">
            <p>10</p>
          </div>
          <div  data-hour="11">
            <p>11</p>
          </div>
          <div  data-hour="12">
            <p>12</p>
          </div>
          <div  data-hour="13">
            <p>13</p>
          </div>
          <div  data-hour="14">
            <p>14</p>
          </div>
          <div  data-hour="15">
            <p>15</p>
          </div>
          <div  data-hour="16">
            <p>16</p>
          </div>
          <div  data-hour="17">
            <p>17</p>
          </div>
          <div  data-hour="18">
            <p>18</p>
          </div>
          <div  data-hour="19">
            <p>19</p>
          </div>
          <div  data-hour="20">
            <p>20</p>
          </div>
          <div  data-hour="21">
            <p>21</p>
          </div>
          <div  data-hour="22">
            <p>22</p>
          </div>
          <div  data-hour="23">
            <p>23</p>
          </div>
          <div  data-hour="24">
            <p>24</p>
          </div>`;
export const htmlNumbersMinutes = `<div data-minute="0"><p>00</p></div><div data-minute="1"><p>01</p></div><div data-minute="2"><p>02</p></div><div data-minute="3"><p>03</p></div><div data-minute="4"><p>04</p></div><div data-minute="5"><p>05</p></div><div data-minute="6"><p>06</p></div><div data-minute="7"><p>07</p></div><div data-minute="8"><p>08</p></div><div data-minute="9"><p>09</p></div><div data-minute="10"><p>10</p></div><div data-minute="11"><p>11</p></div><div data-minute="12"><p>12</p></div><div data-minute="13"><p>13</p></div><div data-minute="14"><p>14</p></div><div data-minute="15"><p>15</p></div><div data-minute="16"><p>16</p></div><div data-minute="17"><p>17</p></div><div data-minute="18"><p>18</p></div><div data-minute="19"><p>19</p></div><div data-minute="20"><p>20</p></div><div data-minute="21"><p>21</p></div><div data-minute="22"><p>22</p></div><div data-minute="23"><p>23</p></div><div data-minute="24"><p>24</p></div><div data-minute="25"><p>25</p></div><div data-minute="26"><p>26</p></div><div data-minute="27"><p>27</p></div><div data-minute="28"><p>28</p></div><div data-minute="29"><p>29</p></div><div data-minute="30"><p>30</p></div><div data-minute="31"><p>31</p></div><div data-minute="32"><p>32</p></div><div data-minute="33"><p>33</p></div><div data-minute="34"><p>34</p></div><div data-minute="35"><p>35</p></div><div data-minute="36"><p>36</p></div><div data-minute="37"><p>37</p></div><div data-minute="38"><p>38</p></div><div data-minute="39"><p>39</p></div><div data-minute="40"><p>40</p></div><div data-minute="41"><p>41</p></div><div data-minute="42"><p>42</p></div><div data-minute="43"><p>43</p></div><div data-minute="44"><p>44</p></div><div data-minute="45"><p>45</p></div><div data-minute="46"><p>46</p></div><div data-minute="47"><p>47</p></div><div data-minute="48"><p>48</p></div><div data-minute="49"><p>49</p></div><div data-minute="50"><p>50</p></div><div data-minute="51"><p>51</p></div><div data-minute="52"><p>52</p></div><div data-minute="53"><p>53</p></div><div data-minute="54"><p>54</p></div><div data-minute="55"><p>55</p></div><div data-minute="56"><p>56</p></div><div data-minute="57"><p>57</p></div><div data-minute="58"><p>58</p></div><div data-minute="59"><p>59</p></div>`;
export const htmlContainerForApplyNewAlarms = `<article class="container-for-apply-alarm">
      <div class="container-numbers">
        <div class="container-hours">
          ${htmlNumbersHour}
        </div>
        <p>:</p>
        <div class="container-minutes">
          ${htmlNumbersMinutes}
        </div>
      </div>
      <div class="container-setting-alarm">
        <div class="container-date-setting">
          <div class="container-date-current">
            <p class="text-day-alarm"></p>
            <button class="icon-calendar" id="set-date">
              <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g>
                <path d="M8 4H7.2002C6.08009 4 5.51962 4 5.0918 4.21799C4.71547 4.40973 4.40973 4.71547 4.21799 5.0918C4 5.51962 4 6.08009 4 7.2002V8M8 4H16M8 4V2M16 4H16.8002C17.9203 4 18.4796 4 18.9074 4.21799C19.2837 4.40973 19.5905 4.71547 19.7822 5.0918C20 5.5192 20 6.07899 20 7.19691V8M16 4V2M4 8V16.8002C4 17.9203 4 18.4801 4.21799 18.9079C4.40973 19.2842 4.71547 19.5905 5.0918 19.7822C5.5192 20 6.07899 20 7.19691 20H16.8031C17.921 20 18.48 20 18.9074 19.7822C19.2837 19.5905 19.5905 19.2842 19.7822 18.9079C20 18.4805 20 17.9215 20 16.8036V8M4 8H20M16 16H16.002L16.002 16.002L16 16.002V16ZM12 16H12.002L12.002 16.002L12 16.002V16ZM8 16H8.002L8.00195 16.002L8 16.002V16ZM16.002 12V12.002L16 12.002V12H16.002ZM12 12H12.002L12.002 12.002L12 12.002V12ZM8 12H8.002L8.00195 12.002L8 12.002V12Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                </svg>
              <input type="date" style="position:absolute;opacity:0;pointer-events:none;left:0;top:0">
            </button>
          </div>
          <div class="container-all-days-week">
            <div id="Sunday">
              <p class="sunday">S</p>
            </div>
            <div id="Monday">
              <p>M</p>
            </div>
            <div id="Tuesday">
              <p>T</p>
            </div>
            <div id="Wednesday">
              <p>W</p>
            </div>
            <div id="Thursday">
              <p>T</p>
            </div>
            <div id="Friday">
              <p>F</p>
            </div>
            <div id="Saturday">
              <p>S</p>
            </div>
          </div>
        </div>
        <div class="container-setting-sound-and-name">
          <input type="text" class="name-for-apply-alarm" placeholder="Alarm Name">
          <div class="container-all-options">
            <div class="container-sound" id="sound">
            <div class="container-text-option">
              <p class="text-option">Alarm Sound</p>
              <p class="text-selection">Off</p>
            </div>
            <div class="container-switch">
              <div class="line"></div>
              <div class="switch" data-option="sound">
                <div class="circle-switch"></div>
              </div>
            </div>
          </div>
            <div class="container-vibration" id="vibration">
            <div class="container-text-option">
              <p class="text-option">Vibration</p>
              <p class="text-selection">Off</p>
            </div>
            <div class="container-switch">
              <div class="line"></div>
              <div class="switch" data-option="vibration">
                <div class="circle-switch"></div>
              </div>
            </div>
          </div>
            <div class="container-snooze" id="snooze">
            <div class="container-text-option">
              <p class="text-option">Snooze</p>
              <p class="text-selection">Off</p>
            </div>
            <div class="container-switch">
              <div class="line"></div>
              <div class="switch" data-option="snooze">
                <div class="circle-switch"></div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
      <div class="container-button-execute-action">
        <button id="close-container-setting-alarm-for-apply">Cancel</button>
        <button id="save-alarm">Save</button>
      </div>
    </article>`;
    
export const htmlContainerOptionsVibration = generateHTMLOptions(htmlOptionsDefaultInVibration,"Vibration");

export const htmlContainerOptionsSounds = generateHTMLOptions(htmlOptionsDefaultInSounds,"Sounds");

export const htmlContainerOptionsSnooze = `<div class="container-main-of-option">
  <div class="container-top">
    <button id="back">
      <svg width="25" height="25" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z" /></svg>
    </button>
    <p>Snooze</p>
  </div>
  <div class="container-options">${htmlOptionsSnoozeMinutes()}</div>
  <div class="container-options">${htmlOptionsSnoozeRepeat()}</div>
  </div>`;

function generateHTMLOptions (options,nameOption) {
  return `<div class="container-main-of-option">
  <div class="container-top">
    <button id="back">
      <svg width="25" height="25" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z" /></svg>
    </button>
    <p>${nameOption}</p>
  </div>
  <div class="container-options">${options()}</div>
  </div>`;
}

function htmlOptionsSnoozeRepeat () {
  let htmlToReturn = "";
  
  [["repeat-2","2 Times"],["repeat-5","5 Times"],["repeat-forever","Forever"]].forEach(([id,textOption])=>{
    htmlToReturn += createOption(id,textOption);
  })
  
  return htmlToReturn;
}

function htmlOptionsSnoozeMinutes () {
  let htmlToReturn = "";
  
  [["minutes-5","5 Minutes"],["minutes-10","10 Minutes"],["minutes-15","15 Minutes"],["minutes-30","30 Minutes"],["minutes-custom","Custom Time"]].forEach(([id,textOption])=>{
    htmlToReturn += createOption(id,textOption);
  })
  
  return htmlToReturn;
}

function htmlOptionsDefaultInVibration () {
  let htmlToReturn = "";
  
  [["basic-call","Basic Call"],["heartbeat","Heartbeat"],["ticktock","Ticktock"],["waltz","Waltz"],["zig-zig-zig","Zig-zig-zig"]].forEach(([id,textOption])=>{
    htmlToReturn += createOption(id,textOption);
  })
  
  return htmlToReturn;
}

function htmlOptionsDefaultInSounds () {
  let htmlToReturn = "";
  
  [["sound1","Sound 1"],["sound2","Sound 2"],["sound3","Sound 3"],["sound4","Sound 4"],["sound5","Sound 5"]].forEach(([id,textOption])=>{
    htmlToReturn += createOption(id,textOption);
  })
  
  return htmlToReturn;
}

function createOption (idOption,textOption) {
  return `<div class="container-option" id="${idOption}">
      <div class="circle">
        <span class="fill"></span>
      </div>
      <div class="container-name-option">
        <p>${textOption}</p>
      </div>
    </div>`
}

export function crateContainerOfNewAlarm (name,hour,minute) {
  return `<div class="container-alarm-apply">
    <div class="container-name">
      <p class="name">${name}</p>
      <p class="snooze-time"></p>
    </div>
    <div class="container-circle-select">
      <img src="./iconsSVG/check-circle-svgrepo-com.svg" alt="check-circle" />
    </div>
    <div class="center-container">
      <p class="time">${hour}:${minute}</p>
      <div class="container-days-and-switch">
        <div class="days">
        </div>
        <div class="switch active">
        <div class="circle-switch"></div>
        </div>
      </div>
    </div>
  </div>`
}

export const createHtmlToAcivateAlarm = (hour,minute) => {
  return `<div class="container-actived-alarm">
    <div class="container-icon-paragraph">
      <svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 3L2 6M22 6L19 3M6 19L4 21M18 19L20 21M12 9V13L14 15M12 21C14.1217 21 16.1566 20.1571 17.6569 18.6569C19.1571 17.1566 20 15.1217 20 13C20 10.8783 19.1571 8.84344 17.6569 7.34315C16.1566 5.84285 14.1217 5 12 5C9.87827 5 7.84344 5.84285 6.34315 7.34315C4.84285 8.84344 4 10.8783 4 13C4 15.1217 4.84285 17.1566 6.34315 18.6569C7.84344 20.1571 9.87827 21 12 21Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p>Alarm</p>
    </div>
    <p class="hour-minute">${hour}:${minute}</p>
    <div class="container-buttons-action">
      <button id="deactivate-alarm">Deactivate</button>
      <button id="snooze-alarm">Snooze</button>
    </div>
  </div>`
}

export const htmlCustomMinutesSnooze = `<div class="container-custom-time-snooze">
  <input type="number" placeholder="Tap" onpaste="return false">
  <p class="text-minutes-custom">Minute</p>
</div>`


export const htmlButtonsOfModeSelectingAlarms = `<div class="container-buttons-mode-selection-alarms">
  <div class="container-circle-select-all-alarm">
    <div class="container-circle-select" id="select-all-alarms">
      <img src="./iconsSVG/check-circle-svgrepo-com.svg" alt="check-circle" />
    </div>
    <p class="text-all">All</p>
    <p class="text-select-alarm"></p>
  </div>
  <button id="out-of-select-alarm">
    <svg width="25" height="25" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z" /></svg>
  </button>
</div>`

export const htmlContainerButtonsTurnOnOfAlarm = `
<div class="container-buttons-turn-off-on-alarm">
  <button id="turn-on">
    <svg width="25" height="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <g>
    <g>
    <path d="M20.352,8.213a2.017,2.017,0,0,0,0-2.851L18.9,3.9a2.038,2.038,0,0,0-2.86,0l-.67.659A8.238,8.238,0,0,0,12,3.852a8.332,8.332,0,0,0-3.39.71L7.962,3.9a2.038,2.038,0,0,0-2.86,0L3.652,5.362a2.02,2.02,0,0,0-.01,2.851l.65.67a8.419,8.419,0,1,0,16.13,3.39,8.4,8.4,0,0,0-.72-3.411ZM4.362,6.062l1.45-1.45a1.016,1.016,0,0,1,1.44,0l.44.43a8.427,8.427,0,0,0-2.91,2.9l-.42-.43A1.027,1.027,0,0,1,4.362,6.062ZM12,19.682a7.415,7.415,0,1,1,7.42-7.409A7.421,7.421,0,0,1,12,19.682Zm7.22-11.75a8.578,8.578,0,0,0-2.91-2.89l.44-.43a1.016,1.016,0,0,1,1.44,0l1.45,1.45a1.027,1.027,0,0,1,0,1.451Z"/>
      <path d="M17.042,12.763H12a.455.455,0,0,1-.27-.081c-.03-.02-.05-.039-.07-.049a.442.442,0,0,1-.16-.36V7.232a.5.5,0,0,1,1,0v4.531h4.54A.5.5,0,0,1,17.042,12.763Z"/>
      </g>
    </g>
    </svg>
    <p>Turn On</p>
  </button>
  <button id="turn-off">
    <svg width="25" height="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <g>
    <g>
      <path d="M4.564,3.856a.5.5,0,0,0-.7.71l.29.29-.5.5a2.019,2.019,0,0,0-.01,2.85l.65.67a8.273,8.273,0,0,0-.71,3.39A8.427,8.427,0,0,0,12,20.686a8.275,8.275,0,0,0,5.72-2.26c.57.57,1.14,1.15,1.71,1.71a.5.5,0,0,0,.71-.7Zm-.21,2.21.51-.5c.32.33.65.65.98.98a6.38,6.38,0,0,0-1.06,1.4l-.43-.44A1.032,1.032,0,0,1,4.354,6.066ZM12,19.686a7.43,7.43,0,0,1-7.42-7.42,7.312,7.312,0,0,1,1.96-5.02l2.59,2.59q3.945,3.945,7.88,7.88A7.27,7.27,0,0,1,12,19.686Z"/>
      <path d="M20.354,8.216a2.04,2.04,0,0,0,0-2.86l-1.46-1.45a2.01,2.01,0,0,0-2.85,0l-.68.67a8.528,8.528,0,0,0-6.38-.17c-.6.23-.34,1.19.27.97a7.419,7.419,0,0,1,9.64,9.64c-.22.6.74.86.97.26a8.506,8.506,0,0,0-.17-6.39Zm-2.4-1.9a8.068,8.068,0,0,0-1.65-1.27l.44-.43a1.026,1.026,0,0,1,1.45,0l1.45,1.45a1.014,1.014,0,0,1,0,1.44l-.43.44A8.262,8.262,0,0,0,17.954,6.316Z"/>
    </g>
    </g>
    </svg>
    <p>Turn Off</p>
  </button>
  <button id="delete-alarm">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="25" height="25" class="icon-delete-alarm">
    <path d="M20.5001 6H3.5" stroke-width="1" stroke-linecap="round"/>
    <path d="M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5" stroke-width="1" stroke-linecap="round"/>
    <path d="M9.5 11L10 16" stroke-width="1" stroke-linecap="round"/>
    <path d="M14.5 11L14 16" stroke-width="1" stroke-linecap="round"/>
    <path d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6" stroke-width="1"/>
    </svg>
    <p>Delete</p>
  </button>
</div>
`