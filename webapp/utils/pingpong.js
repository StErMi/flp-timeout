sap.ui.define([
	"sap/m/MessageBox"
], function(MessageBox) {
	"use strict";
	
	return {
		
		pingPongTimer: null,
		pingPongTimeout: 30000, // 30 seconds

		///////////////////////////////////////////////////////////////////
		//  PINGPONG
		///////////////////////////////////////////////////////////////////
		
		setUpPingPongForOData: function(oDataModel) {
			var that = this;
			oDataModel.attachRequestFailed(function(error){
				if( error.mParameters.response.headers["x-sap-login-page"] ) {
					that.showPingPongDialog();
				}
			});
			oDataModel.attachBatchRequestCompleted( function(res){
			    var jqxhr = res.getParameter("response");
				if( jqxhr.responseText.includes("/sap/hana/xs/formLogin/images/sap.png") ) {
					that.showPingPongDialog();
				}		        
		    });
		},
		
		setUpPingPongForAjax: function() {
			var that = this;
			$( document ).ajaxError(function(event, jqxhr, settings, thrownError) {
				if( jqxhr.responseText.includes("/sap/hana/xs/formLogin/images/sap.png") ) {
					that.showPingPongDialog();
				}
			});
			
			$( document ).ajaxSuccess(function(event, jqxhr, settings, thrownError) {
				if( jqxhr.responseText.includes("/sap/hana/xs/formLogin/images/sap.png") ) {
					that.showPingPongDialog();
				}
			});
		},
		
		init: function(pingTimeoutMS) {
			if( pingTimeoutMS ) {
				this.pingPongTimeout = pingTimeoutMS;
			}
			
			this.checkPingPong = true;
			if( this.pingPongTimer ) {
				return;
			}
			this.pingPongTimer = setInterval(function(){ 
				$.ajax({
		            url: "PATH/TO/PING.xsjs",
		            type: 'GET',
		            dataType: 'json',
		            contentType: 'application/json',
		            success: function (data) {
		            	//that's all fine yay
		            },
		            error: function(jqXHR, textStatus, errorThrown) {
		            }
		        });
			}, this.pingPongTimeout);
		},
		
		clear: function() {
			this.checkPingPong = false;
            clearInterval(this.pingPongTimer);
		},
		
		showPingPongDialog: function() {
			if( !this.checkPingPong ) {
				return;
			}
			if( this.pingPongTimer ) {
				clearInterval(this.pingPongTimer);
				this.pingPongTimer = null;
			}
        	MessageBox.show( this.getModel("i18n").getResourceBundle().getText("sessionExpiredDialogText"), {
				icon: MessageBox.Icon.WARNING,
				title: this.getModel("i18n").getResourceBundle().getText("sessionExpiredDialogTitle"),
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.OK) {
						location.reload();
			        } else {
			        	document.location.href = "/";
			        }
				}
			});
		}
		
	};
});