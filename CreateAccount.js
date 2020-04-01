const $ = require('jquery');
const CreateAccountURL =
  'https://pulsepi.azurewebsites.net/api/account/createAccount';

const required = function(formControlId) {
  let value = $(formControlId).val();
  if (!/\S/.test(value)) {
    $(formControlId).addClass('is-invalid');
    if (!$(formControlId).siblings('.required').length)
      $(formControlId).after(
        `<div class="text-danger required" id="1${formControlId}">Value Is Required</div>`
      );
  } else {
    $(formControlId).removeClass('is-invalid');
    if ($(formControlId).siblings('.required').length)
      $(formControlId)
        .siblings('.required')
        .remove();
  }
};

const mustMatch = function(formControlId) {
  if ($(formControlId).val() && $('#CAPasswordInput').val()) {
    if ($(formControlId).val() !== $('#CAPasswordInput').val())
      $(formControlId).addClass('is-invalid');
    if (!$(formControlId).siblings('.match').length)
      $(formControlId).after(
        `<div class="text-danger match" id="1${formControlId}">Passwords Must Match</div>`
      );
    else {
      $(formControlId).removeClass('is-invalid');
      if ($(formControlId).siblings('.match').length)
        $(formControlId)
          .siblings('.match')
          .remove();
    }
  }
};

const formIdsAndValidators = {
  '#CAUsernameInput': [required],
  '#CAPasswordInput': [required],
  '#CAPasswordRepeat': [required, mustMatch],
  '#CAFirstName': [required],
  '#CALastName': [required],
  '#CAInputEmail': [required]
};

const verifyForm = function() {
  for (let [key, value] of Object.entries(formIdsAndValidators))
    value.forEach(x => x(key));

  if ($('.is-invalid').length) return false;
  else return true;
};

const CreateAccountWindow = {
  remote: require('electron'),
  OpenWindow: function() {
    const win = new remote.BrowserWindow({
      width: 800,
      height: 600,
      icon: __dirname + './assets/img/icon/heart.png', //Set the icon for the system tray
      //frame: false,
      webPreferences: {
        nodeIntegration: true
      }
    });
    win.loadFile('Register.html');
    win.setMenu(null);
    win.webContents.openDevTools();
  },
  setFormValidation: function() {
    $('form').change(function(event) {
      let id = `#${event.target.id}`;
      formIdsAndValidators[id].forEach(validatorfn => {
        validatorfn(id);
      });
    });
  },
  setSubmitListener: function() {
    $('#SubmitCreateAccountBtn').click(function() {
      if (verifyForm())
        $.ajax({
          url: CreateAccountURL,
          type: 'POST',
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify({
            username: $('#CAUsernameInput').val(),
            password: $('#CAPasswordInput').val(),
            firstName: $('#CAFirstName').val(),
            lastName: $('#CALastName').val(),
            email: $('#CAInputEmail').val()
          }),
          success: function(data) {
            console.log(data);
          },
          error: function(data) {
            console.log(data);
          }
        });
    });
  },
  init: function() {
    this.setSubmitListener();
    this.setFormValidation();
  }
};

CreateAccountWindow.init();

module.exports = CreateAccountWindow;
