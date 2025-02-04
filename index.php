<?php

Kirby::plugin('studio-bu/onepage', [
  'hooks' => [
    'page.render:after' => function ($html, $page) {
      if( option('onepage.active') ){
        $onepageScript = js('/media/plugins/studio-bu/onepage/onepage.js');
        $scriptTag = '<script>const rootPath="'.kirby()->url().'";const onePageConfig='.json_encode(option('onepage')).';</script>';
        $styleTag = '<style>:root{--page-transition-duration:'.option('onepage.transitionDuration').'ms;}</style>';
        return str_replace('</head>', $scriptTag.$styleTag.$onepageScript.'</head>', $html);
      }
      
    }
  ],
  'routes' => [
    [
      'pattern' => '(:all).json',
      'action'  => function ($path) {
        $page = page($path);
        if( !$page ){
          return json_encode(['error' => 'Page not found'], 404);
        }

        $html = $page->render();
        $dom = new DOMDocument;
        libxml_use_internal_errors(true);
        $dom->loadHTML($html);
        libxml_clear_errors();
        $xpath = new DOMXPath($dom);
        $targetElement = $xpath->query('//'.option('onepage.tag'))->item(0);
        
        $innerHtml = '';
        if( option('onepage.inner') ){
          if ($targetElement) {
            foreach ($targetElement->childNodes as $child) {
              $innerHtml .= $dom->saveHTML($child);
            }
          }
        } else {
          $innerHtml = $dom->saveHTML($targetElement);
        }
             
        $pageModel = $page->toArray();
        $pageModel['template'] = $page->template()->name();
        $pageModel['intendedTemplate'] = $page->intendedTemplate()->name();
        
        $json[] = [
          'html' => [
            'main' => $innerHtml,
            ],
          'model' => $pageModel
        ];
        return json_encode($json);
      }
    ]
  ]
]);
