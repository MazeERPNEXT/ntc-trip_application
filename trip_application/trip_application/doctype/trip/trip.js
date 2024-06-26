// // Copyright (c) 2023, MazeWorks and contributors
// // For license information, please see license.txt

frappe.ui.form.on('Trip', {
    setup: (frm) => {

		frm.set_query("vehicle_number", () => {
			return {
				query: "trip_application.trip_application.doctype.vehicle_master.vehicle_master.get_available_vehicles",
                
			};
		});
        

	},
    validate: function(frm) {
        var trip_date = frm.doc.trip_date;
        var trip_end_date = frm.doc.trip_end_date;
        var current_date = frappe.datetime.nowdate();

        // if (frm.doc.__islocal){
        //     window.location.reload();
        // }    
        
        
        if (trip_date && trip_end_date) {
            
            var fromDateObj = new Date(trip_date);
            var toDateObj = new Date(trip_end_date);
            

            if (toDateObj < fromDateObj) {
                frappe.msgprint('"Trip End Date" cannot be earlier than "Trip Start Date".');
                frappe.validated = false;
            }

        }

        if (frm.doc.driver_details) {
            for (var i = 0; i < frm.doc.driver_details.length; i++) {
                
                var currentDateObj = new Date(); 

                var fromDateObj = new Date(frm.doc.trip_date);
                var toDateObj = (!!frm.doc.driver_details[i].start_date ? new Date(frm.doc.driver_details[i].start_date) : currentDateObj );
                // console.log(toDateObj)
                if (toDateObj < fromDateObj) {
                    frappe.msgprint('"Driver Details-Start Date" cannot be earlier than "Trip Start Date".');
                    frappe.validated = false;
                    return;
                }
            }
        }

        if (frm.doc.expense_type_child) {
            for (var i = 0; i < frm.doc.expense_type_child.length; i++) {
                var fromDateObj = new Date(frm.doc.trip_date);
                var toDateObj = new Date(frm.doc.expense_type_child[i].expense_date);

                if (toDateObj < fromDateObj) {
                    frappe.msgprint('"Expense Type-Date" cannot be earlier than "Trip Start Date".');
                    frappe.validated = false;
                    return;
                }
            }
        }

        if (frm.doc.driver_details) {
            for (var i = 0; i < frm.doc.driver_details.length; i++) {
                
                var currentDateObj = new Date(); 

                var fromDateObj = new Date(frm.doc.driver_details[i].start_date);
                var toDateObj = (!!frm.doc.driver_details[i].end_date ? new Date(frm.doc.driver_details[i].end_date) : currentDateObj );

                if (toDateObj < fromDateObj) {
                    frappe.msgprint('"Driver Details-End Date" cannot be earlier than "Driver Details-Start Date".');
                    frappe.validated = false;
                    return;
                }
            }
        }
        
        

        

        if (frm.doc.no_of_kms === 0 && !['Started','Cancelled'].includes(frm.doc.status)) {
            frappe.msgprint(__('Zero value is not allowed for "No of KMS"'));
            frappe.validated = false;
            
        }
        if (frm.doc.ending_km === 0 && !['Started','Cancelled'].includes(frm.doc.status)) {
            frappe.msgprint(__('Zero value is not allowed for "Ending KM"'));
            frappe.validated = false;
        }
        if (frm.doc.starting_km === 0) {
            frappe.msgprint(__('Zero value is not allowed for "Starting KM"'));
            frappe.validated = false;
        }

        

            
    },
    
    after_save: function(frm) {
            window.location.reload();

            
    },
    ending_km: function(frm){
        let end_km = parseInt(frm.doc.ending_km);
        let start_km = parseInt(frm.doc.starting_km);
        if(end_km < start_km)
        {
            frappe.msgprint("end KM must be greater than start KM");
            frm.set_value('ending_km',start_km)
        }
        frm.set_value('no_of_kms', end_km - start_km);
    },
    onload: function(frm) {
        
        if (frm.doc.status !== "Started") {
        
            frm.toggle_reqd('trip_end_date', !frm.doc.__islocal);
            frm.toggle_reqd('no_of_kms', !frm.doc.__islocal);
            frm.toggle_reqd('ending_km', !frm.doc.__islocal);

        }   
        
        if (frm.doc.status !== "Started") {
            frm.set_df_property('status', 'read_only', 1);
            frm.set_df_property('starting_km', 'read_only', 1);
            // frm.set_df_property('trip_advance_amount', 'read_only', 1);
        }

        if (frm.doc.status === "Started") {
            // frm.set_df_property('no_of_kms', 'read_only', 1);
            frm.set_df_property('ending_km', 'read_only', 1);
            frm.set_df_property('trip_end_date', 'read_only', 1);
            frm.set_df_property('trip_remarks', 'read_only', 1);
            // frm.set_df_property('trip_advance_amount', 'read_only', 0);

        }


        if (frm.doc.__islocal) {
            // frm.set_df_property('no_of_kms', 'read_only', 1);
            frm.set_df_property('ending_km', 'read_only', 1);
            frm.set_df_property('trip_end_date', 'read_only', 1);
            frm.set_df_property('trip_remarks', 'read_only', 1);
        }
        
        var row = frappe.model.add_child(frm.doc, 'driver_details', 'driver_details'); 
        if (childTableField === 'driver_details') {
            row.driver_name = ''; 
            row.start_date = null; 
            row.end_date = null; 
            
            refresh_field('driver_details'); 
            
        }
        
       },
    status: function(frm) {
        
        if (frm.doc.status === "Started") {
            // frm.set_df_property('no_of_kms', 'read_only', 1);
            frm.set_df_property('ending_km', 'read_only', 1);
            frm.set_df_property('trip_end_date', 'read_only', 1);
            frm.set_df_property('trip_remarks', 'read_only', 1);
            // frm.set_df_property('trip_advance_amount', 'read_only', 0);

            frm.toggle_reqd('trip_end_date', frm.doc.status != "Started");
            frm.toggle_reqd('no_of_kms', frm.doc.status != "Started");
            frm.toggle_reqd('ending_km', frm.doc.status != "Started");
            

            frm.fields_dict['driver_details'].grid.toggle_reqd('end_date', !['Started','Cancelled'].includes(frm.doc.status));    
            
            // frm.fields_dict['driver_details'].grid.toggle_display('end_date', frm.doc.status === 'Started');
        
        }

        if (frm.doc.status === "Cancelled") {

            frm.toggle_reqd('no_of_kms', frm.doc.status != "Cancelled");
            frm.toggle_reqd('ending_km', frm.doc.status != "Cancelled");

            frm.fields_dict['driver_details'].grid.toggle_reqd('end_date', !['Started','Cancelled'].includes(frm.doc.status));

        }

        
        

        if (frm.doc.status !== "Started") {
            // frm.set_df_property('no_of_kms', 'read_only', 0);
            frm.set_df_property('ending_km', 'read_only', 0);
            frm.set_df_property('trip_end_date', 'read_only', 0);
            frm.set_df_property('trip_remarks', 'read_only', 0);
            // frm.set_df_property('trip_advance_amount', 'read_only', 1);

            frm.toggle_reqd('trip_end_date', frm.doc.__islocal || !frm.doc.__islocal);

            frm.fields_dict['driver_details'].grid.toggle_reqd('end_date', !['Started','Cancelled'].includes(frm.doc.status));
            
        }
           

        if (frm.doc.status !== "Cancelled" && frm.doc.status !== "Started") {

            frm.toggle_reqd('no_of_kms', frm.doc.__islocal || !frm.doc.__islocal);
            frm.toggle_reqd('ending_km', frm.doc.__islocal || !frm.doc.__islocal);

        }
        
        

    },

    
    refresh: function(frm) {
        
        if(frm.doc.__islocal){
            frm.set_df_property('status', 'read_only', 1);
        }
        else {
            let options = frm.fields_dict['status'].df.options;
            if(!!options)
            {
                if( typeof(options) == 'string')
                    options = options.split('\n');
                options = options.filter(o => o != 'Started')
                frm.set_df_property('status', 'options', options);
            }
        }

        frm.fields_dict['driver_details'].grid.get_field('driver_name').get_query = function(doc, cdt, cdn) {
            var child = locals[cdt][cdn];
            
            return {
                filters:[['status','=', "Active"],['name','not in',doc.driver_details.map(d => d.driver_name)]]
            };
        };

        

        if (frm.doc.status === "Started") {
            frm.page.set_primary_action("Save",cur_frm.save.bind(cur_frm,"Save"))
            // frm.set_df_property('trip_advance_amount', 'read_only', 0);
        }    

        frm.fields_dict['driver_details'].grid.toggle_reqd('end_date', frm.doc.status !== 'Started');    
            
        // frm.fields_dict['driver_details'].grid.toggle_display('end_date', frm.doc.status === 'Started');
        
        
        frm.fields_dict['driver_details'].grid.toggle_reqd('end_date', !['Started','Cancelled'].includes(frm.doc.status));

        frm.fields_dict['expense_type_child'].grid.get_field('driver_name').get_query = function(doc, cdt, cdn) {
            var child = locals[cdt][cdn];
            return {
                filters: [['name','in', doc.driver_details.map(d => d.driver_name)]]
            };
        };
        
        frm.fields_dict['advance_details'].grid.get_field('driver_name').get_query = function(doc, cdt, cdn) {
            var child = locals[cdt][cdn];
            return {
                filters: [['name','in', doc.driver_details.map(d => d.driver_name)]]
            };
        };
    },
    change_number_nature : function(child, expense_type){
        if(expense_type == 'expense')
            child.expense_amount = Math.abs(child.expense_amount || 0)
        else
            child.advance_amount = Math.abs(child.advance_amount || 0)
        setTimeout(()=>cur_frm.events.calculate_total_and_balance(cur_frm),500);
    },
    change_number_nature : function(child, fuel_expense_type){
        if(fuel_expense_type == 'expense')
            child.fuel_expense_amount = Math.abs(child.fuel_expense_amount || 0)
        else
            child.advance_amount = Math.abs(child.advance_amount || 0)
        setTimeout(()=>cur_frm.events.calculate_total_and_balance(cur_frm),500);
    },

    calculate_total_and_balance:function (frm) {
        var expense_child_table = frm.doc.expense_type_child || [];
        var fuel_child_table = frm.doc.fuel_expense_child || [];
        var advance_child_table = frm.doc.advance_details || [];
    
        var total_expense_amount = expense_child_table.reduce(function(sum, row) {
            return sum + (row.expense_amount || 0);
        }, 0);
    
        var total_fuel_amount = fuel_child_table.reduce(function(sum, row) {
            return sum + (row.fuel_expense_amount || 0);
        }, 0);
    
        var total_advance_amount = advance_child_table.reduce(function(sum, row) {
            return sum + (row.advance_amount || 0);
        }, 0);
    
        var total_trip_amount = total_expense_amount + total_fuel_amount; // Adding both expense and fuel amounts
    
        frappe.model.set_value(frm.doctype, frm.docname, 'trip_amount', total_trip_amount);
        frappe.model.set_value(frm.doctype, frm.docname, 'trip_advance_amount', total_advance_amount);
    
        frappe.model.set_value(frm.doctype, frm.docname, 'balance_amount', parseFloat(total_advance_amount || 0) - parseFloat(total_trip_amount));
    
    },
    fuel_rate_expense:function(frm){
        
        var total_fuel_rate = 0;
        if(frm.doc.fuel_expense_child == undefined){
            return
        }
        frm.doc.fuel_expense_child.forEach(row =>{
            if (row.diesel_consumed_qty && row.rate_per_litre){
                row.fuel_expense_amount = parseFloat(parseFloat((row.diesel_consumed_qty) * (row.rate_per_litre)))
                console.log(row.fuel_expense_amount);   
            }
            else{
                row.fuel_expense_amount = 0;
            }
            total_fuel_rate += fuel_expense_amount;
            console.log(total_fuel_rate);
        }); 
        frm.refresh_field('fuel_expense_child');
        frm.set_value('fuel_expense_child', fuel_expense_child);
        frm.refresh_field();

        // Get the current value of total_trip_amount
    var total_trip_amount = frm.doc.trip_amount || 0;

    // Add total_trip_amount to total_fuel_rate
    total_trip_amount += total_fuel_rate;

    // Set the calculated value to trip_amount field
    frappe.model.set_value(frm.doctype, frm.docname, 'trip_amount', total_trip_amount);

    // Refresh the field
    frm.refresh_field('trip_amount');
},  
});

frappe.ui.form.on('Driver Child Table', {
	// onload: function(frm) {
    //     frm.toggle_reqd('end_date', !frm.doc.__islocal);
    // }    
});


frappe.ui.form.on('Trip Advance Child Table', {

    advance_type: function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        frm.events.change_number_nature(child,'advance')
    },

    advance_amount: function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        frm.events.change_number_nature(child,'advance')
    }

});



frappe.ui.form.on('Trip Expense Type Child Table', {
    expense_type: function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        frm.events.change_number_nature(child, 'expense');
    },

    expense_amount: function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        frm.events.change_number_nature(child, 'expense');
    }
});

frappe.ui.form.on('Fuel Expensive Details', {
    diesel_consumed_qty: function(frm, cdt, cdn) {
        calculateFuelExpenseAmount(frm, cdt, cdn);
    },

    rate_per_litre: function(frm, cdt, cdn) {
        calculateFuelExpenseAmount(frm, cdt, cdn);
    }
});

function calculateFuelExpenseAmount(frm, cdt, cdn) {
    var child = locals[cdt][cdn];
    if (child.diesel_consumed_qty && child.rate_per_litre) {
        var fuel_expense_amount = child.diesel_consumed_qty * child.rate_per_litre;
        frappe.model.set_value(cdt, cdn, 'fuel_expense_amount', fuel_expense_amount);
        setTimeout(()=>cur_frm.events.calculate_total_and_balance(cur_frm),500);
    }
}


// frappe.ui.form.on('Driver Child Table', {
//     onload: function(frm) {
//         // Function to add a static row to the child table 'items'
//         function addStaticRow() {
//             var child = frm.add_child('driver_details', {}); // Adding an empty row
//             // Modify properties of the row if needed
//             child.fieldname = 'driver_name'; // Replace 'fieldname' with your actual field name
//             // Set other field values if required
//             // child.field2 = 'value2';
//             // child.field3 = 'value3';
//         }

//         // Check if it's a new document
//         if (frm.doc.__islocal) {
//             // Add a static row to the child table 'items'
//             addStaticRow();
//         }
//     }
// });



