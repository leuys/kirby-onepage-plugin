# Kirby One Page Plugin

## How to use

1. Add this line to inject the one page javascript. Ideally in the *\<head\>-tag

```
js('/media/plugins/studio-bu/onepage/onepage.js')
```

2. Add these options to the Kirby *config.php*

```
'onepage' => [
    'tag' => 'main', // The HTML element which will be replaced by the new page = DOMXPath querry (i.e. 'div[@id="my-div"]') without '//'
    'inner' => true, // if the inner html or the whole tag shall be replaced
    'transitionDuration' => 1000, // The page content exchange transition duration
    'transitionClass' => 'fade_out' // Body tag class while in transition
    'activeLinkClass' => 'active_link', // class for internal link once clicked
],
```

## License

MIT

## Credits

- [Benjamin Unterluggauer](leuys.com)
