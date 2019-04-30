sap.ui.define([ "sap/ui/core/UIComponent" ], function(UIComponent) {
	"use strict";

	return UIComponent.extend("Dashboard.Component", {

		metadata: {
			rootView: "Dashboard.ProcessFlow",
			dependencies: {
				libs: [
					"sap.m",
					"sap.ui.layout",
					"sap.ui.core",
					"sap.suite.ui.commons"
				]
			},
			includes : [ "style.css" ],
			config: {
				sample: {
					files: [
						"ProcessFlow.view.xml",
						"ProcessFlow.controller.js",
					            "style.css"
					]
				}
			}
		}
	});
});
