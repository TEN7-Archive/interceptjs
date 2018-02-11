var Helpers = {
  getCurrentTime() {
    return Math.floor(Date.now());
  },
  getRandomNumber() {
    return Math.floor(Math.random() * 100); // between 0 and 100
  },
  extendDefaults(a, b) {
    for(var key in b)
      if(b.hasOwnProperty(key))
        a[key] = b[key];
    return a;
  },
  isEmptyObject(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }
};

function setupUI() {
  // Banner alert
  const html_banner = '<div id="ijs_banner_wrapper" class="ijs_intercept"><div id="ijs_banner"><div id="ijs_banner_close" class="ijs_close">x</div></div></div>';
  // Modal alert
  const html_modal = '<div id="ijs_modal" class="ijs_intercept"></div>';

  /*
    vars and handlers
   */
  // Do we have cookies library?
  if (!window.Cookies) {
    console.log('js-cookie is not installed. See http://interceptjs.io/ for help.');
    return;
  }
}

function Intercept(message, settings) {
  var defaultSettings = {
    pagenum: 0,
    power_switch: 1,
    user_override: 0,
    percent: 100,
    google_analytics: 0,
    session_duration: 24,
    show_delay: 0,
    type: 'banner',
    text: message,
    complete: null,
    target: 'body'
  };

  var options = Helpers.extendDefaults(defaultSettings, settings);

  // Update our session duration to be milliseconds
  options.session_duration = options.session_duration * 3600000;

  // eject if this has been turned off
  // todo why is this setting necessary, wouldn't they just not call the Intercept function?
  if (options.power_switch === 0) {return;}

  // Initialize this instance of the intercept
  var instance = {};

  // get or set instance cookie data
  instance.data = Cookies.getJSON(instance.data.id) || {};

  // If we can't get a cookie, set instance defaults and add a cookie
  if (Helpers.isEmptyObject(instance.data)) {
    instance.data = {
      id: 'intercept-' + Math.round(Math.random()*1E4),
      user_dismiss: 0,
      pageview: 0,
      first_visit: Helpers.getCurrentTime(),
      last_visit: Helpers.getCurrentTime()
    };
    Cookies.set(instance.data.id, instance.data);
    
  }

}


var UI = setupUI();
var sampleMarkup = '<p>Powered by <a href="https://interceptjs.io/#defaultsettings">interceptjs</a>! You should change this message.</p>';
var intercept = Intercept(sampleMarkup);