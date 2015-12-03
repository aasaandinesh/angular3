/**
 * Created by dineshsingh on 28/11/15.
 */

var candidateApp = angular.module('candidateApp', ['ngRoute','ngResource']);
var parseHeaders = {'X-Parse-Application-Id':'LTApq2GWpN5ywWzSe7NgsyvxNYV1N9hXoSpqwkKf',
    'X-Parse-REST-API-Key':'E8cVlgE32tlx9LWYMM8pAYEQE3mq3uru7trz799A'};




candidateApp.directive('editDirective', function(){
    var directive = {};
    directive.restrict='E';
    task.editable = false;

    directive.template="<div class='input '> {{task.details}}</div>";
    directive.link = function($scope, element){

        element.bind("click", function(e){
            console.log("element clicked");


        });
/*
        var html = '<input type="text" {{$scope.candidate.name}}>';
        var e = $compile(html)(scope);
        element.replaceWith(e);
        */
    };
    return directive;
});

candidateApp.factory('TaskService', function($resource){
    return $resource("https://api.parse.com/1/classes/Task/:taskId",{task:'@taskId'},{
        query:{
            method:'GET',
            headers:parseHeaders
        }
        ,
        update:{
            method:'PUT',
            headers:parseHeaders
        },
        get:{
            method:'GET',
            headers:parseHeaders
        },
        delete:{
            method:'DELETE',
            headers:parseHeaders
        }
    });
});

var r;
candidateApp.controller('taskListCtrl', function($scope,TaskService){
    var query = TaskService.query();

    query.$promise.then(function(data){
        $scope.tasks =data['results'];
    });

    $scope.strikeOutTask = function (task) {
        task['completed'] = !task['completed'];
        TaskService.update({taskId:task['objectId']}, task);
    };
});

candidateApp.controller('taskDetailsCtrl',['$scope', '$routeParams','TaskService', function($scope,$routeParams ,TaskService){
//$scope.task = $scope.tasks[$routeParams.taskId];
    var query = TaskService.get({taskId:$routeParams.taskId});

    query.$promise.then(function(data){
        $scope.task = data;
    });

    $scope.deleteTask = function(task){

        TaskService.delete({taskId:task['objectId']});
    }
}]);





candidateApp.controller('candidateListCtrl', function($scope,$http){


    var request = {
        method:'GET',
        url:getCandidatesUrl,
        headers:parseHeaders
    };
    $http(request)
        .then(function successCallback(response){
            $scope.tasks= response['data']['results'];
            console.log(response);
            console.log($scope.candidates);
        }, function errorCallback(response){
            console.log(response);
        });

    //$scope.candidates = [{"name":"Dinesh1"},{"name":"Dinesh2"},{"name":"Dinesh3"},{"name":"Dinesh4"}];



    $scope.taskCompleted = function(task){
        var taskIndex= $scope.tasks.indexOf(task);


        if(taskIndex>-1){
            $scope.tasks[taskIndex]["completed"] = !$scope.tasks[taskIndex]["completed"];

        }

    };


});



candidateApp.controller('candidateDetailsCtrl',['$scope','$routeParams','$http',function($scope, $routeParams, $http) {
        var index = getIndexByCandidateId($routeParams.candidateId);
        //$scope.candidate= $scope.candidates[index];

    $scope.candidate = $scope.candidates[index];

        $scope.editCandidate = function (candidate) {


            $scope.candidates[index] = candidate;

            var request = {
                method:'PUT',
                url:getCandidatesUrl+"/"+candidate['objectId'],
                headers:parseHeaders,
                data:$scope.candidate};
            $http(request)
                .then(function successCallback(response){
                    $scope.candidates = response['data']['results'];
                    console.log(response);
                    console.log($scope.candidates);
                }, function errorCallback(response){
                    console.log(response);
                });



        };

        function getIndexByCandidateId(id) {
            /*var i = 0;
            while (i < $scope.candidates.length){
                if (candidate['id'] == id) {
                    return i;
                }
                i++;
            }
            return -1;
            */

            return id;
        }



    }]
);






candidateApp.controller('candidateListCtrl', function($scope,$http){


    var request = {
        method:'GET',
        url:getCandidatesUrl,
        headers:parseHeaders
    };
    $http(request)
        .then(function successCallback(response){
            $scope.candidates = response['data']['results'];
            console.log(response);
            console.log($scope.candidates);
        }, function errorCallback(response){
            console.log(response);
        });

    //$scope.candidates = [{"name":"Dinesh1"},{"name":"Dinesh2"},{"name":"Dinesh3"},{"name":"Dinesh4"}];

    $scope.addCandidate = function(candidateName){


        $scope.candidates.push({"name":candidateName, "placed":false});
        $scope.candidateName="";
    };

    $scope.placeCandidate = function(candidate){
        var placedCandidateIndex = $scope.candidates.indexOf(candidate);


        if(placedCandidateIndex >-1){
            $scope.candidates[placedCandidateIndex]["placed"] = !$scope.candidates[placedCandidateIndex]["placed"];
        }

    };


});


candidateApp.config( function ($routeProvider) {
    $routeProvider.when('/candidate/:candidateId', {
        templateUrl: 'templates/candidate-details.html',
        controller: 'candidateDetailsCtrl'
    }).when('/', {
        templateUrl:'templates/candidateList.html',
        controller:'candidateListCtrl'})
        .when('/tasks', {
            templateUrl:'templates/task-list.html',
            controller:'taskListCtrl'})
        .when('/task/:taskId', {
            templateUrl:'templates/task-details.html',
            controller:'taskDetailsCtrl'})
        .otherwise({redirectTo:'/'});


});




