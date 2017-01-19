// ----------------------------------------------------------------------------
// Copyright (c) 2015 Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

/*
** Sample Table Definition - this supports the Azure Mobile Apps
** TodoItem product with authentication and offline sync
*/
var azureMobileApps = require('azure-mobile-apps');
var promises = require('azure-mobile-apps/src/utilities/promises');
var logger = require('azure-mobile-apps/src/logger');

// Create a new table definition
var table = azureMobileApps.table();

// Configure specific code when the client does a request
// READ - only return records belonging to the authenticated user
// table.read(function (context) {
//   context.query.where({ userId: context.user.id });
//   return context.execute();
// });

// CREATE - add or overwrite the userId based on the authenticated user
// table.insert(function (context) {
//   context.item.userId = context.user.id;
//   return context.execute();
// });

table.insert(function(context){
	logger.info('Running TodoItem.insert');
	
	var payload = {
		"data":{
			"message":context.item.text
		}
	};
	
	return context.execute()
		.then(function(results){
			// only do the push if configured
			if(context.push){
				// send GCM native notification
				context.push.gcm.send(null, payload, function(error){
					if(error){
						logger.error('Error while sending push notification: ', error);
					}else{
						logger.info('Push notification sent successfully!');
					}
				});
			}
			return results;
		})
		.catch(function(error){
			logger.error('Error while running context.execute: ', error);
		});
});

// UPDATE - for this scenario, we don't need to do anything - this is
// the default version
//table.update(function (context) {
//  return context.execute();
//});

// DELETE - for this scenario, we don't need to do anything - this is
// the default version
//table.delete(function (context) {
//  return context.execute();
//});

// Finally, export the table to the Azure Mobile Apps SDK - it can be
// read using the azureMobileApps.tables.import(path) method

module.exports = table;