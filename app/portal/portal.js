angular.module('portal')

.config(function($stateProvider, RestangularProvider) {
	$stateProvider
		.state('portal', {
			url: "/portal",
			templateUrl: "app/portal/portal.html",
			resolve: {},
			controller: function($scope, Restangular, $q){
				$scope.nav = {};
				$scope.programs = null;
				$scope.projects = null;

				$scope.$watch('user', function( newValue, oldValue ) {

					if(!newValue || !newValue.id)
						return;

					$q.all([
						Restangular.all('programs').getList(),
						newValue.getList('projects')
					]).then(function(res){

						// add programs to nav
						$scope.programs = res[0];
						res[0].forEach(function(program){
							$scope.nav[program.id] = {
								id: program.id,
								title: program.title,
								projects: {}
							}
						});

						// map user's projects to corresponding program in nav
						$scope.projects = res[1];
						res[1].forEach(function(project){
							$scope.nav[project.program_id].projects[project.id] = {
								id: project.id,
								title: project.title,
								flow: project.flow
							};
						});
					});
				});

			}
		})
		.state('portal.dashboard', {
			url: "/",
			templateUrl: "app/portal/portal.dashboard.html",
			controller: function($scope){
				
			}
		})

});