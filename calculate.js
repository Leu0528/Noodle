//return an increasing array by a certain object
function compare(propertyName) {
    return function (object1, object2) {
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];
        if (value2 > value1) {
            return -1;
        } else if (value2 < value1) {
            return 1;
        } else {
            return 0;
        }
    }
}

//turn minutes into the format HH:MM:SS
function minutesToTime(minutes) {
    var time="";
    var mins=""+Math.floor(Math.floor(minutes) % 60);
    if (mins.length==1) mins="0"+mins;
    var secs=""+Math.floor(Math.floor(minutes * 60) % 60);
    if (secs.length==1) secs="0"+secs;
    var hrs=""+Math.floor(minutes/60);
    time=time+hrs+":"+mins+":"+secs;
    return(time);
}

function calAvailable(year,month,day) {
    Event.sort(compare("start"));
    // First start of with the whole day available
    var availableSlots=[{start:0,end:1440}];
    for (var i = 0; i < Event.length; i++) {
        var event=Event[i];
        if ( (year!=undefined) && (month!=undefined) && (day!=undefined)) {			// are we filtering on date
            if ( (event.start.day!=day) || (event.start.month!=month) || (event.start.year!=year)) continue;	// check for target
        }
        for (var j=0;j<availableSlots.length;j++) {
            var available=availableSlots[j];
            // We now need to split each available slot based in the booked slots
            if ( (event.start.time>=available.start) && (event.start.time<=available.end)) {		// start of slot overlaps with available slot, so need to adjust available
                var newEnd=event.start.time;	// move available slot's end to start of scheduled meeting

                // We now need to determine if the meeting splits the available slot up into 2 parts
                if (event.end.time<available.end) {		// in this case we need to split the available space into 2 spaces
                    var newAvailable={start:event.end.time,end:available.end};		// this is the new slot
                    availableSlots.push(newAvailable);		// push into list
                }
                available.end=newEnd;
                if (available.end<=available.start) {
                    availableSlots.splice(j,1);			// remove this slot
                }
            }
        }
    }
    for (var idx=0;idx<availableSlots.length;idx++) {
        var available=availableSlots[idx];
        document.write("Available start is "+minutesToTime(available.start)+" end is "+minutesToTime(available.end)+"<br/>");
    }
}

function appendPre(message) {
    var pre = document.getElementById('output');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}