require([], function() {
  $(function() {
    validateUser();
    $('#user').keyup(validateUser);
    $('#user').mouseup(validateUser);
    
    validateName();
    $('#name').keyup(validateName);
    $('#name').mouseup(validateName);
    
    validatePassword();
    $('#password').keyup(validatePassword);
    $('#password').mouseup(validatePassword);
    
    $('#password,#password2').keyup(validatePasswordsSame);
    $('#password,#password2').mouseup(validatePasswordsSame);
  });
});

function validateUser() {
  var user = $('#user').val();
  var message = '';
  
  if (user.length < 1) {
    message = 'Missing';
  } else if (user.length < 5) {
      message = 'Too short';
  } else if (!/^\w{5,}$/.test(user)) {
    message = 'Invalid';
  } else {
    message = 'checking...';
    checkIfUserNotUsed();
  }
  
  showValidationMessage($('#user'), message);
  enableDisableSubmit();
}

function validateName() {
  var user = $('#name').val();
  var message = '';
  
  if (user.length < 1) {
    message = 'Missing';
  } else if (!/^\S+( +\S+)+$/.test(user)) {
    message = 'Invalid';
  }
  
  showValidationMessage($('#name'), message);
  enableDisableSubmit();
}

function validatePassword() {
  var user = $('#password').val();
  var message = '';
  
  if (user.length < 1) {
    message = 'Missing';
  } else if (user.length < 6) {
      message = 'Too short';
  }
  
  showValidationMessage($('#password'), message);
  enableDisableSubmit();
}

function validatePasswordsSame() {
  var password = $('#password').val();
  var password2 = $('#password2').val();
  var message = '';
  
  if (password !== password2) {
    message = 'Passwords differ';
  }
  
  showValidationMessage($('#password2'), message);
  enableDisableSubmit();
}

function showValidationMessage(inputElement, message) {
  var validationElement = $(inputElement).closest('tr').find('.validation');
  validationElement.text(message);
}

function enableDisableSubmit() {
  var disabledValue = '';
  
  if ($('.validation').text()) {
    disabledValue = 'true';
  }
  
  $('input[type="submit"]').attr('disabled', disabledValue);
}

function checkIfUserNotUsed() {
  var user = $('#user').val();
  $.get('/checkIfUserUsed/' + user, function(data, textStatus, XMLHttpRequest) {
    showValidationMessage($('#user'), data);
  });
}
