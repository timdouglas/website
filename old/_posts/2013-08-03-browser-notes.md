---
published: false
---

## Browser Notes

So the other day, I saw a [post on Hacker News](http://www.fizerkhan.com/blog/posts/Use-your-browser-as-Notepad.html) detailing how it's possible to embed HTML in a data-uri and navigate to that page in a browser, and by making that HTML `contenteditable`, effectivley turn your browser into a note-taking application.

Great, I thought, I'm always looking for good ways to take notes when I'm working and poking around on the internets, so a browser is an obvious place for these notes.  So I started using one of the suggested data-uris and it worked pretty well.

But, I couldn't save notes, meaning if I closed the tab or the browser state was lost, so were my notes.  So I decided to have a go at fixing it so the notes are saved.  To do this I created a page with a `seamless`, full-page `iframe` with it's `src` as the data-uri.  In that data-uri I embeded a `<script>` tag to use `postMessage` to send the body contents to that parent document, which when it receives a message, drops it into `localStorage`.  That way, every 3 seconds after you stop typing, your notes are saved in the browser.

At the moment it only works on Chrome, as nothing yet I've found supports both `seamless` and `postMessage` well enough, but as I do most of my work in Chrome I'm not too fussed.

You can have a play with browser notes here: http://timdouglas.co.uk/_/notes/

I've also got it on github here: http://github.com/timdouglas/browser-notes
