# Kirby One Page Plugin

## WIP

Disclaimer: This plugin might not work out of the box. For example if you would like to add page transition effects. These will need to be written to correclty fit your page setup.

## Description

This plugin transforms a kirby page to a one pager asynchronously loading page content and replacing it on the fly. You can specify the tag in the DOM which should get replaced by the newly rendered page content 

## How to use

1. Add these options to the Kirby *config.php*

```
'onepage' => [
    'active' => true, // De-Activates the plugin
    'tag' => 'main', // The HTML element which will be replaced by the new page = DOMXPath querry (i.e. 'div[@id="my-div"]') without '//'
    'inner' => true, // if the inner html or the whole tag shall get replaced
    'transitionDuration' => 1000, // The page content exchange transition duration
    'transitionClass' => 'fade_out' // Body tag class while in transition
    'activeLinkClass' => 'active_link', // class for internal link once clicked
    'loadingClass' => 'semi_fade', // class applied to the tag while content is getting fetched
],
```

## License

MIT

## Credits

- [Benjamin Unterluggauer](leuys.com)
