sap.ui.define([
	"sap/m/MessageBox"
], function(MessageBox) {
	"use strict";
	
	return {
		
		/* Timer reference */
		pingPongTimer: null,
		
		/* How many MS should I do the timeout check request? */
		pingPongTimeout: 30000, // 30 seconds
		
		/* Setup which url should be pinged to check if the session is still alive */
		flpSessionPingUrl: null,

		///////////////////////////////////////////////////////////////////
		//  PINGPONG
		///////////////////////////////////////////////////////////////////
		
		/**
		 * Setup ping mechanism on the odata model
		 *
		 * @param {Object} oDataModel
		 * @public
		 */
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
		
		/**
		 * Setup ping mechanism on Ajax requests
		 *
		 * @public
		 */
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
		
		/**
		 * Init the pingpong session check
		 *
		 * @param {String} sFLPSessionPingUrl, url used to determinate if the session is alive
		 * @param {int} iPingTimeoutMS, how many times do you want to check if the session is expired?
		 * @public
		 */
		init: function(sFLPSessionPingUrl, iPingTimeoutMS) {
			var that = this;
			
			this.flpSessionPingUrl = sFLPSessionPingUrl;
			if( iPingTimeoutMS ) {
				this.pingPongTimeout = iPingTimeoutMS;
			}
			
			this.checkPingPong = true;
			if( this.pingPongTimer ) {
				return;
			}
			this.pingPongTimer = setInterval(function(){ 
				$.ajax({
		            url: that.flpSessionPingUrl,
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
		
		/**
		 * Stop the pingpong session
		 *
		 * @public
		 */
		clear: function() {
			this.checkPingPong = false;
            clearInterval(this.pingPongTimer);
		},
		
		/**
		 * Show the session expired timeout. User will be forced to reload the page
		 *
		 * @public
		 */
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