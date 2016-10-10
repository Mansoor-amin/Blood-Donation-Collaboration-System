angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope,$rootScope, firebaseURL, $firebaseArray) {

    var userRef = new Firebase(firebaseURL+ '/users');
    $scope.user = $rootScope.userData;
})

.controller('SignUpCtrl', function($scope, firebaseURL, $state) {
    $scope.user;
    var ref = new Firebase(firebaseURL);
    $scope.createUser = function(user){
        console.log(user);
      ref.createUser({
        email:  user.Email,
        password: user.Password
      },function(err, success){
        if(success){
          user.uid =success.uid;
         /* var usersRef = ref.child("users").child(success.uid);*/
          var usersRef = ref.child("users");
          usersRef.push(user);
            alert("user created successfully.");
            $state.go('login');
        }else{
          alert("error in creating user.");
          console.log(err);
        }
      });
    }

})
.controller('LoginCtrl', function($scope,$rootScope,firebaseURL, $firebaseArray, $firebaseObject, $state) {
    $scope.user;
    var ref = new Firebase(firebaseURL);

    $scope.loginUser = function(user){

      ref.authWithPassword({
        email    : user.email,
        password : user.password
      }, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
            localStorage.setItem('uid',authData.uid);
            localStorage.setItem('email',authData.password.email);

          var userRef = new Firebase(firebaseURL+ '/users');


          var sync = $firebaseObject(ref);
          var firebaseObj = sync;

          firebaseObj.$loaded().then(function(){
            angular.forEach(firebaseObj.users, function(value, key){
              if(value.uid ===authData.uid){
                console.log('vale ' + value);
                console.log('key ' + key);

                $rootScope.userData = {
                  Name : value.FName + " " + value.LName,
                  Email : value.Email,
                  PhoneNo : value.PhoneNo,
                  BloodGroup : value.BloodGroup,
                  profileImageURL : authData.password.profileImageURL,
                  id: key
                };
                $state.go('app.Home');
              }
            });
          });
        }
      });
      }
})
.controller('HomeCtrl', function($scope, firebaseURL,$rootScope, $firebaseArray) {
    var postRef = new Firebase(firebaseURL+ '/posts');
    $scope.uid = localStorage.getItem('uid');
    $scope.posts = $firebaseArray(postRef);

    $scope.posts.$loaded().then(function(){
      console.log($scope.posts);
    });

    $scope.Volunteers = function (val) {
      console.log(val);
      $scope.posts.child(val.$id).child('VolunteersList').push($rootScope.userData);
    }
})

.controller('myPostCtrl',function($scope,firebaseURL, $firebaseArray) {

    var postRef = new Firebase(firebaseURL+ '/posts');
    $scope.uid = localStorage.getItem('uid');
    $scope.posts = $firebaseArray(postRef);
    $scope.posts.$loaded();

})

.controller('PlaylistsCtrl', function($scope) {

})

.controller('postBloodRequirementCtrl', function($scope,$rootScope, $state,firebaseURL) {
    $scope.post = {};
    $scope.uid = localStorage.getItem('uid');
    $scope.post.userDetails = $rootScope.userData;

    var ref = new Firebase(firebaseURL);

    $scope.createPost = function(){
      $scope.post.userid = $scope.uid;
      $scope.post.Volunteers = 0;

      var postsRef = ref.child("posts");
          postsRef.push($scope.post, function(err){
        if(err){
          alert("error in creating post.");
          console.log(err);
        }else{
          alert("Post created successfully.");
          $state.go('app.Home');
        }
      });
    };

    $scope.countries = [ {
      name: "Pakistan",
      dial_code: "+92",
      code: "PK"
    }];

    $scope.states = [{
      name: "Sindh"
    },{
      name: "Punjab"
    },{
      name: "Baluchistan"
    },{
      name: "Khyber-Pakhtunkhwa"
    }];

    $scope.cities = [ {
      name: "Karachi"
    },{
      name: "Hyderabad"
    },{
      name: "Sukkur"
    },{
      name: "Mirpur Khas"
    },{
      name: "Jacobabad"
    },{
      name: "Lahore"
    },{
      name: "Faisalabad"
    },{
      name: "Rawalpindi"
    },{
      name: "Multan"
    },{
      name: "Gujranwala"
    },{
      name: "Peshawar"
    },{
      name: "Mardan"
    },{
      name: "Abbottabad"
    },{
      name: "Kohat"
    },{
      name: "Quetta"
    },{
      name: "Khuzdar"
    },{
      name: "Gwadar"
    },{
      name: "Turbat"
    }];
    $scope.Hospitals = [ {
      name: "Ziauddin Hospital"
    },{
      name: "Agha Khan Hospital"
    },{
      name: "Liaquat National Hospital"
    },{
      name: "OMI"
    },{
      name: "Jinnah Hospital"
    },{
      name: "Holy Family Hospital"
    }];

    $scope.RelationsWithPatient = [ {
      relation: "Father"
    },{
      relation: "Mother"
    },{
      relation: "Son"
    },{
      relation: "Daughter"
    },{
      relation: "Aunt"
    },{
      relation: "Uncle"
    },{
      relation: "Nephew"
    },{
      relation: "Niece"
    },{
      relation: "Friend"
    },{
      relation: "Neighbour"
    },{
      relation: "None"
    }];
});
