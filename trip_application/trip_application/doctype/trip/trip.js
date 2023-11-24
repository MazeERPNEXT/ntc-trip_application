// // Copyright (c) 2023, MazeWorks and contributors
// // For license information, please see license.txt

frappe.ui.form.on('Trip', {
    
    setup: (frm) => {

		frm.set_query("vehicle_number", () => {
			return {
				query: "trip_application.trip_application.doctype.vehicle_master.vehicle_master.get_available_vehicles",
                
			};
		});
        
        // frm.set_query("driver_name",'expense_type_child', () => {
		// 	return {
		// 		query: "trip_application.trip_application.doctype.driver_master.driver_master.get_available_driver",//get_available_exp_driver",
                
		// 	};
		// });
        // window.location.reload();

	},
    validate: function(frm) {
        var trip_date = frm.doc.trip_date;
        var trip_end_date = frm.doc.trip_end_date;
        var current_date = frappe.datetime.nowdate();

        // if (frm.doc.__islocal){
        //     window.location.reload();
        // }    
        
        // Validate To Date against From Date and Current Date
        if (trip_date && trip_end_date) {
            // Convert date strings to JavaScript Date objects for comparison
            var fromDateObj = new Date(trip_date);
            var toDateObj = new Date(trip_end_date);
            var currentDateObj = new Date(current_date);

            // Compare dates and show an error message if To Date is earlier than From Date
            if (toDateObj < fromDateObj) {
                frappe.msgprint('"Trip End Date" cannot be earlier than "Trip Start Date".');
                frappe.validated = false;
            }

            // Show an error message if To Date is before the current date
            // if (toDateObj < currentDateObj) {
            //     frappe.msgprint('Trip End Date cannot be in the past.');
            //     frappe.validated = false;
            // }
        }
        // console.log(cur_frm.doc.trip_end_date)
        // if (cur_frm.doc.trip_end_date && cur_frm.doc.__islocal) {
        //     cur_frm.toggle_reqd('trip_end_date', 1); // Make trip_end_date mandatory during update
        //     frappe.msgprint('"Trip End Date"');
        // }
    },
    onload: function(frm) {
        frm.toggle_reqd('trip_end_date', !frm.doc.__islocal);
        frm.toggle_reqd('no_of_kms', !frm.doc.__islocal);



        
        
        
        // console.log('Trip form loaded'); // Check if onload event is triggered

        // // Function to set the filter
        // frm.cscript.setDriverNameFilter = function(driverName) {
        //     console.log('Setting filter for driver_name:', driverName);
        //     frm.fields_dict['expense_type_child'].grid.get_field('driver_name').get_query = function() {
        //         return {
        //             filters: {
        //                 'driver_name': driverName // Apply filter based on driverName
        //             }
        //         };
        //     };
        // };

        // // Listen for changes in driver_details and set the filter accordingly
        // frm.cscript.driver_details_on_form_rendered = function(doc, cdt, cdn) {
        //     var driverDetails = locals[cdt][cdn];
        //     frm.cscript.setDriverNameFilter(driverDetails.driver_name);
        // };

        // // Reapply filter on refresh
        // frm.cscript.refresh = function(doc) {
        //     var driverDetails = frm.doc.driver_details || [];
        //     if (driverDetails.length > 0) {
        //         frm.cscript.setDriverNameFilter(driverDetails[0].driver_name);
        //     }
        // };







    },
    
    refresh: function(frm) {
        
        frm.fields_dict['driver_details'].grid.get_field('driver_name').get_query = function(doc, cdt, cdn) {
            var child = locals[cdt][cdn];
            return {
                filters:[['status','=', "Active"],['name','not in',doc.driver_details.map(d => d.driver_name)]]
            };
        };

        frm.fields_dict['expense_type_child'].grid.get_field('driver_name').get_query = function(doc, cdt, cdn) {
            var child = locals[cdt][cdn];
            return {
                filters: [['name','in', doc.driver_details.map(d => d.driver_name)]]
            };
        };

    

        
    }
       
    
    
    
});



frappe.ui.form.on('Trip Expense Type Child Table', {
    expense_amount: function(frm, cdt, cdn) {
        
        var child = locals[cdt][cdn];

        var child_table = frm.doc.expense_type_child || [];
        // console.log(child_table);

        var total_amount = child_table.reduce(function(sum, row) {
            return sum + (row.expense_amount || 0);
        }, 0);

        frappe.model.set_value(frm.doctype, frm.docname, 'trip_amount', total_amount);
    }

});

