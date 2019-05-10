// Component pre load
var processFlowReloadInterval = (1 * 60 * 1000); //in seconds 
var intervalHandle = null;
var Router = jQuery.sap.getUriParameters().get("Router") || '';
var Site = jQuery.sap.getUriParameters().get("Site") || '';
var mock = jQuery.sap.getUriParameters().get("mock") || '';
var DataPath = '';
var sfc = '';
var opn = '';
var startDate = '';
var endDate = '';
var qTime = '';
var transactionPath = "";
