sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/Fragment',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	'sap/suite/ui/commons/ProcessFlowNode',
	'sap/m/VBox',
	'sap/m/Text',
	'sap/m/library'
], function(jQuery, Fragment, Controller, JSONModel, MessageToast, ProcessFlowNode, VBox, Text, MobileLibrary) {
	"use strict";

	return Controller.extend("Dashboard.ProcessFlow", {
		onInit: function(oEvent) {
			var oView = this.getView();
			this.oProcessFlow = oView.byId("processflow");

			//checking mock
			if( mock == "X" || mock == "x")
			{
				DataPath =  "/model/mockData";
			}
			else
			{
				DataPath = "/model";
			}

			//Load Plant
			var sSitePath = jQuery.sap.getModulePath("Dashboard", DataPath+"/getSite.irpt");
			
			var oModelSite = new JSONModel(sSitePath);
			oView.setModel(oModelSite,"site");
	

			//Load main model
			if(!Router || !Site) 
			{
								
				this.oModel = new JSONModel();
				this.byId("refreshTime").setText("Click on the filter button to select the plant and the routing");
			}
			else
				{
					this.getView().byId("filter").setVisible(false);
					var sUrl = DataPath+"/processFlow.irpt?Router="+encodeURIComponent(Router)+"&Site="+encodeURIComponent(Site);
					var sDataPath = jQuery.sap.getModulePath("Dashboard", sUrl);
					this.oModel = new JSONModel(sDataPath);
				}
			
			
			oView.setModel(this.oModel);
			
			
			//call the interval function 
		  	this.handleReloadInterval(oEvent);	
			
		},

		onReport: function (oEvent) {
			var oView = this.getView();
			//MessageToast.show("Node " + oEvent.getParameters().getNodeId() + " has been clicked.");
			var sUrl = DataPath+"/getFilelist.irpt";
			var sDataPath = jQuery.sap.getModulePath("Dashboard", sUrl);
			this.oModel = new JSONModel(sDataPath);
			oView.setModel(this.oModel,"files");
	

			// create popover
			if (!this._oPopoverReport) {
				this._oPopoverReport = sap.ui.xmlfragment("Dashboard.report", this);
				this.getView().addDependent(this._oPopoverReport);
			}

			this._oPopoverReport.openBy(oEvent.getSource());
		},

		onTrxSelect: function (oEvent) {
  			transactionPath = oEvent.getSource().getDescription()+"/"+oEvent.getSource().getTitle();
			this.onUpdateModel();
		},
		

		onDefTrxSelect: function (oEvent) {
			transactionPath = "";
			this.onUpdateModel();
		},
		
		onZoomIn: function () {
			this.oProcessFlow.zoomIn();
			MessageToast.show("Zoom level changed to: " + this.oProcessFlow.getZoomLevel());
		},

		onZoomOut: function () {
			this.oProcessFlow.zoomOut();
			MessageToast.show("Zoom level changed to: " + this.oProcessFlow.getZoomLevel());
		},

		onAdvFilter: function (oEvent) {
			// create popover
			if (!this._oPopoverAdvFil) {
				this._oPopoverAdvFil = sap.ui.xmlfragment("Dashboard.advFilter", this);
				this.getView().addDependent(this._oPopoverAdvFil);
			}

			this._oPopoverAdvFil.open(oEvent.getSource());
		},
		onAdvOK: function(oEvent) {
			oEvent.getSource().close();
			sfc = sap.ui.getCore().byId('sfc').getValue();
			opn= sap.ui.getCore().byId('mat').getValue();
			startDate = sap.ui.getCore().byId('StartDate').getValue();
			endDate = sap.ui.getCore().byId('EndDate').getValue();
			qTime= sap.ui.getCore().byId('quickTime').getSelectedKey();
			this.onUpdateModel();
			
		},

		onAdvCancel: function(oEvent) {
		    oEvent.getSource().close();
		},
		
		onAdvReset: function(oEvent) {
			sap.ui.getCore().byId('sfc').setValue("");
			sap.ui.getCore().byId('mat').setValue("");
			sap.ui.getCore().byId('StartDate').setValue("");
			sap.ui.getCore().byId('EndDate').setValue("");
			
			
		    sfc = sap.ui.getCore().byId('sfc').getValue();
			opn = sap.ui.getCore().byId('mat').getValue();
			startDate = sap.ui.getCore().byId('StartDate').getValue();
			endDate = sap.ui.getCore().byId('EndDate').getValue();
			qTime = "";
			oEvent.getSource().setShowResetEnabled(true);
		},

		onNavToProduct : function (oEvent) {
			var oCtxSource = oEvent.getSource();
			var oCtx = oCtxSource.getBindingContext("sfc");
			var sPath = oCtx.getPath();
			
			var oNavCon = Fragment.byId("popoverNavCon", "navCon");
			var oDetailPage = Fragment.byId("popoverNavCon", "detail");
			oNavCon.to(oDetailPage);
			
			oDetailPage.bindElement({path:sPath,model:"sfc"});
		},

		onNavBack : function (oEvent) {
			var oNavCon = Fragment.byId("popoverNavCon", "navCon");
			oNavCon.back();
		},

		onNodePress: function (oEvent) {
			var oView = this.getView();
			//MessageToast.show("Node " + oEvent.getParameters().getNodeId() + " has been clicked.");
			var sUrl = DataPath+"/getSFCAtOpn.irpt?Router="+encodeURIComponent(Router)+"&Site="+encodeURIComponent(Site)+"&Step="+encodeURIComponent(oEvent.getParameters().getNodeId());
			var sDataPath = jQuery.sap.getModulePath("Dashboard", sUrl);
			this.oModel = new JSONModel(sDataPath);
			oView.setModel(this.oModel,"sfc");
	

			// create popover
			if (!this._oPopoverList) {
				this._oPopoverList = sap.ui.xmlfragment("popoverNavCon", "Dashboard.nodeDetail", this);
				this.getView().addDependent(this._oPopoverList);
			}

			this._oPopoverList.open(oEvent.getSource());
		},

		onOK: function(oEvent) {
			this.onNavBack(oEvent);
		       oEvent.getSource().close();
			},

		onCancel: function(oEvent) {
			this.onNavBack(oEvent);
		    oEvent.getSource().close();
			
		},
		
		//OnFilter
		onFilter: function (oEvent) {
			// create popover
			if (!this._oPopoverFilter) {
				this._oPopoverFilter = sap.ui.xmlfragment("Dashboard.filter", this);
				this.getView().addDependent(this._oPopoverFilter);
				
			}
						
			this._oPopoverFilter.openBy(oEvent.getSource());
				
		},

		//On Plant change
		onPlantChange:function (oEvent) {
			var sPlant = sap.ui.getCore().byId('Plant').getSelectedKey();
			var sSitePath = jQuery.sap.getModulePath("Dashboard", DataPath+"/getRouteList.irpt?Plant="+encodeURIComponent(sPlant));
			//var sSitePath = jQuery.sap.getModulePath("Dashboard", DataPath+"/getRouteList.php?Plant="+encodeURIComponent(sPlant));
			var oModelSite = new JSONModel(sSitePath);
			var oView = this.getView();
			oView.setModel(oModelSite,"route");
		},
		
		//on Route Change
		onRoutePress: function (oEvent) {
			var sPlant = sap.ui.getCore().byId('Plant').getSelectedKey();
			Site = sPlant;
			var sRouter= sap.ui.getCore().byId('Routing').getSelectedKey();
			Router = sRouter;
			this.onUpdateModel();
			var sHref = $(location).attr("href");
			sHref = sHref.substring(0,sHref.indexOf("?"));
			sHref = sHref+"?Router="+Router+"&Site="+Site;
			var sText = "Link of "+Site+" - "+Router;
			var oLink  = sap.ui.getCore().byId('urlLink');
			oLink.setHref(sHref);
			oLink.setText(sText);
		},

		onCancelPress: function (oEvent) {
			this._oPopoverFilter.close();
		},
		
		onOkPress: function (oEvent) {
			this._oPopoverFilter.close();
			this.onUpdateModel();
		},

		createProcessFlowNode: function (sId, oContext) {
			
			if((oContext.getProperty("children") !== '---') || (oContext.getProperty("children") != '')) {
				var newArray = $.parseJSON('[' + oContext.getProperty("children") + ']');
			}
			else
			{
				var newArray = null;
			}
			
			
			var aCustomLevelConfigs, fnSetter, oContent, oNode = new ProcessFlowNode(sId, {
					laneId: "{lane}",
					nodeId: "{id}",
					title: "{title}",
					children: newArray,
					state: "{state}",
					stateText: "{stateText}",
					texts: "{texts}",
					titleAbbreviation: "{titleAbbreviation}"
			});
			
			//remove node color
            this.getView().byId(sId).removeStyleClass("holdNode activeNode standbyNode byepassNode idleNode");
			
			//node color change part
			if(oContext.getProperty("hold") == 1) {
			 this.getView().byId(sId).addStyleClass("holdNode");
			}
			else if(oContext.getProperty("inwork") == 1) {
			 this.getView().byId(sId).addStyleClass("activeNode");
			}
			else if(oContext.getProperty("nowork") == 1) {
			 this.getView().byId(sId).addStyleClass("standbyNode");
			}
			else if(oContext.getProperty("quality") == 1) {
			 this.getView().byId(sId).addStyleClass("byepassNode");
			}
			else if(oContext.getProperty("noorder") == 1) {
			 this.getView().byId(sId).addStyleClass("idleNode");
			}

			aCustomLevelConfigs = oContext.getProperty("customLevelConfigs");
			if (aCustomLevelConfigs && aCustomLevelConfigs.length > 0) {
				for (var i = 0; i < aCustomLevelConfigs.length; i++) {
					oContent = this.createCustomContent(i);
					fnSetter = oNode["setZoomLevel" + aCustomLevelConfigs[i].level + "Content"];
					if (fnSetter && typeof fnSetter === "function") {
						fnSetter.call(oNode, oContent);
					}
				}
			}
			return oNode;

		},

		createCustomContent: function (oLevel) {
			var oContent = new VBox({
				items: [
					new Text({
						text: "{customLevelConfigs/" + oLevel + "/customContentTitle}"
					}).addStyleClass("sapUiTinyMarginBottom"),
					new Text({
						text: "{customLevelConfigs/" + oLevel + "/customContentText}"
					})
				],
				renderType: MobileLibrary.FlexRendertype.Bare
			});
			return oContent;
		},

		onUpdateModel: function() {
			sap.ui.core.BusyIndicator.show(10);
			
			var oModel2 = new sap.ui.model.json.JSONModel();
			
			var sUrl = DataPath+"/processFlow.irpt?Router="+encodeURIComponent(Router)+"&Site="+encodeURIComponent(Site)+"&sfc="+encodeURIComponent(sfc)+"&opn="+encodeURIComponent(opn)+"&startDate="+encodeURIComponent(startDate)+"&endDate="+encodeURIComponent(endDate)+"&qTime="+encodeURIComponent(qTime);
			sUrl = sUrl+"&Trx="+transactionPath;
			

			
			var sDataPath = jQuery.sap.getModulePath("Dashboard", sUrl);
			
			oModel2.loadData(sDataPath, null, false);
			this.oView.setModel(oModel2);
			this.oProcessFlow.setModel(oModel2);
			//this.getView().getModel().loadData(sDataPath);

			this.oProcessFlow.updateModel();
			sap.ui.core.BusyIndicator.hide();
			//MessageToast.show("Refresh - "+ new Date($.now()));
			this.byId("refreshTime").setText("Last refresh - "+ new Date($.now()));
		},
		
		handleReloadInterval : function (oEvent) {
			var self = this;
			
			//set the interval
			this.intervalHandle = setInterval(function() {
				self.onUpdateModel();
			},  processFlowReloadInterval); //Call setInterval only once
		},
		
		onExit : function() {
		   // You should stop the interval on exit. 
		   // You should also stop the interval if you navigate out of your view and start it again when you navigate back. 
		   if (this.intervalHandle) 
			  clearInterval(this.intervalHandle) ;
		}
	});
});
