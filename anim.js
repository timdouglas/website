// predicate to render "tags" for display
const applyTags = (tagEls) => () => tagEls.map((el,i) => el.innerHTML = `&lt;${i % 2 === 0 ? '' : '/'}${el.attributes['data-tag'].value}&gt;`);

// type a line & its html "tags"
const line = (text, tag, outerId) => {
  const innerId = `${outerId}-value`;
  // find elements to add "tags" to
  const tagEls = [...document.querySelectorAll(`#${outerId} .tag[data-tag="${tag}"]`)];
  
  // find element to type in
  const valueEl = document.getElementById(innerId);

  // build a cursor class
  const cursorClassName = `${tag}-cursor`;
  
  // initialise typewriter
  const type = new Typewriter(valueEl, { delay: 'natural', cursorClassName });
  
  // predicate to clear the cursor when typing has finished
  const clearCursor = () => {
    const cursorEls = [...document.querySelectorAll(`.${cursorClassName}`)];
    cursorEls.map(cursorEl => cursorEl.style.visibility = 'hidden' );
  };

  // type the text and tags
  return new Promise((resolve) => {
    type
      .callFunction(applyTags(tagEls))
      .typeString(text)
      .pauseFor(1200)
      .callFunction(clearCursor)
      .callFunction(() => resolve(type))
      .start();
  });
};

// id attributes of text to type, in order
const ids = ['title', 'subtitle', 'about', 'list', 'list-item-1', 'list-item-2', 'list-item-3', 'email'];
const lines = {};
let typist;
let hasStopped = false;

// stop function
const stop = () => {
  // stop typing
  if(typist) {
    typist.stop();
  }
  
  hasStopped = true;

  // restore all content
  ids.forEach(id => {
    const el = document.getElementById(`${id}-value`);
    // restore values
    el.innerHTML = lines[id];

    // restore tags
    applyTags([...document.querySelectorAll(`#${id} .tag`)])();
  });  
}

// main function
const run = async () => {
  ids.forEach(id => {
    const el = document.getElementById(`${id}-value`);
    const value = el.innerHTML;
    // clear text prior to typing
    el.innerHTML = '';
    // store text in object for typing in order
    lines[id] = value;
  });
   
  try {
    // set up skip button
    document.getElementById('skip').addEventListener('click', ev => {
      ev.preventDefault();
      stop();
    });
    
    // type each line one at a time
    for await (const id of ids) {
      if(!hasStopped) {
        const tagName = document.getElementById(id).tagName;
        typist = await line(lines[id], tagName.toLowerCase(), id);
      }
    }
  } catch(err) {
    console.error(err);
    stop();
  }
};

run();
