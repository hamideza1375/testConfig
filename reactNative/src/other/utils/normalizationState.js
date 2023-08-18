export default function normalizationState(array, setarray = () => { }) {
  let obj = {}
  array.forEach(a => (obj[a._id] = a))
  this.value = () => { return Object.values(obj) }
  this.remove = (id) => { delete obj[id] ? obj[id] : {}; this.save() }
  this.delete = (key, value) => { const valuesArray = Object.values(obj).filter((item)=>(item[key] !== value)); obj = {}; valuesArray.forEach(a => (obj[a._id] = a)); this.save() }
  this.find = (id, key, val) => { if (obj[id]) { obj[id][key] = val; this.save() } }
  this.findKey = (findKey, value, key, newValue) => { const valuesArray = Object.values(obj); const index = valuesArray.findIndex((item)=>(item[findKey] === value)); valuesArray[index][key] = newValue; obj = {}; valuesArray.forEach(a => (obj[a._id] = a)); this.save() }
  this.push = (data) => { obj[data._id] = data; this.save() }
  this.sort = (key) => { this.value = () => { return Object.values(obj).sort((a, b) => (a[key] - b[key])); }; this.save() }
  this.asc = (key) => { this.value = () => { return Object.values(obj).sort((a, b) => (a[key] - b[key])); }; this.save() }
  this.desc = (key) => { this.value = () => { return Object.values(obj).sort((a, b) => (b[key] - a[key])); }; this.save() }
  this.reverse = () => { this.value = () => { return Object.values(obj).reverse() }; this.save() }
  this.unshift = (data) => { const valuesArray = Object.values(obj); valuesArray.unshift(data); obj = {}; valuesArray.forEach(a => (obj[a._id] = a)); this.save() }
  this.splice = (num1, num2, data) => { const valuesArray = Object.values(obj); data ? valuesArray.splice(num1, num2, data) : valuesArray.splice(num1, num2); obj = {}; valuesArray.forEach(a => (obj[a._id] = a)); this.save() }
  this.set = (newValue) => { obj={}; newValue.forEach(a => (obj[a._id] = a)); this.value(); this.save() }
  this.getId = (id) => { return obj[id] }
  this.save = () => { setarray({ ...this }) }
  setarray({ ...this })
}
