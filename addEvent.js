/**
 * Load Google Calendar client library. List upcoming events
 * once client library is loaded.
 */
function loadCalendarApi() {
    gapi.client.load('calendar', 'v3', addEvent);
}
function addEvent() {
    var request = gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': "2015-04-20T00:00:00+01:00",
        'timeMax': "2015-04-21T00:00:00+01:00",
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    });


    function parseDateTime(dateTimeString) {
        var dateTime={};
        var Time=0,Year=0,Month=0,Day=0;		// event time details
        try {
            Hour = Number(dateTimeString.substring(11,13));	// parse hour
            Min  = Number(dateTimeString.substring(14,16));	// parse minutes
            Sec = Number(dateTimeString.substring(17,19));	// parse seconds
            Year = Number(dateTimeString.substring(0,4));	// parse Year
            Month = Number(dateTimeString.substring(5,7));	// parse Month
            Day = Number(dateTimeString.substring(8,10));	// parse Day
        } catch (error) {
            // problem parsing data information, so will be set to default
        }
        var Time = Hour*60 + Min + Sec/60;
        dateTime.time=Time;
        dateTime.day=Day;
        dateTime.month=Month;
        dateTime.year=Year;
        return(dateTime);
    }

    request.execute(function(resp) {
        var events = resp.items;
        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var startDateTime={};
                var endDateTime={};
                var start = event.start.dateTime;
                if (start){
                    startDateTime=parseDateTime(start);
                } else {
                    startDateTime=parseDateTime("0000-01-01T00:00:00");
                }
                var end = event.end.dateTime;
                if (end){
                    endDateTime=parseDateTime(end);
                } else {
                    endDateTime=parseDateTime("0000-01-01T24:00:00");
                }
                var eventObject={start:startDateTime,end:endDateTime,summary:event.summary};
                Event.push(eventObject);
                //alert("Event start date is "+eventObject.start.day+" "+eventObject.start.month+" "+eventObject.start.year+" time is "+eventObject.start.time);
            }
        }
        calAvailable();
    });

}

