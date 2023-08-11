import Datepicker from '../JS/Datepicker.js'
const startDate = document.querySelector('input[name="startDate"]');
const endDate = document.querySelector('input[name="endDate"]');

const datepicker = new Datepicker(startDate, {
  format: "dd/mm/yyyy",
  defaultViewDate: Date.now(),
  minDate: Date.now(),
}); 

const datepicker2 = new Datepicker(endDate, {
  format: "dd/mm/yyyy",
  defaultViewDate: Date.now(),
  minDate: Date.now(),
}); 



datepicker.setDate(Date.now())
datepicker2.setDate(Date.now())

function getStartDate () {
    return startDate.value
}

function getEndDate () {
  return endDate.value
}

export {getStartDate, getEndDate}