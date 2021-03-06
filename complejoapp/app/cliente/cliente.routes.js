angular
	.module('complejo.cliente')
	.config(ConfiguracionRutasCliente);


ConfiguracionRutasCliente.$inject = ['$stateProvider'];

function ConfiguracionRutasCliente($stateProvider) {
	$stateProvider
		/**
		 * Estado Principal para el Cliente
		 */
		.state('app.cliente', {
			abstract : true,
			url : '/cliente',
			templateUrl : 'app/cliente/cliente-layout.html',
			controller : 'ClienteLayoutController',
			controllerAs : 'vm',
			resolve : {
				funciones : ['usuarioFuncionService', '$q', '$log','autorizacionService', '$state',
				function(usuarioFuncionService, $q, $log, autorizacionService) {
					var defered = $q.defer();
					usuarioFuncionService.get({id : autorizacionService.getIdUsuario()}, function(res) {
						$log.debug('UI-router: Resolve ->cliente(funciones) : exito');
						defered.resolve(res.response);
					}, function(error) {
						$log.debug('UI-router: Resolve ->cliente(funciones) :Error');
						defered.reject(error);
						$state.go('app.visitante.inicio');
					});

					return defered.promise;
				}]
			}
		})
		/**
		 * Pagina de inicio de cliente
		 */
		.state('app.cliente.inicio', {
			url : '/inicio',
			templateUrl : 'app/cliente/inicio/inicio.view.html',
			controller : 'InicioControllerCliente',
			controllerAs : 'vm',
			data : {
				nombrepagina : 'Inicio',
				icono : 'fa fa-fw fa-table'
			},
			resolve : {
				complejos : ['$log', '$resource', '$q' , 'REST_API', '$state',
				function($log, $resource, $q, REST_API, $state) {
					
					var defered = $q.defer();

					$resource(REST_API + 'complejosdeportivos').get().$promise
						.then(function(res) {
							$log.debug('UI-router: Resolve ->cliente->registro : exito');
							defered.resolve(res.response);
						}, function(error) {
							$log.debug('UI-router: Resolve ->cliente->registro :Error');
							defered.reject(error);
							$state.go('app.visitante.inicio');
						});

					return defered.promise;
				}]
			}
		}) 
		/**
		 * Estado para la realizacion de Prereservas
		 */
		.state('app.cliente.prereserva', {
			url : '/prereserva',
			templateUrl : 'app/cliente/prereserva/prereserva.view.html',
			controller : 'PrereservaController',
			controllerAs : 'vm',
			data : {
				nombrepagina : 'Realizar Prereserva',
				icono : 'fa fa-fw fa-table'
			},
			resolve : {
				complejos : ['clienteComplejoService', '$q', '$stateParams', '$log', 'autorizacionService',
				function(clienteComplejoService, $q, $stateParams, $log, autorizacionService) {
					var idusuario = autorizacionService.getIdUsuario();

					var defered = $q.defer();

					clienteComplejoService.get({id : idusuario}, function(res) {
						$log.debug("UI-Router :  cliente Prereserva : resolve(cliente) :  exito");
						defered.resolve(res.response);
					}, function(error) {
						$log.debug("UI-Router :  cliente Prereserva : resolve(cliente) :  error");
						defered.reject(error);
					});

					return defered.promise;
				}]
			}
		})
}