/**************************************/
/**********      Utils         *********/
/**************************************/  
var $debug = config.debug;

var _log = function(msg){
  if(typeof(JSBridge) === "undefined"){
        //in browser
        console.log(msg);
      }else{
        //in Android
        JSBridge.log(msg);
      }

    }
    var _debug = function(msg){
      if($debug){
        _log(msg);
      }

    }


  /**********     Cache class    *********/

  var Cache = (function () {
    function Cache() {
      this._cache = {};
    }

    Cache.prototype.put = function (key, value) {
      var normalizedKey = normalizeKey(key);
      var current = this._cache[normalizedKey];
      this._cache[normalizedKey] = value;
      return current;
    };

    Cache.prototype.get = function (key) {
     var normalizedKey = normalizeKey(key);
     return this._cache[normalizedKey];
   };



   Cache.prototype.remove = function (key) {
    var normalizedKey = normalizeKey(key);
    var current = this._cache[normalizedKey];
    if (current !== undefined) {
      delete this._cache[normalizedKey];
    }
    return current;
  };

  var normalizeKey = function(key){
   return "$"+key.replace(/\W/g, '_');
 }
 return Cache;
})();




