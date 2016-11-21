# interceptjs
A jQuery plugin that allows site owners to control calls to action (CTA) that occur for anonymous users. Could be used to offer user experience surveys, for donation calls to action and more. Supports:
* two styles: banner (site wide injected `div` at the top of the page) or modal
* viewing CTA on every pageview, or a particular page in a session, e.g. the first, or second, or third page view
* anonymous user dismissal of CTA, controlled with a cookie
* site owner override of user's dismissal
* configurable delayed introduction of CTA upon page load, e.g. show CTA 3s after DOM is loaded
* configurable duration of a user's session, for resetting pageview counts
* Google Analytics events, if available
* configurable percentage a user will see the CTA, defaults to 100%
* custom HTML in the invitation, use this with *any* survey service.
This was created to be call to action agnostic and works with any type of call to action, whether survey, donation or otherwise. We built it to use with Survey Monkey, but you could use Google Forms, Survey Gizmo, Constant Contact or a vanilla webpage.

# Usage
Place this after you've loaded jQuery and on every page you'd like the call to action invitation to appear:
```javascript
<!-- start interceptjs -->
<!-- requires the js-cookie library from cloudflare -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.3/js.cookie.min.js" integrity="sha256-S20kSlaai+/AuQHj3KjoLxmxiOLT5298YvzpaTXtYxE=" crossorigin="anonymous"></script>
<!-- only required if you are using the 'modal' type, otherwise safe to omit -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.8.0/jquery.modal.min.js" integrity="sha256-UeH9wuUY83m/pXN4vx0NI5R6rxttIW73OhV0fE0p/Ac=" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.8.0/jquery.modal.min.css" integrity="sha256-rll6wTV76AvdluCY5Pzv2xJfw2x7UXnK+fGfj9tQocc=" crossorigin="anonymous" />
<!-- intercept js plugin itself -->
<script src="https://cdn.rawgit.com/ten7/interceptjs/master/jquery.interceptjs.js"></script>
<!-- call the intercept js plugin, overriding defaults -->
<script>
$('html').interceptjs({
    // pageview to show this on, 0=all views
    pagenum: 0,
    // master on/off switch for the plugin
    power_switch: 1,
    // override user's wishes, and show the call to action. CAUTION!
    user_override: 0,
    // what percentage of the time a user will see the CTA
    percent: 100,
    // use Google Analytics events, if available
    google_analytics: 0,
    // how long, in hours, before we restart a user's session
    session_duration: 24,
    // how many milliseconds to wait before showing the CTA  
    show_delay: 0,
    // the type of CTA to show, 'banner' or 'modal'
    type: 'banner',
    // the HTML to show in the CTA
    text: '<div><h4>Your opinion is important to us!</h4><p>Would you be willing to take a survey after your visit to tell us about your experience on our website?</p><p><a class="ijs_close" href="http://www.surveymonkey.com/" target="_blank">Yes, I&rsquo;d love to help.</a> <a class="ijs_close" href="#">No, sorry.</a></div>'
});
</script>
<!-- intercept js styles -->
<link href="https://cdn.rawgit.com/ten7/interceptjs/master/jquery.interceptjs.css" rel="stylesheet">
<!-- end interceptjs -->
```

# Demo
As an example, this is what an intercept might look like of both `banner` and `modal` types for a site like iamgreaterthanzero.com:
![interceptjs demo](https://cdn.rawgit.com/ten7/interceptjs/master/interceptjs-demo.gif)

# User flow
The decisions of when and where to show the call to invitation is controlled using this workflow:

![interceptjs user flow](https://cdn.rawgit.com/ten7/interceptjs/master/interceptjs-user-flow.svg)

# Made by
This plugin is made in Minneapolis by humans at [TEN7](https://ten7.com/).