module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
				options: {
					loadPath: require('node-bourbon').includePaths
				},
				files: {
					'css/screen.css': 'scss/screen.scss'
				}
			}

		},
		watch: {
			css: {
				files: 'scss/*.scss',
				tasks: ['sass']
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.registerTask('Default',['watch']);
};
