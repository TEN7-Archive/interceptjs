# interceptjs
Javascript library to manage embed call to action intercepts.

# Usage
Include the Javascript file after jQuery is loaded:
```
    <script src="../path/to/jquery.interceptjs.js"></script>
```
On all pages that should use the intercept, call the plugin:
```
<script>
    $('html').interceptjs({
        // pagenum: 0,
        // power_switch: 1,
        // user_override: 0,
        // percent: 100,
        // google_analytics: 1
        // session_duration: 24,
        // show_delay: 5000,
        // type: alert,
        // text: 'Powered by interceptjs!'
    });
</script>
```