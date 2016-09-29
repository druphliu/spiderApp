var url_base = "http://127.0.0.1:90/"; //dev
//var url_base = "http://wj.zzyuqing.com/api.php?";//production

url_list = function(catid,page){
  var url_news_list = url_base+"api/list?";
  url_news_list = page ? url_news_list + '&page=' + page : url_news_list;
  return url_news_list + "&catid=" + catid ;
}
url_list_view = function(id){
  var url_news_view = url_base+"api/view";
  return url_news_view + "?id=" + id ;
}
angular.module('starter.services', [])

.factory('httpInterceptor',function($rootScope,$q){

  return{
    'responseError' : function(response){
      $rootScope.$broadcast('loading:hide');
      $rootScope.$broadcast({
        401 : "Not Authenticated",
        403 : "Not Authorized"
      }[response.status],response);
      return $q.reject(response);
    },
    'request' : function(config){
      $rootScope.$broadcast('loading:show');
      return config;
    },
    'response': function(response) {
      if(response.data && response.data.error){
        $rootScope.responseMsg = response.data.error;
        $rootScope.$broadcast('modal:show');
      }
      $rootScope.$broadcast('loading:hide');

      return response;
    }
  }
})

.factory('WechatShare',function(){
  return {
    share : function(title,description,thumb,link,scene,$ionicPopup){
        Wechat.isInstalled(function (installed) {
            if(installed){

              if(scene==0)
                scene = Wechat.Scene.SESSION
              else
                scene = Wechat.Scene.TIMELINE

              Wechat.share({
                  message: {
                      title: title,
                      description:  description,
                      thumb: thumb,

                      media: {
                          type: Wechat.Type.LINK,
                          webpageUrl: link
                      }
                  },
                  scene: scene
              });
          }else{
            $ionicPopup.alert({ title: '提示', template:"亲，你还没有安装微信哦"});
          }
        }, function (reason) {
            $ionicPopup.alert({ title: '提示', template:"分享失败"});
        });
    }
  }
})
  .factory('Helper',function($ionicPopup,$state,$ionicHistory){
    return {
      noLoginPopup:function(){
        var confirmPopup = $ionicPopup.confirm({
          title: '<strong>提示</strong>',
          template: '检测到你已退出，重新登陆？',
          okText: '确认',
          cancelText: '取消'
        });

        confirmPopup.then(function (res) {
          if (res) {
            $state.go('login');
          } else {
            ionic.Platform.exitApp();
          }
        });
      },
      showConfirm:function(msg){
        var confirmPopup = $ionicPopup.confirm({
          title: '<strong>提示</strong>',
          template: msg,
          okText: '确认',
          cancelText: '退出'
        });
        confirmPopup.then(function (res) {
          if (res) {
            if(!$ionicHistory.goBack()){
              $state.go('home');
            };
          } else {
            ionic.Platform.exitApp();
          }
        });
      }
    }
  })
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('httpInterceptor');

});
