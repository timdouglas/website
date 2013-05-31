---
layout: post
title: Cross Browser Faffing
categories: [webdev]
tags: [web, dev]
summary: The things I had to do to make this site work on older browsers
js: [/js/prism.js]
---
![Broken IE7...](/imgs/broken.png)

Recently I was playing about with [BrowserStack](http://www.browserstack.com) (which is worth its weight in gold frankly) and noticed that this site was fairly crappily supported in older browsers.  I'm talking IE7 and under, FF3 on Windows XP etc etc.  And it wasn't just styles broken, the js loading my [projects list](/projects.html) was also pretty b0rked.

So instead of not caring, I decided to attempt to fix it.  This is what happened

## The Styling

As you can see from the screenshot above, IE doesn't like much of my site, so the first thing I did was add some conditional comments into the default template to include [HTML5 Shiv](http://code.google.com/p/html5shiv) which adds the new html5 elements to IE, as well as default styling for them (nice touch).

I then added polyfills for [media queries](https://code.google.com/p/css3-mediaqueries-js/) and [box-sizing](https://github.com/albertogasparin/borderBoxModel), and merged them into a single file to save an HTTP request.

Things were looking a bit better, but I still had to fix the floating issue.  After a bit of head scratching I resorted to using selector hacks to adjust the sizes on IE7 and IE6.  It's a bit of a dirty thing to do, but it worked...

## The Javascript

The github projects plugin I'd modified had ECMASCRIPT5 functions in it which were breaking the older browsers, luckily it also broke non-IE browers, so at least I could use some decent debugging tools to find it out!

There was a wide range of things missing, such as `Array.isArray` and `Array.forEach`, so instead of including the prototypes for each missing function, I decided to use [yepnope](http://yepnopejs.com) to load a polyfill with them all in.  After a bit of research, I decided to use [es5-shim](https://github.com/kriskowal/es5-shim).  However I didn't want to load it into the page willynilly, so I wrote a small module wrapper to load the github projects page:

<pre>
  <code class="language-javascript">
var GithubProjects = (function(yepnope)
{
  "use strict";
  
  var self =
  {
    init: function()
    {
      //run yepnope tests and loads
      yepnope(
      [
        {
          test: Array.isArray, //basic requirement for jquery.github.js
          nope: "/js/es5-shim.min.js",
        },
        {
          test: window.JSON, //needed to read the github api response
          nope: "/js/json2.min.js"
        },
        {
          test: window.jQuery, //needed for dom manipulation in github plugin
          nope: ["https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js", "/js/jquery.github.min.js"],
          yep: "/js/jquery.github.min.js", //if jquery already present, just load plugin
          complete: function()
          {
            //call the plugin
            self.github(window.jQuery);
          }
        }        
      ]);
    },

    github: function($)
    {
      //only want this to run on DOM ready, so wrap it just to be sure
      $(function(){ $("section.projects").github({ username: "timdouglas" }); });
    }
  };

  return self;
})(yepnope);
  </code>
</pre>

It's then a simple case of just calling `GithubProjects.init()` on the projects page and all the dependecies are loaded before the plugin is executed.

## What I learned

So yeah, I probably should've checked older-browser compatibility a long time ago, but better late than never, eh?  Since the browsers themselves have started updating properly, people aren't getting left behind so much, and so nobody has actually viewed this site on an older browser - but of course that doesn't mean nobody will.  And it also means that without BrowserStack, I'd have been completely unaware until that time.

I also came across some good resources for cross-browser polyfills and hacks:
- This [list](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills) from Modernizr was fantasticly useful.
- [BrowserHacks](http://browserhacks.com/) for the styling hacks
- The [Yepnope](http://yepnopejs.com/) documentation is great.