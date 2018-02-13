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
  // Banner alert
  // const html_banner = document.createElement('<div id="ijs_banner_wrapper" class="ijs_intercept"><div id="ijs_banner"><div id="ijs_banner_close" class="ijs_close">x</div></div></div>');
  const html_banner = document.createElement('div');
  // Modal alert
  const html_modal = '<div id="ijs_modal" class="ijs_intercept"></div>';

  var defaultSettings = {
    // id: 'interceptjs-' + Math.round(Math.random()*1E4),
    showOnXPages: 0, // 0 == show on all pages
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
  instance.data = Cookies.getJSON('ijs') || {};

  // If we can't get a cookie, set instance defaults and add an initial cookie
  // else update the cookie
  if (Helpers.isEmptyObject(instance.data)) {
    instance.data = {
      user_dismissed: 0,
      pageview: 1,
      first_visit: Helpers.getCurrentTime(),
      last_visit: Helpers.getCurrentTime()
    };
    Cookies.set('ijs', instance.data);
  } else {
    updateCookieWithSessionInfo();
  }

  // Can the user dismiss the message?
  setDismissPriveledges();

  // Show the intercept if it matches pagenum and show percent settings
  if ( options.showOnXPages === 0 || options.showOnXPages === instance.data.pageview ) {
    var rndnum = Helpers.getRandomNumber();
    if (rndnum < options.percent) {

      // Show intercept after any delay option settings
      window.setTimeout(
        showIntercept,
        options.show_delay
      );
    }
  }

  // run callback function if provided
  if (typeof options.complete === 'function') {
    options.complete.call(this);
  }

  function showIntercept() {
    var body = document.getElementsByTagName('body');

    var intercept = buildInterceptUI();

    // Add the intercept to the DOM
    body[0].appendChild(intercept);
  }

  /*
   * Utility Functions
   */

  function buildInterceptUI() {
    var intercept;
    if (options.type === 'banner') {
      var bannerFrag = document.createDocumentFragment();

      var wrapper = document.createElement('div');
      wrapper.className = 'ijs_intercept';
      wrapper.id = 'ijs_banner_wrapper';

      var banner = document.createElement('div');
      banner.id = 'ijs_banner_wrapper';
      banner.innerHTML = options.text;

      var close = document.createElement('div');
      close.className = 'ijs_close';
      close.id = 'ijs_banner_close';
      close.textContent = 'x';
      close.onclick = closeIntercept;

      // Compile banner children elements
      banner.appendChild(close);
      wrapper.appendChild(banner);
      bannerFrag.appendChild(wrapper);

      intercept = bannerFrag;
    }

    return intercept;
  }

  function closeIntercept() {
    // Hide the intercept
    document.querySelector('.ijs_intercept').style.display = 'none';

    // If google analytics, send a click record
    if (options.google_analytics === 1 && window.ga) {
      ga('send', 'event', 'interceptjs', 'close_intercept_' + options.type, window.location.href);
    }

    // update the instance that user has dismissed
    instance.data.user_dismissed = 1;
    Cookies.set('ijs', instance.data);
  }

  // Function to figure out if we should start a new session; updates
  function updateCookieWithSessionInfo() {
    var currentTime = Helpers.getCurrentTime();
    var sessionResetTime = instance.data.last_visit + options.session_duration;

    if ( (currentTime > sessionResetTime) || (currentTime === instance.data.first_visit) ) {
      // start a new session
      instance.data.pageview = 1;
    } else {
      instance.data.pageview++;
    }
    // Update instance last visit
    instance.data.last_visit = currentTime;

    // Resave the cookie
    Cookies.set('ijs', instance.data);
  }

  function setDismissPriveledges() {
    if ( instance.data.user_dismissed === 1 && options.user_override === 1 ) {
        instance.data.user_dismissed = 0;
        Cookies.set('ijs', ijs);
    }
  }
}


var UI = setupUI();
var sampleMarkup = '<p>Powered by <a href="https://interceptjs.io/#defaultsettings">interceptjs</a>! You should change this message.</p>';
var intercept = Intercept(sampleMarkup);