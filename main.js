/* jshint -W097 */// jshint strict:false
/*jslint node: true */
"use strict";

const eiscp = require('eiscp');
const xml2js = require('xml2js');
var fs = require('fs');
var parser = new xml2js.Parser({ explicitArray: true });

// you have to require the adapter module and pass a options object
const utils = require('@iobroker/adapter-core'); // Get common adapter utils

const objects = {};
const volume = {};
var xmlstring = '';
var xjs = '';
var sequenz = '';
var imageb64 = '';


//const adapter = utils.Adapter('onkyo-vis');    // name has to be set and has to be equal to adapters folder name and main file name excluding extension
var adapter = utils.Adapter({    
	// name has to be set and has to be equal to adapters folder name and main file name excluding extension
    name:  'onkyo',
	// is called if a subscribed state changes
	//adapter.on('stateChange', (id, state) => {
	stateChange: function (id, state) {	
    adapter.log.debug('stateChange ' + id + ' ' + JSON.stringify(state));
    // is called if a subscribed state changes
        if (state && !state.ack) {
			adapter.log.debug('ack is not set!');
			adapter.log.debug('Value: ' + state.val);
			adapter.log.debug('id: ' + id);
		
			if (id == adapter.namespace + '.' +'Device.command') {
					var newcommand = state.val;
						adapter.log.debug('newcommand: ' + newcommand);
			if (newcommand) {				
                eiscp.raw(newcommand);
				}		
			} else {
                        
          // Here we go and send command from accepted Objects to command var
		   			  
			  // SET RAW EISCP COMMAND
              if (id == adapter.namespace + '.' +'Device.RAW') {
                new_val = state.val;
				adapter.log.debug('Send RAW to Receiver: ' + new_val);
				adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
				adapter.setState (adapter.namespace + '.' + 'Device.RAW', {val: null, ack: true});
                  }
			  
			  // Volume Zone1
              if (id == adapter.namespace + '.' +'Zone1.Volume') {
              var new_val = parseInt(state.val);  //string to integer
                if (new_val >= adapter.config.maxvolzone1)
                {
                  new_val = adapter.config.maxvolzone1;
                  adapter.log.info('>>> Limit max volume zone 1 to: ' + new_val);
                  adapter.log.info('>>> see in adapter config for limits');
                }              
              new_val = decimalToHex(new_val).toUpperCase();  //call function decimalToHex();
              new_val = 'MVL' + new_val;
              adapter.log.debug('new_val: ' + new_val);
			  adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
                  }

                // Volume Zone2
                if (id == adapter.namespace + '.' +'Zone2.Volume') {
                    var new_val = parseInt(state.val);  //string to integer
                    if (new_val >= adapter.config.maxvolzone2)
                    {
                        new_val = adapter.config.maxvolzone2;
                        adapter.log.info('>>> Limit max volume zone 2 to: ' + new_val);
                        adapter.log.info('>>> see in adapter config for limits');
                    }
                    new_val = decimalToHex(new_val).toUpperCase();  //call function decimalToHex();
                    new_val = 'ZVL' + new_val;
                    adapter.log.debug('new_val: ' + new_val);
                    adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
                }

                // Volume Zone3
                if (id == adapter.namespace + '.' +'Zone3.Volume') {
                    var new_val = parseInt(state.val);  //string to integer
                    if (new_val >= adapter.config.maxvolzone3)
                    {
                        new_val = adapter.config.maxvolzone3;
                        adapter.log.info('>>> Limit max volume zone 3 to: ' + new_val);
                        adapter.log.info('>>> see in adapter config for limits');
                    }
                    new_val = decimalToHex(new_val).toUpperCase();  //call function decimalToHex();
                    new_val = 'VL3' + new_val;
                    adapter.log.debug('new_val: ' + new_val);
                    adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
                }

              // Audio_Mute_Zone1                    
              if (id == adapter.namespace + '.' +'Zone1.Mute') {
                  new_val = state.val;
              adapter.log.debug('new_val: ' + new_val);
                  if (new_val == true) {
                      new_val = '01';
                      }
              if  (new_val == false) {
                    new_val = '00';
                      } 
              new_val = 'AMT' + new_val;
              adapter.log.debug('new_val: ' + new_val);
              adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
                  }

                // Audio_Mute_Zone2
                if (id == adapter.namespace + '.' +'Zone2.Mute') {
                    new_val = state.val;
                    if (new_val == true) {
                        new_val = '01';
                    }
                    if  (new_val == false) {
                        new_val = '00';
                    }
                    new_val = 'ZMT' + new_val;
                    adapter.log.debug('new_val: ' + new_val);
                    adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
                }

                // Audio_Mute_Zone3
                if (id == adapter.namespace + '.' +'Zone3.Mute') {
                    new_val = state.val;
                    if (new_val == true) {
                        new_val = '01';
                    }
                    if  (new_val == false) {
                        new_val = '00';
                    }
                    new_val = 'MT3' + new_val;
                    adapter.log.debug('new_val: ' + new_val);
                    adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
                }

                // Input_Select_Zone1       SLI
              if (id == adapter.namespace + '.' +'Zone1.InputSelect') {
                  new_val = state.val;
                  new_val = 'SLI' + new_val;
              adapter.log.debug('new_val: ' + new_val);
              adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
                  }

                // Input_Select_Zone2       SLZ
                if (id == adapter.namespace + '.' +'Zone2.InputSelect') {
                    new_val = state.val;
                    new_val = 'SLZ' + new_val;
                    adapter.log.debug('new_val: ' + new_val);
                    adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
                }

                // Input_Select_Zone3       SL3
                if (id == adapter.namespace + '.' +'Zone3.InputSelect') {
                    new_val = state.val;
                    new_val = 'SL3' + new_val;
                    adapter.log.debug('new_val: ' + new_val);
                    adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
                }
                          
              // Internet_Radio_Preset_Zone1   NPR                  
              if (id == adapter.namespace + '.' +'Zone1.NetRadioPreset') {
              var new_val = parseInt(state.val);  //string to integer
              new_val = decimalToHex(state.val).toUpperCase();  //call function decimalToHex();
              new_val = 'NPR' + new_val;
              adapter.log.debug('new_val: ' + new_val);
              adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
			  adapter.setState (adapter.namespace + '.' + 'Device.command', {val: 'SLI2B', ack: false});
                  }

              // Internet_Radio_Preset_Zone2   NPZ
              if (id == adapter.namespace + '.' +'Zone2.NetRadioPreset') {
              var new_val = parseInt(state.val);  //string to integer
              new_val = decimalToHex(state.val).toUpperCase();  //call function decimalToHex();
              new_val = 'NPZ' + new_val;
              adapter.log.debug('new_val: ' + new_val);
              adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
			  adapter.setState (adapter.namespace + '.' + 'Device.command', {val: 'SLZ2B', ack: false});
			  adapter.setState (adapter.namespace + '.' + 'Device.command', {val: 'ZVLQSTN', ack: false});
                  }

                // Internet_Radio_Preset_Zone3   NP3
                if (id == adapter.namespace + '.' +'Zone3.NetRadioPreset') {
                    var new_val = parseInt(state.val);  //string to integer
                    new_val = decimalToHex(state.val).toUpperCase();  //call function decimalToHex();
                    new_val = 'NP3' + new_val;
                    adapter.log.debug('new_val: ' + new_val);
                    adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
                    adapter.setState (adapter.namespace + '.' + 'Device.command', {val: 'SL32B', ack: false});
                    adapter.setState (adapter.namespace + '.' + 'Device.command', {val: 'VL3QSTN', ack: false});
                }

                // Tuner_Preset_Zone1  PRS
              if (id == adapter.namespace + '.' +'Zone1.TunerPreset') {
              var new_val = parseInt(state.val);  //string to integer
              new_val = decimalToHex(state.val).toUpperCase();  //call function decimalToHex();
              new_val = 'PRS' + new_val;
              adapter.log.debug('new_val: ' + new_val);
              adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
			  adapter.setState (adapter.namespace + '.' + 'Device.command', {val: 'SLI24', ack: false});
                  }

                // Tuner_Preset_Zone2  PRZ
                if (id == adapter.namespace + '.' +'Zone2.TunerPreset') {
                    var new_val = parseInt(state.val);  //string to integer
                    new_val = decimalToHex(state.val).toUpperCase();  //call function decimalToHex();
                    new_val = 'PRZ' + new_val;
                    adapter.log.debug('new_val: ' + new_val);
                    adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
                    adapter.setState (adapter.namespace + '.' + 'Device.command', {val: 'SLZ24', ack: false});
                    adapter.setState (adapter.namespace + '.' + 'Device.command', {val: 'ZVLQSTN', ack: false});
                }

                // Tuner_Preset_Zone3  PR3
                if (id == adapter.namespace + '.' +'Zone3.TunerPreset') {
                    var new_val = parseInt(state.val);  //string to integer
                    new_val = decimalToHex(state.val).toUpperCase();  //call function decimalToHex();
                    new_val = 'PR3' + new_val;
                    adapter.log.debug('new_val: ' + new_val);
                    adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
                    adapter.setState (adapter.namespace + '.' + 'Device.command', {val: 'SL324', ack: false});
                    adapter.setState (adapter.namespace + '.' + 'Device.command', {val: 'VL3QSTN', ack: false});
                }

                // Power_Zone1    PWR
              if (id == adapter.namespace + '.' +'Zone1.Power') {
                  new_val = state.val;
                  if (new_val == true) {
                      new_val = '01';
                      }
              if  (new_val == false) {
                    new_val = '00';
                      } 
              new_val = 'PWR' + new_val;
              adapter.log.debug('new_val: ' + new_val);
              adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
                  }

                // Power_Zone2    ZPW
                if (id == adapter.namespace + '.' +'Zone2.Power') {
                    new_val = state.val;
                    if (new_val == true) {
                        new_val = '01';
                    }
                    if  (new_val == false) {
                        new_val = '00';
                    }
                    new_val = 'ZPW' + new_val;
                    adapter.log.debug('new_val: ' + new_val);
                    adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
                    adapter.setState (adapter.namespace + '.' + 'Device.command', {val: 'ZVLQSTN', ack: false});
                }

                // Power_Zone3    PW3
                if (id == adapter.namespace + '.' +'Zone3.Power') {
                    new_val = state.val;
                    if (new_val == true) {
                        new_val = '01';
                    }
                    if  (new_val == false) {
                        new_val = '00';
                    }
                    new_val = 'PW3' + new_val;
                    adapter.log.debug('new_val: ' + new_val);
                    adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
                    adapter.setState (adapter.namespace + '.' + 'Device.command', {val: 'VL3QSTN', ack: false});
                }

                //Onkyo_Tune_Zone1
				if (id == adapter.namespace + '.' +'Zone1.Tune')  {
					new_val = state.val;
					//load string in array
					var arr = new Array(
								'SLI24',
								'TUNDIRECT',
								'TUN' + new_val.substr(0,1),
								'TUN' + new_val.substr(1,1),
								'TUN' + new_val.substr(2,1),
								'TUN' + new_val.substr(4,1),
								'TUN' + new_val.substr(5,1),
								'TUZQSTN'
								);
			
      setTimeout(function () {
            // send array to command object
            for (var i = 0; i < arr.length; i++) {
				adapter.log.debug('Tune to: ' + arr[i]);
                adapter.setState (adapter.namespace + '.' + 'Device.command', {val: arr[i], ack: false});
                }
        }, 10);
				adapter.setState (adapter.namespace + '.' + 'Device.command', {val: 'TUZQSTN', ack: false});
                    }
					
			//Onkyo_Tune_Zone2
				if (id == adapter.namespace + '.' +'Zone2.Tune')  {
					new_val = state.val;
					//load string in array
					var arr = new Array(
								'SLZ24',
								'TUZDIRECT',
								'TUZ' + new_val.substr(0,1),
								'TUZ' + new_val.substr(1,1),
								'TUZ' + new_val.substr(2,1),
								'TUZ' + new_val.substr(4,1),
								'TUZ' + new_val.substr(5,1),
								'TUZQSTN'
								);
			
      setTimeout(function () {
            // send array to command object
            for (var i = 0; i < arr.length; i++) {
				adapter.log.debug('Tune to: ' + arr[i]);
                adapter.setState (adapter.namespace + '.' + 'Device.command', {val: arr[i], ack: false});
                }
        }, 10);
                    }

                //Onkyo_Tune_Zone3
                if (id == adapter.namespace + '.' +'Zone3.Tune')  {
                    new_val = state.val;
                    //load string in array
                    var arr = new Array(
                        'SL324',
                        'TU3DIRECT',
                        'TU3' + new_val.substr(0,1),
                        'TU3' + new_val.substr(1,1),
                        'TU3' + new_val.substr(2,1),
                        'TU3' + new_val.substr(4,1),
                        'TU3' + new_val.substr(5,1),
                        'TU3QSTN'
                    );

                    setTimeout(function () {
                        // send array to command object
                        for (var i = 0; i < arr.length; i++) {
                            adapter.log.debug('Tune to: ' + arr[i]);
                            adapter.setState (adapter.namespace + '.' + 'Device.command', {val: arr[i], ack: false});
                        }
                    }, 10);
                }



			// NET USB Play
              if (id == adapter.namespace + '.' +'Device.MediaPlay') {
                  new_val = state.val;
                  if (new_val == true) {
                      new_val = 'PLAY';
                      }
              new_val = 'NTC' + new_val;
              adapter.log.debug('new_val: ' + new_val);
              adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
                  } 
            // NET USB Pause
              if (id == adapter.namespace + '.' +'Device.MediaPause') {
                  new_val = state.val;
                  if (new_val == true) {
                      new_val = 'PAUSE';
                      }
              new_val = 'NTC' + new_val;
              adapter.log.debug('new_val: ' + new_val);
              adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
                  } 
            // NET USB Stop
              if (id == adapter.namespace + '.' +'Device.MediaStop') {
                  new_val = state.val;
                  if (new_val == true) {
                      new_val = 'STOP';
                      }
              new_val = 'NTC' + new_val;
              adapter.log.debug('new_val: ' + new_val);
              adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
                  } 
			// NET USB Track Up
              if (id == adapter.namespace + '.' +'Device.MediaTrackUp') {
                  new_val = state.val;
                  if (new_val == true) {
                      new_val = 'TRUP';
                      }
              new_val = 'NTC' + new_val;
              adapter.log.debug('new_val: ' + new_val);
              adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
			  adapter.setState (adapter.namespace + '.' + 'Device.MediaTrackUp', {val: "", ack: true});
                  }	  
			// NET USB Track Down
              if (id == adapter.namespace + '.' +'Device.MediaTrackDown') {
                  new_val = state.val;
                  if (new_val == true) {
                      new_val = 'TRDN';
                      }
              new_val = 'NTC' + new_val;
              adapter.log.debug('new_val: ' + new_val);
              adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
			  adapter.setState (adapter.namespace + '.' + 'Device.MediaTrackDown', {val: "", ack: true});
                  }	
			// NET USB Right
              if (id == adapter.namespace + '.' +'Device.MediaRight') {
                  new_val = state.val;
                  if (new_val == true) {
                      new_val = 'RIGHT';
                      }
              new_val = 'NTC' + new_val;
              adapter.log.debug('new_val: ' + new_val);
              adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
			  adapter.setState (adapter.namespace + '.' + 'Device.MediaRight', {val: "", ack: true});
                  }	
			// NET USB Left
              if (id == adapter.namespace + '.' +'Device.MediaLeft') {
                  new_val = state.val;
                  if (new_val == true) {
                      new_val = 'LEFT';
                      }
              new_val = 'NTC' + new_val;
              adapter.log.debug('new_val: ' + new_val);
              adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
			  adapter.setState (adapter.namespace + '.' + 'Device.MediaLeft', {val: "", ack: true});
                  }		  
			// NET USB Up
              if (id == adapter.namespace + '.' +'Device.MediaUp') {
                  new_val = state.val;
                  if (new_val == true) {
                      new_val = 'UP';
                      }
              new_val = 'NTC' + new_val;
              adapter.log.debug('new_val: ' + new_val);
              adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
			  adapter.setState (adapter.namespace + '.' + 'Device.MediaUp', {val: "", ack: true});
                  }	
			// NET USB Down
              if (id == adapter.namespace + '.' +'Device.MediaDown') {
                  new_val = state.val;
                  if (new_val == true) {
                      new_val = 'DOWN';
                      }
              new_val = 'NTC' + new_val;
              adapter.log.debug('new_val: ' + new_val);
              adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
			  adapter.setState (adapter.namespace + '.' + 'Device.MediaDown', {val: "", ack: true});
                  }		  
			// NET USB Select
              if (id == adapter.namespace + '.' +'Device.MediaSelect') {
                  new_val = state.val;
                  if (new_val == true) {
                      new_val = 'SELECT';
                      }
              new_val = 'NTC' + new_val;
              adapter.log.debug('new_val: ' + new_val);
              adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
			  adapter.setState (adapter.namespace + '.' + 'Device.MediaSelect', {val: "", ack: true});
                  }	
			// NET USB Delete
              if (id == adapter.namespace + '.' +'Device.MediaDelete') {
                  new_val = state.val;
                  if (new_val == true) {
                      new_val = 'DELETE';
                      }
              new_val = 'NTC' + new_val;
              adapter.log.debug('new_val: ' + new_val);
              adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
			  adapter.setState (adapter.namespace + '.' + 'Device.MediaDelete', {val: "", ack: true});
                  }		  
			// NET USB Return
              if (id == adapter.namespace + '.' +'Device.MediaReturn') {
                  new_val = state.val;
                  if (new_val == true) {
                      new_val = 'RETURN';
                      }
              new_val = 'NTC' + new_val;
              adapter.log.debug('new_val: ' + new_val);
              adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
			  adapter.setState (adapter.namespace + '.' + 'Device.MediaReturn', {val: "", ack: true});
                  }	
			// NET USB Menu
              if (id == adapter.namespace + '.' +'Device.MediaMenu') {
                  new_val = state.val;
                  if (new_val == true) {
                      new_val = 'MENU';
                      }
              new_val = 'NTC' + new_val;
              adapter.log.debug('new_val: ' + new_val);
              adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
			  adapter.setState (adapter.namespace + '.' + 'Device.MediaMenu', {val: "", ack: true});
                  }		  
			// NET USB Top
              if (id == adapter.namespace + '.' +'Device.MediaTop') {
                  new_val = state.val;
                  if (new_val == true) {
                      new_val = 'TOP';
                      }
              new_val = 'NTC' + new_val;
              adapter.log.debug('new_val: ' + new_val);
              adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
			  adapter.setState (adapter.namespace + '.' + 'Device.MediaTop', {val: "", ack: true});
                  }		  
				  
				  
				  
			 /* THIS PART MUST BE REALIZED LATER (100ms continuously)
			 
			 // NET USB Reverse - Continuesly must be send faster 100ms
              if (id == adapter.namespace + '.' +'Device.MediaReverse') {
                  new_val = state.val;
                  if (new_val == true) {
                      new_val = 'REW';
                      }
              new_val = 'NTC' + new_val;
              adapter.log.debug('new_val: ' + new_val);
              adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
                  } 	  
            // NET USB Forward - Continuesly must be send faster 100ms
              if (id == adapter.namespace + '.' +'Device.MediaForward') {
                  new_val = state.val;
                  if (new_val == true) {
                      new_val = 'FF';
                      }
              new_val = 'NTC' + new_val;
              adapter.log.debug('new_val: ' + new_val);
              adapter.setState (adapter.namespace + '.' + 'Device.command', {val: new_val, ack: false});
                  } 
             */  
			
           }       
        }
	},

  // is called when adapter shuts down - callback has to be called under any circumstances!
    unload: function (callback) {
        try {
            eiscp.close();
        } finally {
            callback();
        }
    },

    ready: function () {
        adapter.subscribeStates('*');
        main();
    }
});

			
			

function decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;
}
   
function main() {
         
    // The adapters config (in the instance object everything under the attribute "native") is accessible via
    // adapter.config:
    eiscp.on("error", function (e) {
        adapter.log.error("Error: " + e);
    });

    // Try to read all states
    adapter.getStatesOf(function (err, objs) {
        if (objs) {
            for (var i = 0; i < objs.length; i++) {
                objects[objs[i]._id] = objs[i];
            }
        }

        const options = {reconnect: true, verify_commands: false};

        if (adapter.config.avrAddress) {
            adapter.log.info('Connecting to AVR ' + adapter.config.avrAddress + ':' + adapter.config.avrPort);
            options.host = adapter.config.avrAddress;
            options.port = adapter.config.avrPort;
        } else {
            adapter.log.info('Starting AVR discovery');
        }

        // Connect to receiver
        eiscp.connect(options);
    });

    eiscp.on('connect', function () {
        adapter.log.info('Successfully connected to AVR');
        adapter.setState('Device.connected', {val: true, ack: true});

        // Query some initial information
        
		var datapoints = new Array(
      'PWRQSTN',
      'MVLQSTN',
		  'ZVLQSTN',
		  'IFAQSTN',
      'SLIQSTN',
		  'SLZQSTN',
		  'ZMTQSTN',
		  'AMTQSTN',
		  'NSTQSTN',
		  'NPRQSTN',
		  'NPZQSTN',
		  'LMDQSTN',
		  'NALQSTN',
		  'NATQSTN',
		  'NTMQSTN',
		  'NTIQSTN',
		  'NTRQSTN',
		  'PRSQSTN',
		  'PRZQSTN',
		  'TUNQSTN',
		  'TUZQSTN',
		  'IFVQSTN',
		  'SLAQSTN',
		  'NRIQSTN'
          );
	
        
        setTimeout(function () {
            // Try to read initial values
            for (var i = 0; i < datapoints.length; i++) {
                adapter.setState (adapter.namespace + '.' + 'Device.command', {val: datapoints[i], ack: false});
                }
        }, 5000);
    });

    eiscp.on('close', function () {
        adapter.log.info("AVR disconnected");
        adapter.setState("connected", {val: false, ack: true});
    });

    eiscp.on("data", function (cmd) {
        adapter.log.debug('Got message: ' + JSON.stringify(cmd));
        adapter.log.debug('EISCP String: ' + cmd.iscp_command);
    // Here we go to select the RAW feedback and take it to the right variable. The RAW is in cmd.iscp_command
  
        var chunk = cmd.iscp_command.substr(0,3);
        var string = 	cmd.iscp_command.substr(3,80);

        // If a string don't comes clean from eiscp happens on NLAX....
        if (string.includes("ISCP")) {
         string = string.substring(0, (string.indexOf('ISCP')))
                                    }        
 
        adapter.log.debug('chunk: ' + chunk);
        adapter.log.debug('string: ' + string); 

	// SET command with received info
	adapter.setState (adapter.namespace + '.' + 'Device.command', {val: cmd.iscp_command, ack: true});
   
     //Onkyo_Power_Zone1
    if (chunk == 'PWR')  {
      string = parseInt(string);                   //convert string to integer
    if (string == '1') {
      adapter.setState (adapter.namespace + '.' + 'Zone1.Power', {val: true, ack: true});
                        }
    if (string == '0') {
      adapter.setState (adapter.namespace + '.' + 'Zone1.Power', {val: false, ack: true});
                        }                                              
                    }
        //Onkyo_Power_Zone2
        if (chunk == 'ZPW')  {
            string = parseInt(string);                   //convert string to integer
            if (string == '1') {
                adapter.setState (adapter.namespace + '.' + 'Zone2.Power', {val: true, ack: true});
            }
            if (string == '0') {
                adapter.setState (adapter.namespace + '.' + 'Zone2.Power', {val: false, ack: true});
            }
        }

        //Onkyo_Power_Zone3
        if (chunk == 'PW3')  {
            string = parseInt(string);                   //convert string to integer
            if (string == '1') {
                adapter.setState (adapter.namespace + '.' + 'Zone3.Power', {val: true, ack: true});
            }
            if (string == '0') {
                adapter.setState (adapter.namespace + '.' + 'Zone3.Power', {val: false, ack: true});
            }
        }

    //Audio information
      if (chunk == 'IFA')  {  
      adapter.setState (adapter.namespace + '.' + 'Device.AudioInformation', {val: string, ack: true});
                    }                    
    //Net Play Status
      if (chunk == 'NST')  {
        var nst_play = string.substr(0,1);         //Play status    (S=Stop,P=Play,p=pause,F,FF,R,FR)
        var nst_repeat = string.substr(1,1);       //Repeat status  (-=Off,R=All,F=Folder,1=Repeat 1)
        var nst_shuffle = string.substr(2,1);      //Shuffle status (-=Off,S=All,A=Album,F=Folder)
		//NET_Play_Status
		switch (nst_play) {
			case 'S' : 
				adapter.setState (adapter.namespace + '.' + 'Device.MediaStop', {val: true, ack: true});
				// set other false
				adapter.setState (adapter.namespace + '.' + 'Device.MediaPlay', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaPause', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaForward', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaFastForward', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaReverse', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaFastReverse', {val: false, ack: true});
			break;
			
			case 'P' : 
				adapter.setState (adapter.namespace + '.' + 'Device.MediaPlay', {val: true, ack: true});
				// set other false
				adapter.setState (adapter.namespace + '.' + 'Device.MediaStop', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaPause', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaForward', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaFastForward', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaReverse', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaFastReverse', {val: false, ack: true});
			break;
			
			case 'p' : 
				adapter.setState (adapter.namespace + '.' + 'Device.MediaPause', {val: true, ack: true});
				// set other false
				adapter.setState (adapter.namespace + '.' + 'Device.MediaStop', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaPlay', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaForward', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaFastForward', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaReverse', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaFastReverse', {val: false, ack: true});
			break;
			
			case 'F' : 
				adapter.setState (adapter.namespace + '.' + 'Device.MediaForward', {val: true, ack: true});
				// set other false
				adapter.setState (adapter.namespace + '.' + 'Device.MediaStop', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaPlay', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaPause', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaFastForward', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaReverse', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaFastReverse', {val: false, ack: true});
			break;
			
			case 'FF' :
				adapter.setState (adapter.namespace + '.' + 'Device.MediaFastForward', {val: true, ack: true});
				// set other false
				adapter.setState (adapter.namespace + '.' + 'Device.MediaStop', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaPlay', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaPause', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaForward', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaReverse', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaFastReverse', {val: false, ack: true});
			break;
		
			case 'R' :
				adapter.setState (adapter.namespace + '.' + 'Device.MediaReverse', {val: true, ack: true});
				// set other false
				adapter.setState (adapter.namespace + '.' + 'Device.MediaStop', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaPlay', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaPause', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaForward', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaFastForward', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaFastReverse', {val: false, ack: true});
			break;
		
			case 'FR' :
				adapter.setState (adapter.namespace + '.' + 'Device.MediaFastReverse', {val: true, ack: true});
				// set other false
				adapter.setState (adapter.namespace + '.' + 'Device.MediaStop', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaPlay', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaPause', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaForward', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaFastForward', {val: false, ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaReverse', {val: false, ack: true});
			break;
    }
		
		switch (nst_repeat) {
			case '-' : 	
				adapter.setState (adapter.namespace + '.' + 'Device.MediaState', {val: 'Off', ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaRepeat', {val: false, ack: true});
				break;
			case 'R' :
				adapter.setState (adapter.namespace + '.' + 'Device.MediaState', {val: 'All', ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaRepeat', {val: true, ack: true});
				break;
			case 'F' :
				adapter.setState (adapter.namespace + '.' + 'Device.MediaState', {val: 'Folder', ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaRepeat', {val: true, ack: true});
				break;
			case '1' :
				adapter.setState (adapter.namespace + '.' + 'Device.MediaState', {val: 'Repeat 1', ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaRepeat', {val: true, ack: true});
				break;
      }
			
		switch (nst_shuffle) {
			case '-' :
				adapter.setState (adapter.namespace + '.' + 'Device.MediaModeShuffleStatus', {val: 'Off', ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaModeShuffle', {val: '0', ack: true});
				break;
			case 'S' :
				adapter.setState (adapter.namespace + '.' + 'Device.MediaModeShuffleStatus', {val: 'All', ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaModeShuffle', {val: '1', ack: true});
				break;
			case 'A' :
				adapter.setState (adapter.namespace + '.' + 'Device.MediaModeShuffleStatus', {val: 'Album', ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaModeShuffle', {val: '1', ack: true});
				break;
			case 'F' :
				adapter.setState (adapter.namespace + '.' + 'Device.MediaModeShuffleStatus', {val: 'Folder', ack: true});
				adapter.setState (adapter.namespace + '.' + 'Device.MediaModeShuffle', {val: '1', ack: true});
				break;
			}	
        
        adapter.setState (adapter.namespace + '.' + 'NET_Shuffle_Status', {val: nst_shuffle, ack: true});
                          }
               


    //Onkyo_Audio_Mute_Zone1
      if (chunk == 'AMT')  {
        string = parseInt(string);                  //convert string to integer
          if (string == '1') {
      adapter.setState (adapter.namespace + '.' + 'Zone1.Mute', {val: true, ack: true});
                        }
          if (string == '0') {
      adapter.setState (adapter.namespace + '.' + 'Zone1.Mute', {val: false, ack: true});
                        }
                      }

        //Onkyo_Audio_Mute_Zone2
        if (chunk == 'ZMT')  {
            string = parseInt(string);                  //convert string to integer
            if (string == '1') {
                adapter.setState (adapter.namespace + '.' + 'Zone2.Mute', {val: true, ack: true});
            }
            if (string == '0') {
                adapter.setState (adapter.namespace + '.' + 'Zone2.Mute', {val: false, ack: true});
            }
        }

        //Onkyo_Audio_Mute_Zone3
        if (chunk == 'MT3')  {
            string = parseInt(string);                  //convert string to integer
            if (string == '1') {
                adapter.setState (adapter.namespace + '.' + 'Zone3.Mute', {val: true, ack: true});
            }
            if (string == '0') {
                adapter.setState (adapter.namespace + '.' + 'Zone3.Mute', {val: false, ack: true});
            }
        }

  //Onkyo_Input_Select_Zone1  (hex)
      if (chunk == 'SLI')  {
        string = string.substr(0,2)        
        adapter.setState (adapter.namespace + '.' + 'Zone1.InputSelect', {val: string, ack: true});
                    }
        //Onkyo_Input_Select_Zone2  (hex)
        if (chunk == 'SLZ')  {
            string = string.substr(0,2)
            adapter.setState (adapter.namespace + '.' + 'Zone2.InputSelect', {val: string, ack: true});
        }

        //Onkyo_Input_Select_Zone3  (hex)
        if (chunk == 'SL3')  {
            string = string.substr(0,2)
            adapter.setState (adapter.namespace + '.' + 'Zone3.InputSelect', {val: string, ack: true});
        }

  //Onkyo_Internet_Radio_Preset_Zone1 
      if (chunk == 'NPR')  {
        string = parseInt(string, 16);              //convert hex to decimal
        adapter.setState (adapter.namespace + '.' + 'Zone1.NetRadioPreset', {val: string, ack: true});
                    }
        //Onkyo_Internet_Radio_Preset_Zone2
        if (chunk == 'NPZ')  {
            string = parseInt(string, 16);              //convert hex to decimal
            adapter.setState (adapter.namespace + '.' + 'Zone2.NetRadioPreset', {val: string, ack: true});
        }

        //Onkyo_Internet_Radio_Preset_Zone3
        if (chunk == 'NP3')  {
            string = parseInt(string, 16);              //convert hex to decimal
            adapter.setState (adapter.namespace + '.' + 'Zone3.NetRadioPreset', {val: string, ack: true});
        }

  //Listening_Mode
      if (chunk == 'LMD')  {
        string = string.substr(0,2)  
        adapter.setState (adapter.namespace + '.' + 'Device.ListeningMode', {val: string, ack: true});
                    }                    
                        
  //Onkyo_NET/USB_Album_Name_Info
      if (chunk == 'NAL')  {
        adapter.setState (adapter.namespace + '.' + 'Device.MediaAlbumName', {val: string, ack: true});
                    }

  //Onkyo_NET/USB_Artist_Name_Info
      if (chunk == 'NAT')  {
        adapter.setState (adapter.namespace + '.' + 'Device.MediaArtistNameInfo', {val: string, ack: true});
                    }

  //Onkyo_NET/USB_Time_Info
      if (chunk == 'NTM')  {
        adapter.setState (adapter.namespace + '.' + 'Device.MediaTimeInfo', {val: string, ack: true});
        var time_current_1 = string.substr(0,2);         // Current time
        time_current_1 = parseInt(time_current_1) * 60 ;
        var time_current_2 = string.substr(3,2);         // Current time
        time_current_2 = parseInt(time_current_2);
        var time_current =  time_current_1 + time_current_2 ;
        var time_1 = string.substr(6,2);                 // time
        time_1 = parseInt(time_1) * 60 ;
        var time_2 = string.substr(9,2);                 // time
        time_2 = parseInt(time_2);
        var time = time_1 + time_2 ;              
        adapter.setState (adapter.namespace + '.' + 'Device.MediaTimeCurrent', {val: time_current, ack: true});
        adapter.setState (adapter.namespace + '.' + 'Device.MediaTime', {val: time, ack: true});
                    }

  //Onkyo_NET/USB_Title_Name
      if (chunk == 'NTI')  {
        adapter.setState (adapter.namespace + '.' + 'Device.MediaTitelName', {val: string, ack: true});
                    }

  //Onkyo_NET/USB_Track_Info
      if (chunk == 'NTR')  {
        adapter.setState (adapter.namespace + '.' + 'Device.MediaTrack', {val: string, ack: true});
                    }

  //Onkyo_Tuner_Preset_Zone1
      if (chunk == 'PRS')  {
        string = parseInt(string, 16);              //convert hex to decimal
        adapter.setState (adapter.namespace + '.' + 'Zone1.TunerPreset', {val: string, ack: true});
                    }
        //Onkyo_Tuner_Preset_Zone2
        if (chunk == 'PRZ')  {
            string = parseInt(string, 16);              //convert hex to decimal
            adapter.setState (adapter.namespace + '.' + 'Zone2.TunerPreset', {val: string, ack: true});
        }

        //Onkyo_Tuner_Preset_Zone3
        if (chunk == 'PR3')  {
            string = parseInt(string, 16);              //convert hex to decimal
            adapter.setState (adapter.namespace + '.' + 'Zone3.TunerPreset', {val: string, ack: true});
        }

  //Onkyo_Tuning_Zone1
      if (chunk == 'TUN')  {
        string = parseInt(string) / 100;            //set dot for decimal
        adapter.setState (adapter.namespace + '.' + 'Zone1.Tune', {val: string, ack: true});
                    }
        //Onkyo_Tuning_Zone2
        if (chunk == 'TUZ')  {
            string = parseInt(string) / 100;            //set dot for decimal
            adapter.setState (adapter.namespace + '.' + 'Zone2.Tune', {val: string, ack: true});
        }

        //Onkyo_Tuning_Zone3
        if (chunk == 'TU3')  {
            string = parseInt(string) / 100;            //set dot for decimal
            adapter.setState (adapter.namespace + '.' + 'Zone3.Tune', {val: string, ack: true});
        }

  //Video_information
      if (chunk == 'IFV')  {
        adapter.setState (adapter.namespace + '.' + 'Device.VideoInformation', {val: string, ack: true});
                    }  

  //Onkyo_Volume_Zone1
      if (chunk == 'MVL')  {
        string = parseInt(string, 16);              //convert hex to decimal - backward: string = string.toString(16);
        adapter.setState (adapter.namespace + '.' + 'Zone1.Volume', {val: string, ack: true});
                    }
        //Onkyo_Volume_Zone2
        if (chunk == 'ZVL')  {
            string = parseInt(string, 16);              //convert hex to decimal
            adapter.setState (adapter.namespace + '.' + 'Zone2.Volume', {val: string, ack: true});
        }

        //Onkyo_Volume_Zone3
        if (chunk == 'VL3')  {
            string = parseInt(string, 16);              //convert hex to decimal
            adapter.setState (adapter.namespace + '.' + 'Zone3.Volume', {val: string, ack: true});
        }

					
  //Onkyo_AVR_INFO (xml)
   if (chunk == 'NRI') {
     adapter.setState (adapter.namespace + '.' + 'Device.NavInfo', {val: (cmd.iscp_command).slice(3, -3), ack: true});
                       }

  //Onkyo_AVR_ListInfo (xml)
    if (chunk == 'NLA') {
    sequenz = string.substr(1,4)
      adapter.setState (adapter.namespace + '.' + 'Device.NavSequence', {val: sequenz, ack: true});
      adapter.log.debug('sequenz: ' + sequenz);
      var xmlrepeat = ((cmd.iscp_command).slice(12).substring(0, ((cmd.iscp_command).slice(12).indexOf('</response>'))+11))
      parser.parseString(xmlrepeat, function (err, result) {
        var jsonrepeat = JSON.stringify(result);
        adapter.setState (adapter.namespace + '.' + 'Device.NavListInfo', {val: jsonrepeat, ack: true});
        adapter.log.debug('Adapter SET NavListInfo: ' + jsonrepeat);
                                                         });
      adapter.log.debug('Adapter SET NavListInfo: ' + ((cmd.iscp_command).slice(12).substring(0, ((cmd.iscp_command).slice(12).indexOf('</response>'))+11)));
                        }

	
  //Onkyo_Cover_Transfer (base64 coded in HEX)
    if (chunk == 'NJA') {
    var covertype = string.substr(0,1)
    adapter.log.debug('Covertype: ' + covertype);
      if (covertype == '0') {
        var image_type = 'bmp';       
                          }
      if (covertype == '1') {
        var image_type = 'jpg';
                          }
    
    var packetflag = string.substr(1,1)
    adapter.log.debug('packetflag: ' + packetflag);
      if (packetflag == '0') {
        var hextob64 = new Buffer(cmd.iscp_command.substr(5), 'hex').toString('base64')
        imageb64 = hextob64;
                            }
      if (packetflag == '1') {
        imageb64 = imageb64 + new Buffer(cmd.iscp_command.substr(5), 'hex').toString('base64');
                            }
      if (packetflag == '2') {
        imageb64 = imageb64 + new Buffer(cmd.iscp_command.substr(5), 'hex').toString('base64');
        var img = '<img width="100%" height="100%" title="" alt="cross" src="data:image/' + image_type + ';base64,' + imageb64 +'">';
		var coverurl = '/vis/CoverImage.' + image_type;
		adapter.setState (adapter.namespace + '.' + 'Device.CoverURL', {val: coverurl, ack: true});
        adapter.setState (adapter.namespace + '.' + 'Device.CoverBase64', {val: img, ack: true});  
			// safe bas64 data to file
			fs.writeFileSync('/opt/iobroker/iobroker-data/files/vis/CoverImage.' + image_type, imageb64, {encoding: 'base64'}, function(err) {
			adapter.log.debug('Cover file created');
			});
			
                            }
                        }
						
	 					
	
    //Onkyo Navigation on "Network-Mode"
      if (chunk == 'NLT')  {
        var string_nlt = string.substr(22,40);
        adapter.setState (adapter.namespace + '.' + 'Device.Navigation', {val: string_nlt, ack: true});
        //String zerlegen fuer Navigation
        var string_nlt_nav = string.substr(6,2);                    //2 digits navigation
        string_nlt_nav = parseInt(string_nlt_nav, 16) + 1;              //this start at zero, we need start at one and convert hex to decimal
        var string_nlt_nav_summ = string.substr(10,2);              //2 digits navigation summary
        string_nlt_nav_summ = parseInt(string_nlt_nav_summ, 16);    //convert hex to decimal
        adapter.setState (adapter.namespace + '.' + 'Device.NavPositionSumm', {val: string_nlt_nav+"/"+string_nlt_nav_summ, ack: true});
        adapter.setState (adapter.namespace + '.' + 'Device.NavCountItems', {val: string.substr(8,4), ack: true});
        adapter.setState (adapter.namespace + '.' + 'Device.NavLayer', {val: string.substr(12,2), ack: true});
        if (string.substr(0,3) == '110') {
          if (!sequenz) {
            sequenz = '0000'
                      }
          adapter.setState (adapter.namespace + '.' + 'Device.RAW', {val: 'NLAL' + sequenz + string.substr(12,2) + '0000' + string.substr(8,4)});
                                        }
        else if (string.substr(0,3) == '112') {
          adapter.setState (adapter.namespace + '.' + 'Device.RAW', {val: 'NTCRETURN'}); 
                                              }
                          
                          } 
}); 						  
   

    eiscp.on("debug", function (message) {
        adapter.log.debug(message);
    });
}
