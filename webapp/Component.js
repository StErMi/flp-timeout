sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"it/designfuture/timeoutsample/PingPong/model/models",
	"it/designfuture/timeoutsample/PingPong/utils/pingpong"
], function(UIComponent, Device, models, pingpong) {
	"use strict";

	return UIComponent.extend("it.designfuture.timeoutsample.PingPong.Component", {

		metadata: {
			manifest: "json"
		},	
		
		///////////////////////////////////////////////////////////////////
		//  OVERRIDE LIFECYCLE
		///////////////////////////////////////////////////////////////////

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			pingpong.init();
			pingpong.setUpPingPongForOData(this.getModel("oDataModel"));
		},
		
		exit: function(){
			pingpong.clear();
        },
		
	});
});