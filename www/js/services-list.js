

angular.module('starter.services')
.factory('List',function($http){

  return {
    loadList : function(catid,page){
      return $http.get(url_list(catid,page)).then(function(response){
        return response.data;
      })
    },
    loadView : function(viewId){
      return $http.get(url_list_view(viewId)).then(function(response){
        return response.data;
      })
    },
  }

});
