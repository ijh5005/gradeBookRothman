'use strict';

var app = angular.module('app', []);

app.controller('ctrl', ['$scope', '$rootScope', '$interval', '$timeout', function($scope, $rootScope, $interval, $timeout){

  $scope.removeError = '';
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
        url: "http://localhost:8000/addstudent",
        data: {
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
      url: "http://localhost:8000/students"
    }).done(msg => {
      $scope.studentInfo = msg;
      $scope.$apply()
      console.log($scope.studentInfo);
    }).fail(err => {
      console.log(msg);
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
      url: "http://localhost:8000/removeStudent",
      data: { name: student.name, id: student._id }
    }).done(msg => {
      $scope.confirmation('student deleted');
      $scope.fetchStudents();
    }).fail(err => {
      console.log(err);
    });
  }

}]);
