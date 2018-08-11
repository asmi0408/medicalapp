const moment = require('moment');

module.exports = {
  formatDate: function (date, format) {
    return moment(date).format(format);
  },
  new1: function (new2) {
    return `<span class="new badge btn-floating pulse">1</span>`;
  },
  counting: function(index){
    return index+1;

  },
  //helper to select the correct selected value from mongodb
  //solutions here https://stackoverflow.com/questions/13046401/how-to-set-selected-select-option-in-handlebars-template
  select: function (selected, options) {
    return options.fn(this)
      .replace(new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"')
      .replace(new RegExp('>' + selected + '</option>'), ' selected="selected"$&');
  },
  bodyparts: function (date, dateto, clinic, task, uploadmc){
    var formatdatefrom = moment(date).format('Do MMM YYYY');
    var formatdateto = moment(dateto).format('Do MMM YYYY');
    if(uploadmc == 'none')
    {
      return `  
      <h6>Request date: ${formatdatefrom}</h6>
      <h6>Clinic name: ${clinic}</h6>
      <p>Outstanding Tasks</p><p> ${task}</p>`;
    } else {
      return `
      <h6>Date from: ${formatdatefrom}</h6>
      <h6>Date to: ${formatdateto}</h6>
      <h6>Clinic name: ${clinic}</h6>
      <p>Outstanding Tasks</p><p> ${task}</p>`;
    }
  },
  submitMC: function (date, id, uploadmc, mcuser, loggeduser, acknowledge, mclocation) {
    if (mcuser == loggeduser) {
      if (acknowledge == false) {
        if (moment(date).isAfter(moment())) {
          return `<a class="btn btn-dark btn-block mb-2" href="/menu/edit/${id}">Edit request</a>
        <form action="/menu/${id}?_method=DELETE" method="post">
          <input type="hidden" name="_method" value="DELETE">
          <input type="submit" class="btn btn-danger btn-block" value="Delete">
        </form>`;
        } else {
          return `<a class="btn btn-dark btn-block mb-2" href="/menu/submit/${id}">Submit MC</a>`;
        }
      } else {
        if (uploadmc == 'none') {
          return `<a class="btn btn-dark btn-block mb-2" href="/menu/submit/${id}">Submit MC</a>`;
        } else
          return `<a class="btn btn-dark btn-block mb-2" href="/img/medicalCertificates/${mclocation}">download MC</a>`;
      }
    } else {
      if (acknowledge == false) {
        return `<form action="/status/acknowledge/${id}?_method=PUT" method="post">
        <input type="hidden" name="_method" value="PUT">
        <input type="submit" class="btn btn-danger btn-block" value="Click to acknowledge the request">
      </form>`;
      } else {
        if (uploadmc == 'none') {
          return `<form action="/send/${id}" method="post">
          <input type="submit" class="btn btn-danger btn-block" value="send reminder">
        </form>`;
        } else {
          return `<a class="btn btn-dark btn-block mb-2" href="/img/medicalCertificates/${mclocation}">download MC</a>`;
        }
      }
    }
  }
}
