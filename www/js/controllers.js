angular.module('starter.controllers', [])

  .controller('HomeCtrl', function ($scope) {
  })

  .controller('ListCtrl', function ($scope, List) {
    $scope.isMore = false;
    $scope.page = 0;
    $scope.moredata = true;
    $scope.loadNewerStories = function () {
      $scope.page = 0;
      _loadList(false)
        .finally(function () {
          // 停止广播ion-refresher
          $scope.$broadcast('scroll.refreshComplete');
        });
    }//下拉刷新
    $scope.loadOlderStories = function () {
      $scope.page = $scope.page ? parseInt($scope.page) + 1 : 1;
      _loadList()
        .finally(function () {
          // 停止广播ion-refresher
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }//加载更多
    function _loadList() {
      $scope.page = $scope.page ? $scope.page : 1;
      return List.loadList(1, $scope.page).then(function (data) {
        if (data.status == 100) {
          if ($scope.page < data.data.totalPage)
            $scope.moredata = true;
          else
            $scope.moredata = false;
          if ($scope.isMore) {
            $scope.list = $scope.list.concat(data.data.list);
          } else {
            $scope.list = data.data.list;
          }
          $scope.page = data.data.page;
          $scope.isMore = true;
        } else {
          Helper.showConfirm(data.message);
        }
      })
    }
  })

  .controller('DetailCtrl', function ($scope, $stateParams, List) {
    return List.loadView($stateParams.chatId).then(function (data) {
      if (data.status == 100) {
        $scope.item = data.data;
      } else {
        Helper.showConfirm(data.message);
      }
    })
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
