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

function Intercept(options) {

  // Do we have cookies library?
  if (!window.Cookies) {
    console.log('js-cookie is not installed. See http://interceptjs.io/ for help.');
    return;
  }

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
    text: '<p>Powered by <a href="https://interceptjs.io/#defaultsettings">interceptjs</a>! You should change this message.</p>',
    complete: null,
    target: 'body'
  };

  var settings = Helpers.extendDefaults(defaultSettings, options);

  // Update our session duration to be milliseconds
  settings.session_duration = settings.session_duration * 3600000;

  // Are we using google analytics?
  var use_ga = (settings.google_analytics === 1 && window.ga) ? true : false;

  // eject if this has been turned off
  // todo why is this setting necessary, wouldn't they just not call the Intercept function?
  // I guess maybe it's useful for a Drupal module UI user config??
  if (settings.power_switch === 0) {return;}

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
  setDismissPrivileges();

  // Show the intercept if it matches pagenum and show percent settings
  if ( settings.showOnXPages === 0 || settings.showOnXPages === instance.data.pageview ) {
    var rndnum = Helpers.getRandomNumber();
    if (rndnum < settings.percent) {

      // Show intercept after any delay option settings
      window.setTimeout(
        showIntercept,
        settings.show_delay
      );
    }
  }

  // run callback function if provided
  if (typeof settings.complete === 'function') {
    settings.complete.call(this);
  }

  function showIntercept() {
    var body = document.getElementsByTagName('body');

    var intercept = buildInterceptUI();

    // Add the intercept to the DOM
    body[0].prepend(intercept);

    if (use_ga) {
      ga('send', 'event', 'interceptjs', 'show_intercept_' + settings.type, window.location.href);
    }
  }

  /*
   * Utility Functions
   */
  function buildInterceptUI() {

    switch (settings.type) {
      case 'modal':
        var modalFrag = document.createDocumentFragment();

        var wrapper = document.createElement('div');
        wrapper.className = 'ijs_intercept';
        wrapper.id = 'ijs_modal';

        var modalContent = document.createElement('div');
        modalContent.className = 'ijs_modal--content';

        var modalClose = document.createElement('button');
        modalClose.className = 'ijs_modal--close';
        modalClose.setAttribute('aria-label', 'Close modal window');
        modalClose.innerHTML = '&times;';
        modalClose.onclick = closeIntercept;

        var modalBody = document.createElement('p');
        modalBody.className = 'ijs_modal--body';
        modalBody.innerHTML = settings.text;

        // Put together the modal pieces
        modalContent.appendChild(modalClose);
        modalContent.appendChild(modalBody);
        wrapper.appendChild(modalContent);
        modalFrag.appendChild(wrapper);

        return modalFrag;

      // Banner Intercept
      case 'banner':
      default:
        var bannerFrag = document.createDocumentFragment();

        var wrapper = document.createElement('div');
        wrapper.className = 'ijs_intercept';
        wrapper.id = 'ijs_banner_wrapper';

        var banner = document.createElement('div');
        banner.id = 'ijs_banner_wrapper';
        banner.innerHTML = settings.text;

        var close = document.createElement('div');
        close.className = 'ijs_close';
        close.id = 'ijs_banner_close';
        close.textContent = 'x';
        close.onclick = closeIntercept;

        // Compile banner children elements
        banner.appendChild(close);
        wrapper.appendChild(banner);
        bannerFrag.appendChild(wrapper);

        return bannerFrag;
    }
  }

  function closeIntercept() {
    // Hide the intercept
    document.querySelector('.ijs_intercept').style.display = 'none';

    // If google analytics, send a click record
    if (use_ga) {
      ga('send', 'event', 'interceptjs', 'close_intercept_' + settings.type, window.location.href);
    }

    // update the instance that user has dismissed
    instance.data.user_dismissed = 1;
    Cookies.set('ijs', instance.data);
  }

  // Function to figure out if we should start a new session; updates
  function updateCookieWithSessionInfo() {
    var currentTime = Helpers.getCurrentTime();
    var sessionResetTime = instance.data.last_visit + settings.session_duration;

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

  function setDismissPrivileges() {
    if ( instance.data.user_dismissed === 1 && settings.user_override === 1 ) {
        instance.data.user_dismissed = 0;
        Cookies.set('ijs', ijs);
    }
  }
}


var intercept = Intercept({
  text: 'This is my message',
  type: 'modal',
  show_delay: 2000
});