let version = '0.1.0';
if (!localStorage.getItem('database')) {
    localStorage.setItem('database', JSON.stringify({'version':version}));
}

if (!localStorage.getItem('dayType')) {
    localStorage.setItem('dayType', 'relative');
}
let dayType = localStorage.getItem('dayType');


let database = JSON.parse(localStorage.getItem('database'));    

function updateDBItem(item,update){
    database[item] = update;
    localStorage.setItem('database', JSON.stringify(database));
    return database[item];
}

function getDBItem(item){
    return database[item];
}

function removeItemFromArray(id, array, type) {
    let index = array.findIndex(item => item[0] === id);
    let removed = array;
    if (index > -1) {
        removed = array.splice(index, 1);
    }
    updateDBItem(type, array);
    return removed;
}

function getDBItemByDay(day, type) {
    let items = getDBItem(type);
    let filtered;
    if (day !== today ) {
        filtered = items.filter(item => item[0].split('-')[0] === day.toString());
    }else if(day === today && type === 'unchecked'){
        filtered = items.filter(item => item[0].split('-')[0] <= day.toString());
    }else if(day === today && type === 'checked'){
        filtered = items.filter(item => item[0].split('-')[0] === day.toString());
    }
    else if(day <= today-1 && type === 'checked'){
        filtered = items.filter(item => item[0].split('-')[0] <= day.toString());
    }
    return filtered;
}


let uncheckedList = getDBItem('unchecked');
let checkedList = getDBItem('checked');
if (!uncheckedList) {
    uncheckedList = [];
    updateDBItem('unchecked', uncheckedList);
}
if (!checkedList) {
    checkedList = [];
    updateDBItem('checked', checkedList);
}

function flushDB() {
    localStorage.setItem('database', JSON.stringify({'version':version}));
    database = JSON.parse(localStorage.getItem('database'));  
}
