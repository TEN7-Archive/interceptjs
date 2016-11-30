(function($) {
    $.fn.interceptjs = function(options) {
        // https://github.com/js-cookie/js-cookie
        if (!window.Cookies) {
            console.log('js-cookie is not installed. See http://interceptjs.io/ for help.');
            return;
        }
        // https://github.com/kylefox/jquery-modal
        if (!$.modal) {
            console.log('jquery-modal is not installed. See http://interceptjs.io/ for help.');
            return;
        }
        // Establish our default settings
        var settings = $.extend({
            pagenum: 0,
            power_switch: 1,
            user_override: 0,
            percent: 100,
            google_analytics: 0,
            session_duration: 24,
            show_delay: 0,
            type: 'banner',
            text: '<p>Powered by <a href="https://interceptjs.io/#defaultsettings">interceptjs</a>! You should change this message.</p>',
            complete: null
        }, options);
        // Initialize user object
        var ijs = {};
        // Use analytics?
        var use_ga = 0;
        if (settings.google_analytics == 1 && window.ga) {
            use_ga = 1;
        }
        // Banner alert
        var html_banner = '<div id="ijs_banner_wrapper" class="ijs_intercept"><div id="ijs_banner"><div id="ijs_banner_close" class="ijs_close">x</div>' + settings.text + '</div></div>';
        // Modal alert
        var html_modal = '<div id="ijs_modal" class="ijs_intercept">' + settings.text + '</div>';
        // Return this
        return this.each(function() {
            // Is this thing even on?
            if (settings.power_switch == 0) {
                // Do nothing
                return;
            }
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
            // Complete
            if ($.isFunction(settings.complete)) {
                settings.complete.call(this);
            }
        });
        // Show intercept logic
        function showIntercept() {
            // Wait for show_delay seconds before actually showing anything
            var tid = window.setTimeout(function() {
                if (use_ga) {
                    ga('send', 'event', 'interceptjs', 'show_intercept', settings.type);
                }
                switch (settings.type) {
                    // Popup
                    case 'popup':

                        break;
                        // Modal
                    case 'modal':
                        $('body').append(html_modal);
                        $('#ijs_modal').modal({
                            fadeDuration: 100
                        });
                        break;
                        // Banner
                    case 'banner':
                    default:
                        // Insert banner at the top
                        $('body').prepend(html_banner).show();
                }
                // Click events: banner
                $('.ijs_close').on('click', function() {
                    if (use_ga) {
                        ga('send', 'event', 'interceptjs', 'close_intercept', settings.type);
                    }
                    $('.ijs_intercept').hide();
                    ijs.user_dismiss = 1;
                    Cookies.set('ijs', ijs);
                    return;
                });
                $('.ijs_click').on('click', function() {
                    if (use_ga) {
                        ga('send', 'event', 'interceptjs', 'click_intercept', settings.type);
                    }
                    return;
                });
                // Click events: modal
                $('#ijs_modal').on($.modal.CLOSE, function(event, modal) {
                    if (use_ga) {
                        ga('send', 'event', 'interceptjs', 'close_intercept', settings.type);
                    }
                    ijs.user_dismiss = 1;
                    Cookies.set('ijs', ijs);
                    return;
                });
                return;
            }, settings.show_delay);
        }
    };
}(jQuery));
