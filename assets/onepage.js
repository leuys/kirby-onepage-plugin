/* ### PAGE LOAD ### */

var intervals = []; // setInterval garbage control = index and clear intervals
/*
  Register intervals for each page like so:
    intervals.push(setInterval(func, 1000));
*/

// inner html of these elements will be replaced with loaded content
const contentElements = [
  onePageConfig.tag
];


// registering all internal links, making them to call load function instead of hard load
window.addEventListener('DOMContentLoaded', initNavLinks);


// prevent hard load, instead request content via fetch
function initNavLinks(){
  const internalLinks = Array.from(document.querySelectorAll('a')).filter(link => {
    const href = link.getAttribute('href');
    return href && ((href.startsWith('/') || href.includes(window.location.hostname)) && !href.includes('mailto') );
  });
  internalLinks.forEach((navLink) => {
    navLink.onclick = function(event){
      event.preventDefault();
      toggleNav(event.target);
      let slug = event.target.closest('a').href.replace(rootPath+'/', '');
      load(slug);
    };
  });
}


// request new content
function load(slug) {
  slug = slug || 'home';
  console.log('requesting "'+slug+'"')
  stopRequests(); // cancel all requests
  clearIntervals();
  slug.replace(/\/+$/, ""); // remove trailing-slash
  if(slug == '') slug = 'home';
  loadIndicator('start');
  contentElements.forEach((element) => {
    getElementByXPath(element)?.classList.add('semi_fade');
  });
  // url root path is reliably set by kirby, in html head script
  let requestURL = rootPath+'/'+slug;
  try {
    fetch(requestURL+'.json')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      })
      .then(json => {
        // New Page loaded
        history.pushState(json, '', requestURL);
        loadIndicator('response');
        renderPage(json[0]);
      })
  } catch (error) {
    console.log(error);
    contentElements.forEach((element) => {
      getElementByXPath(element)?.classList.remove('semi_fade');
    });
    load('error');
  }
}


// making the browser history (back/prev) work
window.addEventListener('popstate', (event) => {
  if(content = event.state){
    loadIndicator('start');
    renderPage(content[0]);
  }else{
    // if no state is locally saved, get slug from url and load content from server
    load( window.location.href.replace(rootPath+'/', '') );
  }
});


// replace content
function renderPage(page){
  contentElements.forEach((element) => {
    getElementByXPath(element)?.classList.remove('semi_fade');
    getElementByXPath(element)?.classList.add('fade_out');
  });
  // wait for content to fade out > replace > then fade in
  setTimeout(() => {
    loadIndicator('finish');
    changeTitle(page.model.content.title);
    disconnectObserver();
    contentElements.forEach((element) => {
      setInnerHTML(getElementByXPath(element), page.html[element]);
      // re-register on click event for page-wide nav links
      initNavLinks();
      window.scrollTo(0, 0);
      getElementByXPath(element)?.classList.remove('fade_out');
      document.body.dataset.template = page.model.template;
      document.body.dataset.page = page.model.slug;
    });
    //lazyLoading();
  }, onePageConfig.transitionDuration);
}


// creates a loading indicator (div) and updates its width
function loadIndicator(cmd){
  var loadBar = document.getElementById('loading_bar') ?? document.createElement('DIV');
  switch(cmd){
    case 'start':
      loadBar.id = 'loading_bar';
      document.body.appendChild(loadBar);
      setTimeout(()=>loadBar.style.width = '33%', 10);
      break;
    case 'response':
      loadBar.style.width = '66%';
      break;
    case 'finish':
      loadBar.style.width = '100%';
      setTimeout(()=>loadBar.style.opacity=0, onePageConfig.transitionDuration*2);
      setTimeout(()=>loadBar.remove(), onePageConfig.transitionDuration*3);
      break;
  }
}


// cancels all media tag requests to clear up bandwidth
function stopRequests(){
  //cancel image downloads
  if( window.stop !== undefined ){
       window.stop();
  }
  // forcefully abort unfinished media requests
  document.querySelectorAll('video, img').forEach((media) => {
    if(!media.complete){
      media.pause();
      media.src = 'about:blank';
      media.load();
    }
  });
}


// stops all registered interval to prevent page specific code from being executed once another page has been loaded
function clearIntervals(){
  intervals.map((i) => {
    clearInterval(i);
    intervals = [];
  })
}


function disconnectObserver(){
  if(typeof resizeObserver != 'undefined'){
    resizeObserver.disconnect();
  }
}


// changes html head title
function changeTitle(title){
  const newTitle = title+' '+document.title.substring(document.title.indexOf('|'));
  document.title = newTitle;
}


// function that re-appends script tags to trigger them
function setInnerHTML(element, html) {
  if( onePageConfig.inner ){
    element.innerHTML = html;
  } else {
    const range = document.createRange();
    const fragment = range.createContextualFragment(html);
    element.replaceWith(fragment);
    element = fragment;
  }
  Array.from(element.querySelectorAll("script")).forEach( oldScriptEl => {
    const newScriptEl = document.createElement("script");
    Array.from(oldScriptEl.attributes).forEach( attr => {
      newScriptEl.setAttribute(attr.name, attr.value)
    });
    const scriptText = document.createTextNode(oldScriptEl.innerHTML);
    newScriptEl.appendChild(scriptText);
    oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
  });
}


// because php uses xpath querries for its dom node query, defined in the config.php plugins settings
function getElementByXPath(xpathExpression){
  const result = document.evaluate('//'+xpathExpression, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  const firstNode = result.singleNodeValue;
  if( firstNode ){
    return firstNode;
  } else {
    return null;
  }
}


// this might need a revision to suit your needs
function toggleNav(navLink){
  document.querySelectorAll('.'+onePageConfig.activeLinkClass).forEach((activeLink) => {
    activeLink.classList.remove(onePageConfig.activeLinkClass);
  });
  navLink.classList.add(onePageConfig.activeLinkClass);
}
