

// for (let i = 0; i < uncheckedList.length; i++) {
//     uncheckedList[i];
    
// }

//let currentDay = new Date().toLocaleString('en-GB', {weekday: 'long'});
let currentDay = Math.floor(Date.now() / (86400 * 1000));
let today = Math.floor(Date.now() / (86400 * 1000));
showItems(today);
resetAtMidnight();
loadTheme();
toggleDayType();
let pupupState = false;
let themes =['iceberg-dark','vscode','dark','shadow','arch','moonlight','cafe','repose','paper','iceberg-light'];
insertThemes();
//document.getElementById('nav-day').innerHTML = currentDay;
// use this after implementing localstorage to add listeners


function moveDay(direction) {
    if (direction === 'right') {
        if (currentDay - today >= 6) {
            return;
        }
        if (currentDay - today == 5) {
            document.getElementById("day-move-future").disabled = true;
        }
        document.getElementById("day-move-past").disabled = false;
        currentDay += 1;
        showItems(currentDay);
    }else if (direction === 'left') {
        if (currentDay - today <= 0) {
            return;
        }
        if (currentDay - today == 1) {
            document.getElementById("day-move-past").disabled = true;
        }
        document.getElementById("day-move-future").disabled = false;
        currentDay -= 1;
        showItems(currentDay);
    }
}

function showAdderPopup(){
    document.getElementById('add-item').style.display = 'block';
    document.getElementById('add-item-input').focus();
    togglePopupWrapper();
}

function hideAdderPopup(){
    document.getElementById('add-item').style.display = 'none';
    togglePopupWrapper();
}

function showSettings() {
    document.getElementById('settings-panel').style.display = 'block';
    togglePopupWrapper();
}

function hideSettings() {
    document.getElementById('settings-panel').style.display = 'none';
    togglePopupWrapper();
}

let close = document.getElementsByClassName('trash');
for (let i = 0; i < close.length; i++) {
    close[i].onclick = function() {
        let div = this.parentElement;
        removeItemFromArray(div.id, uncheckedList, 'unchecked');
        removeItemFromArray(div.id, checkedList, 'checked');
        div.remove();
    }
}

let unchecked = document.getElementById('item-ul-unchecked');
unchecked.addEventListener('click', (e) => {
    if(e.target.tagName === 'LI'){
        document.getElementById('item-ul-checked').appendChild(e.target);
        let a = removeItemFromArray(e.target.id, uncheckedList, 'unchecked')
        checkedList.push(a[0]);
        // get it's child's value
        // this is massive headache
        updateDBItem('checked', checkedList);
        // e.target.remove();
    }
})

let checked = document.getElementById('item-ul-checked');
checked.addEventListener('click', (e) => {
    if(e.target.tagName === 'LI'){
        document.getElementById('item-ul-unchecked').appendChild(e.target);
        let a = removeItemFromArray(e.target.id, checkedList, 'checked')
        uncheckedList.push(a[0]);
        // get it's child's value
        // this is massive headache
        updateDBItem('unchecked', uncheckedList);
        // e.target.remove();
    }
})


function addItem() {
    // create a li for the span
    let newLi = document.createElement('li');
    let inputText = document.getElementById('add-item-input').value;
    let newText = document.createTextNode(inputText);
    newLi.appendChild(newText);
    newLi.id = `${currentDay}-${Date.now().toString()}`
    document.getElementById('add-item-input').value = '';
    if(inputText){
        document.getElementById('item-ul-unchecked').appendChild(newLi)
    }else{
        return;
    }
    // create a span to insert into the list
    let newSpan = document.createElement('span');
    newSpan.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
    newSpan.className = 'trash';
    newLi.appendChild(newSpan);

    uncheckedList.push([newLi.id, inputText]);
    updateDBItem('unchecked', uncheckedList);

    let close = document.getElementsByClassName('trash');
    for (let i = 0; i < close.length; i++) {
        close[i].onclick = function() {
        let div = this.parentElement;
        removeItemFromArray(div.id, uncheckedList, 'unchecked');
        removeItemFromArray(div.id, checkedList, 'checked');
        div.remove();
        }
    }
    hideAdderPopup();
}

function reAddItem(arr,type) {
    // create a li for the span
    let newLi = document.createElement('li');
    let inputText = arr[1];
    let newText = document.createTextNode(inputText);
    newLi.appendChild(newText);
    newLi.id = arr[0]
    document.getElementById(`item-ul-${type}`).appendChild(newLi)
    // create a span to insert into the list
    let newSpan = document.createElement('span');
    newSpan.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
    newSpan.className = 'trash';
    newLi.appendChild(newSpan);
    let close = document.getElementsByClassName('trash');
    for (let i = 0; i < close.length; i++) {
        close[i].onclick = function() {
        let div = this.parentElement;
        removeItemFromArray(div.id, uncheckedList, 'unchecked');
        removeItemFromArray(div.id, checkedList, 'checked');
        div.remove();
        }
    }
}

function showItems(day) {
    trashCollect();
    document.getElementById('item-ul-unchecked').innerHTML = '';
    document.getElementById('item-ul-checked').innerHTML = '';
    let dayList = ['Today','Tomorrow', 'Day after tomorrow', 'In 3 days', 'In 4 days', 'In 5 days,', 'In 6 days'];
    if(dayType == 'relative'){
        if (currentDay - today >= 0 && currentDay - today <= 6) {
            document.getElementById('nav-day').innerHTML = dayList[currentDay - today];
        }else{
            document.getElementById('nav-day').innerHTML = 'Someday';
        } 
    }else{
        document.getElementById('nav-day').innerHTML = new Date(currentDay).toLocaleString('en-GB', {weekday: 'long'});
    }
    let items = getDBItemByDay(day, 'unchecked');
    for (let i = 0; i < items.length; i++) {
        reAddItem(items[i], 'unchecked');
    }
    items = getDBItemByDay(day, 'checked');
    for (let i = 0; i < items.length; i++) {
        reAddItem(items[i], 'checked');
    }
}

function trashCollect(){
    let arr = getDBItemByDay(today-1, 'checked');
    for (let i = 0; i < arr.length; i++) {
        removeItemFromArray(arr[i][0], checkedList, 'checked');
    }
}

function toggleTrash() {
    var elements = document.querySelectorAll('.trash');
    for(var i=0; i<elements.length; i++){
        elements[i].style.display = elements[i].style.display == 'none' ? 'inline' : 'none';
    }
}
// no idea how it works
function handleEnter(e){
  var keycode = (e.keyCode ? e.keyCode : e.which);
  if (keycode == '13') {
    document.activeElement.click();
  }
}
function handleEnterAdd(e){
  var keycode = (e.keyCode ? e.keyCode : e.which);
  if (keycode == '13') {
    document.getElementById('add-this-item').focus();
  }
}
function resetAtMidnight(){
    let now = new Date();
    let midnight = new Date();
    midnight.setHours(24,0,0,0);
    let diff = midnight - now;
    setTimeout(function(){
        resetAtMidnight();
    }, diff);
    if(now.getHours() == 0){
        currentDay++;
        today++;
        showItems(today);
    }
}

function setDayRel() {
    localStorage.setItem('dayType', 'relative');
    dayType = 'relative';
    showItems(today);
    toggleDayType();
}
function setDayAbs() {
    localStorage.setItem('dayType', 'absolute');
    dayType = 'absolute';
    showItems(today);
    toggleDayType();
}
function toggleDayType() {
    if(dayType == 'relative'){
        document.getElementById('day-type-abs').classList.remove('active');
        document.getElementById('day-type-rel').classList.add('active');

    }else{    
        document.getElementById('day-type-abs').classList.add('active');
        document.getElementById('day-type-rel').classList.remove('active');

  }
}

function togglePopupWrapper(){
    document.getElementById('underWrap').classList.toggle('popupWrapper');
}

function insertThemes(){
    let t = document.getElementById('themes');
    for (let i = 0; i < themes.length; i++) {
        let newLi = document.createElement('li');
        let newText = document.createTextNode(themes[i].replace('-', ' '));
        newLi.appendChild(newText);
        newLi.className = themes[i];
        newLi.classList.add('change-theme');
        t.appendChild(newLi);
    }
    let b = document.getElementsByClassName('change-theme');
    for (let i = 0; i < b.length; i++) {
        b[i].onclick = function() {
            changeTheme(this.className);
        }
    }
}

function changeTheme(theme){
    theme = theme.split(' ')[0];
    document.getElementsByTagName('body')[0].className = theme;
    localStorage.setItem('theme', theme);
}

function loadTheme(){
    let theme = localStorage.getItem('theme');
    if(theme){
        changeTheme(theme);
    }
}