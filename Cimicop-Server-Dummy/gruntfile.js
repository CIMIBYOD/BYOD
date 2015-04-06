module.exports = function(grunt) {
	
	grunt.initConfig({
	   connect: {
		server: {
		  options: {
			keepalive : true,
			port: 9001,
			base: '../ANDROID-APP/app/src/main/assets/www'
		  }
		}
	  }
	});
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.registerTask('publish', ['connect']);;

};