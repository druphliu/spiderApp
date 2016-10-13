angular.module('starter.controllers')


  .controller('ListCtrl', function ($scope, List, params, Helper) {
    $scope.isMore = false;
    $scope.page = 0;
    $scope.moredata = true;
    $scope.loadNewerStories = function () {
      $scope.page = 0;
      _loadList($scope.project_type_value, $scope.project_from_value, false)
        .finally(function () {
          // 停止广播ion-refresher
          $scope.$broadcast('scroll.refreshComplete');
        });
    }//下拉刷新
    $scope.loadOlderStories = function () {
      $scope.page = $scope.page ? parseInt($scope.page) + 1 : 1;
      _loadList($scope.project_type_value, $scope.project_from_value, false)
        .finally(function () {
          // 停止广播ion-refresher
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }//加载更多
    function _loadList(type, from, isSearch) {
      if (isSearch)Helper.showLoading();
      $scope.page = $scope.page&&isSearch==false ? $scope.page : 1;
      return List.loadList(type, from, $scope.page).then(function (data) {
        if (isSearch)Helper.hideLoading();
        if (data.status == 100) {
          if ($scope.page < data.data.totalPage)
            $scope.moredata = true;
          else
            $scope.moredata = false;
          if ($scope.isMore && isSearch == false) {
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

    //筛选
    $scope.project_type = $scope.from_type = $scope.mark = true;
    $scope.project_type_name = $scope.from_type_name = '全部';
    $scope.project_type_value = $scope.project_from_value = 0;
    $scope.params = params;
    $scope.showPop = function (type) {
      switch (type) {
        case params.TYPE_PROJECT:
          $scope.project_type = $scope.mark = !$scope.project_type;
          $scope.from_type = true;
          break;
        case params.TYPE_FROM:
          $scope.project_type = true;
          $scope.from_type = $scope.mark = !$scope.from_type;
          break;
      }
    }
    $scope.search = function (type, value) {
      $scope.showPop(type);
      switch (type) {
        case params.TYPE_PROJECT:
          $scope.project_type_name = value == params.PROJECT_TYPE_BUDONGCHAN ? '不动产' : '动产';
          $scope.project_type_value = value;
          break;
        case params.TYPE_FROM:
          switch (value) {
            case params.FROM_TYPE_JIAOYISUO:
              $scope.from_type_name = '交易所';
              $scope.project_from_value = params.FROM_TYPE_JIAOYISUO;
              break;
            case params.FROM_TYPE_PAIMAIGONGSI:
              $scope.from_type_name = '拍卖公司';
              $scope.project_from_value = params.FROM_TYPE_PAIMAIGONGSI;
              break;
            case params.FROM_TYPE_FAYUAN:
              $scope.from_type_name = '人民法院';
              $scope.project_from_value = params.FROM_TYPE_FAYUAN;
              break;
          }
          break;
      }
      _loadList($scope.project_type_value, $scope.project_from_value, true)
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

