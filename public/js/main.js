'use strict';

var app = angular.module('app', []);

app.controller('ctrl', ['$scope', '$rootScope', '$interval', '$timeout', function($scope, $rootScope, $interval, $timeout){

  $scope.searchType = '';
  $scope.removeError = '';
  $scope.searchBoxOpen = false;
  $scope.addStudent = () => {
    $('#addStudentPage').addClass('show');
  }
  $scope.hideStudentChoiceSection = () => {
    $('#addStudentPage').removeClass('show');
    $('.studentAddBox').removeClass('showForm');
    $('input').val('');
  }
  $scope.editForm = (data) => {
    $(".studentAddBox").removeClass('showForm');
    $(`.studentAddBox[data="${data}"]`).addClass('showForm');
  }
  $scope.submitStudent = (data, img) => {
    const idNumber = $(`.studentAddBox[data="${data}"] .infoForm input[name="id"]`).val();
    const name = $(`.studentAddBox[data="${data}"] .infoForm input[name="name"]`).val();
    const defaultName = $(`.studentAddBox[data="${data}"] .infoForm input[name="name"]`).attr('placeholder');
    const testscore1 = $(`.studentAddBox[data="${data}"] .infoForm input[name="testscore1"]`).val();
    const testscore2 = $(`.studentAddBox[data="${data}"] .infoForm input[name="testscore2"]`).val();
    const testscore3 = $(`.studentAddBox[data="${data}"] .infoForm input[name="testscore3"]`).val();
    const hasEmptyFields = ((testscore1.trim().length === 0) || (testscore2.trim().length === 0) || (testscore3.trim().length === 0));
    const testScoreNotNumerical = (isNaN(testscore1) || isNaN(testscore2) || isNaN(testscore3));
    if(hasEmptyFields){
      $scope.inputError('must fill in all fields', data);
    } else if(testScoreNotNumerical){
      $scope.inputError('test scores must be numerical values', data);
    } else {
      $.ajax({
        method: "POST",
        url: "https://gradebookrothman.herokuapp.comaddstudent",
        data: {
          idNumber,
          name: (name.trim().length === 0) ? defaultName : name,
          testscore1,
          testscore2,
          testscore3,
          img
        }
      }).done(msg => {
        $('input').val('');
        $scope.hideStudentChoiceSection();
        $scope.confirmation('Student added to gradebook!');
        $scope.fetchStudents();
      }).fail(err => {
        $scope.inputError(err.responseJSON.student, data);
      });
    }
  }
  $scope.inputError = (error, data) => {
    $(`.inputError[data="${data}"]`).text(error);
    $scope.removeError = '';
    $scope.removeError = $timeout(() => {
      $('.inputError').text('');
    }, 6000)
  }
  $scope.students = [
    {
      name: 'Ms. Frizzy',
      classImg: 'girl'
    },
    {
      name: 'Cat Nip',
      classImg: 'cat'
    },
    {
      name: 'Smokey Bear',
      classImg: 'bear'
    },
    {
      name: 'Foxy Brown',
      classImg: 'fox'
    },
    {
      name: 'Mr. Owl',
      classImg: 'owl'
    },
    {
      name: 'Roger Rabbit',
      classImg: 'rabbit'
    },
    {
      name: 'Dory',
      classImg: 'shark'
    },
    {
      name: 'Rudolph Reindeer',
      classImg: 'dear'
    }
  ];
  $scope.studentInfo = [];
  $scope.studentClass = (student) => {
    return `${student.classImg || student.img} fullBackground`
  }
  $scope.fetchStudents = () => {
    $.ajax({
      method: "GET",
      url: "https://gradebookrothman.herokuapp.com/students"
    }).done(msg => {
      $scope.studentInfo = msg;
      $scope.$apply()
    }).fail(err => {
      console.log(err);
    });
  }
  $scope.fetchStudents();
  $scope.confirmation = (text) => {
    $('#confirmationBoxHolder').addClass('confirmation')
    $('#confirmationBox p').text(text);
    $timeout(() => {
      $('#confirmationBoxHolder').removeClass('confirmation');
    }, 2000);
  }
  $scope.showAverage = (index, student) => {
    $scope.studentInfo[index]['average'] = ((parseFloat(student.testscore1) + parseFloat(student.testscore2) + parseFloat(student.testscore3)) / 3);
  }
  $scope.deleteStudent = (student) => {
    $.ajax({
      method: "DELETE",
      url: "https://gradebookrothman.herokuapp.com/removeStudent",
      data: { name: student.name, id: student._id }
    }).done(msg => {
      $scope.confirmation('student deleted');
      $scope.fetchStudents();
    }).fail(err => {
      console.log(err);
    });
  }
  $scope.showSearchBox = () => {
    $('#searchBoxHolder').removeClass('hide');
  }
  $scope.searchStudentByName = () => {
    $scope.searchType = 'name';
    $scope.showSearchBox();
  }
  $scope.searchStudentById = () => {
    $scope.searchType = 'id';
    $scope.showSearchBox();
  }
  $scope.enterPressed = (e) => {
    let inputValue = $('#searchFromHomePage').val();
    inputValue = inputValue.trim();
    if(inputValue.length === 0) {
      return null
    }

    if(e.key === 'Enter' && $scope.searchType === 'name'){
      $.ajax({
        method: "POST",
        url: "https://gradebookrothman.herokuapp.com/findstudentbyname",
        data: { name: inputValue }
      }).done(msg => {
        $scope.studentInfo = [msg];
        $scope.$apply()
      }).fail(err => {
        $scope.confirmation('sorry no student found under that name. warning: input is case sensitive');
        $('input').blur();
        $scope.hideSearchBox();
      });
    } else if(e.key === 'Enter' && $scope.searchType === 'id'){
      $.ajax({
        method: "POST",
        url: "https://gradebookrothman.herokuapp.com/findstudentbyid",
        data: { idNumber: inputValue }
      }).done(msg => {
        $scope.studentInfo = [msg];
        $scope.$apply()
      }).fail(err => {
        $scope.confirmation('sorry no student found under that id. warning: input is case sensitive');
        $('input').blur();
        $scope.hideSearchBox();
      });
    }
  }
  $scope.hideSearchBox = () => {
    if(!$scope.searchBoxOpen && document.activeElement.id !== 'searchFromHomePage'){
      $('#searchBoxHolder').addClass('hide');
      $scope.searchBoxOpen = false;
    }
  }

}]);
