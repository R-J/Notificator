$(document).ready(function() {
    var Notificator = function(label) {
        // Favicon url <link rel="shortcut icon"... when set with /settings/banner
        var favicon = $('link[rel="shortcut icon"]')[0];

        // stop if no favicon is set
        if(!favicon) {
            console.log('favicon not found');
            return;
        }

        // create image from favicon
        var img = new Image();
        img.src = favicon.href;
        img.onload = function () {
            // get dimensions for calculations 
            var width = this.width;
            var height = this.height;

            // create canvas from favicon
            var canvas = document.createElement("canvas");
            if(!canvas) {
                console.log('canvas could not be created');
                return;
            }
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            if(!ctx) {
                console.log('2d context could not be created');
                return;
            }
            ctx.drawImage(this, 0, 0);
            //only draw notification if label is given
            if (label.length > 0) {

                // draw rectangle
                ctx.font = width/2 + 'px sans-serif';
                var textWidth = 2 * Math.round(ctx.measureText(label).width / 2);
                ctx.fillStyle = "#dd0000";
                ctx.fillRect(
                    (width - 1) - (textWidth + 1), // x starts at 0, box should have border
                    0,
                    textWidth + 2,
                    height/3*2
                );
                // draw notification
                ctx.fillStyle = '#FFFFFF';
                ctx.font = width/2 + 'px sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(
                    label,
                    width - 1 - textWidth,
                    height/2
                );
            }
            // insert new favicon and delete old one
            var link = document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            link.href = canvas.toDataURL("image/x-icon");
            document.getElementsByTagName('head')[0].appendChild(link);
            favicon.parentNode.removeChild(favicon);
        }
    }
    
    // initially set favicon counter
    Notificator($('div.MeMenu span[rel="/profile/notificationspopin"] span.Alert').text());
    
    // reference to gardens inform function
    var gdnInform = window.gdn.inform; // pingForNotifications;

    // custom function
    gdn.inform = function (response) {

        // call originalfunction
        var gdnReturn = gdnInform(response);
        var count = response.InformMessages.length;

        // return if there are no results
        if (count == 0) {
            // return value of original function
            return gdnReturn;
        }
            
        var newMessagesCount = 0;
        var newNotificationsCount = 0;

        // loop through messages and raise counter for new messages and notifications
        for (var k = 0; k < count; k++) {
            var cssClass = response.InformMessages[k].CssClass
            if (cssClass.search('Activity-ConversationMessage') > -1) {
                newMessagesCount++;
                newNotificationsCount++;
            } else if (cssClass.search('Activity-') > -1) {
                // some other notification
                newNotificationsCount++;
            }
        }

        /**
         *  update message counter or
         *  create it if it doesn't exist yet
         */
        if (newMessagesCount > 0) {
            // get node of message counter
            var messagesCounter = $('div.MeMenu span[rel="/messages/popin"] span.Alert');
            
            if (!messagesCounter.length) {
                // create it if it does not exist yet
                // messagesCounter = $('<span class="Alert">' + newMessagesCount + '</span>').append('div.MeMenu span[rel="/messages/popin"] > a');
                messagesCounter = $('div.MeMenu span[rel="/messages/popin"] > a').append('<span class="Alert">' + newMessagesCount + '</span>');
            } else {
                // otherwise update with sum of current and new count
                newMessagesCount = Number($(messagesCounter).text()) + newMessagesCount;
                $(messagesCounter).text(newMessagesCount);
            }
        }

        /**
         *  update notification counter or
         *  create it if it doesn't exist yet
         */
        if (newNotificationsCount > 0) {
            // get node of notification counter
            var notificationsCounter = $('div.MeMenu span[rel="/profile/notificationspopin"] span.Alert');
            
            if (!notificationsCounter.length) {
                // create it if it does not exist yet
                // notificationsCounter = $('<span class="Alert">' + newNotificationsCount + '</span>').append('div.MeMenu span[rel="/profile/notificationspopin"] > a');
                notificationsCounter = $('div.MeMenu span[rel="/profile/notificationspopin"] > a').append('<span class="Alert">' + newNotificationsCount + '</span>');
            } else {
                // otherwise update with sum of current and new count
                newNotificationsCount = Number($(notificationsCounter).text()) + newNotificationsCount;
                $(notificationsCounter).text(newNotificationsCount);
            }

            // update favicon
            Notificator(newNotificationsCount);
        }
        
        // return value of original function
        return gdnReturn;
    }
});
