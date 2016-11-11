(function($) {
    $.fn.interceptjs = function(options) {
        // Establish our default settings
        var settings = $.extend({
            pagenum: 0,
            power_switch: 1,
            user_override: 0,
            percent: 100,
            google_analytics: 0,
            session_duration: 24,
            show_delay: 0,
            type: 'alert',
            text: '<p>Powered by <a href="https://interceptjs.io/#defaultsettings">interceptjs</a>!</p>',
            complete: null
        }, options);
        // Initialize user object
        var ijs = {};
        // Use analytics?
        var use_ga = 0;
        if (settings.google_analytics == 1 && window.ga) {
            use_ga = 1;
        }
        // HTML alert
        var html_alert = '<div id="ijs_html_alert"><div id="ijs_close">x</div>' + settings.text + '</div>';
        // Show intercept logic
        function showIntercept() {
            // Wait for show_delay seconds before actually showing anything
            var tid = window.setTimeout(function() {
                if (use_ga) {
                    ga('send', 'event', 'interceptjs', 'show_intercept');
                }
                // Insert intercept
                $('body').prepend(html_alert);
                // Click events
                $('#ijs_close').on('click', function() {
                    if (use_ga) {
                        ga('send', 'event', 'interceptjs', 'close_intercept');
                    }
                    $('#ijs_html_alert').hide();
                    ijs.user_dismiss = 1;
                    Cookies.set('ijs', ijs);
                    return;
                });
                $('#ijs_html_alert a').on('click', function() {
                    if (use_ga) {
                        ga('send', 'event', 'interceptjs', 'click_intercept');
                    }
                    return;
                });
                return;
            }, settings.show_delay);
        }
        // Return this
        return this.each(function() {
            // Is this thing even on?
            if (settings.power_switch == 0) {
                // Do nothing
                return;
            }
            // Load cookie library
            $.getScript('https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.3/js.cookie.min.js', function(data, textStatus, jqxhr) {
                // Some variables
                var ts = Math.floor(Date.now());
                var rndnum = Math.floor(Math.random() * 100); // between 0 and 100
                // Load user data from cookie, setup defaults if none
                ijs = Cookies.getJSON('ijs') || {};
                if ($.isEmptyObject(ijs)) {
                    // User data
                    ijs = {
                        user_dismiss: 0,
                        pageview: 0,
                        first_visit: ts,
                        last_visit: ts
                    };
                    Cookies.set('ijs', ijs);
                }
                // Should we start a new session?
                var session_duration = settings.session_duration * 3600000;
                var elapsed_time = ijs.last_visit + session_duration;
                if ((ts > elapsed_time) || ts == ijs.first_visit) {
                    // New session
                    ijs.pageview = 1;
                } else {
                    // Continue existing session
                    ijs.pageview++;
                }
                // Update last visit
                ijs.last_visit = ts;
                // Save cookie
                Cookies.set('ijs', ijs);
                // User dismiss on?
                if (ijs.user_dismiss == 1) {
                    if (settings.user_override == 1) {
                        ijs.user_dismiss = 0;
                        Cookies.set('ijs', ijs);
                    } else {
                        // Do nothing
                        return;
                    }
                }
                // Check the page we're on
                if (settings.pagenum == 0 || settings.pagenum == ijs.pageview) {
                    // What percentage of the time to show?
                    if (rndnum < settings.percent) {
                        // Show the intercept
                        showIntercept();
                    } else {
                        // Do nothing
                        return;
                    }
                } else {
                    // Do nothing
                    return;
                }
            });
            if ($.isFunction(settings.complete)) {
                settings.complete.call(this);
            }
        });
    };
}(jQuery));
