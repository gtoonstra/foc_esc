// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function f(){ log.history = log.history || []; log.history.push(arguments); if(this.console) { var args = arguments, newarr; args.callee = args.callee.caller; newarr = [].slice.call(args); if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);}};

// make it safe to use console.log always
(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());



/*! http://mths.be/placeholder v2.0.7 by @mathias */
;(function(f,h,$){var a='placeholder' in h.createElement('input'),d='placeholder' in h.createElement('textarea'),i=$.fn,c=$.valHooks,k,j;if(a&&d){j=i.placeholder=function(){return this};j.input=j.textarea=true}else{j=i.placeholder=function(){var l=this;l.filter((a?'textarea':':input')+'[placeholder]').not('.placeholder').bind({'focus.placeholder':b,'blur.placeholder':e}).data('placeholder-enabled',true).trigger('blur.placeholder');return l};j.input=a;j.textarea=d;k={get:function(m){var l=$(m);return l.data('placeholder-enabled')&&l.hasClass('placeholder')?'':m.value},set:function(m,n){var l=$(m);if(!l.data('placeholder-enabled')){return m.value=n}if(n==''){m.value=n;if(m!=h.activeElement){e.call(m)}}else{if(l.hasClass('placeholder')){b.call(m,true,n)||(m.value=n)}else{m.value=n}}return l}};a||(c.input=k);d||(c.textarea=k);$(function(){$(h).delegate('form','submit.placeholder',function(){var l=$('.placeholder',this).each(b);setTimeout(function(){l.each(e)},10)})});$(f).bind('beforeunload.placeholder',function(){$('.placeholder').each(function(){this.value=''})})}function g(m){var l={},n=/^jQuery\d+$/;$.each(m.attributes,function(p,o){if(o.specified&&!n.test(o.name)){l[o.name]=o.value}});return l}function b(m,n){var l=this,o=$(l);if(l.value==o.attr('placeholder')&&o.hasClass('placeholder')){if(o.data('placeholder-password')){o=o.hide().next().show().attr('id',o.removeAttr('id').data('placeholder-id'));if(m===true){return o[0].value=n}o.focus()}else{l.value='';o.removeClass('placeholder');l==h.activeElement&&l.select()}}}function e(){var q,l=this,p=$(l),m=p,o=this.id;if(l.value==''){if(l.type=='password'){if(!p.data('placeholder-textinput')){try{q=p.clone().attr({type:'text'})}catch(n){q=$('<input>').attr($.extend(g(this),{type:'text'}))}q.removeAttr('name').data({'placeholder-password':true,'placeholder-id':o}).bind('focus.placeholder',b);p.data({'placeholder-textinput':q,'placeholder-id':o}).before(q)}p=p.removeAttr('id').hide().prev().attr('id',o).show()}p.addClass('placeholder');p[0].value=p.attr('placeholder')}else{p.removeClass('placeholder')}}}(this,document,jQuery));

/*
 * jQuery Custom Forms Plugin 1.0
 * www.ZURB.com
 * Copyright 2010, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/

jQuery.foundation = jQuery.foundation || {};
jQuery.foundation.customForms = jQuery.foundation.customForms || {};

jQuery(document).ready(function ($) {
    
  $.foundation.customForms.appendCustomMarkup = function (options) {
    var defaults = {
      disable_class: "js-disable-custom"
    };
    var options = $.extend(defaults, options);
    
    function appendCustomMarkup(idx, sel) {
      var $this = $(sel).hide(),
          type  = $this.attr('type'),
          $span = $this.next('span.custom.' + type);

      if ($span.length === 0) {
        $span = $('<span class="custom ' + type + '"></span>').insertAfter($this);
      }

      $span.toggleClass('checked', $this.is(':checked'));
      $span.toggleClass('disabled', $this.is(':disabled'));
    }

    function appendCustomSelect(idx, sel) {
      var $this = $(sel),
          $customSelect = $this.next('div.custom.dropdown'),
          $options = $this.find('option'),
          $seloptions = $this.find('option:selected'),
          maxWidth = 0,
          $li;

      if ($this.hasClass('no-custom')) { return; }
      if ($customSelect.length === 0) {
        $customSelectSize = '';
        if ($(sel).hasClass('small')) {
          $customSelectSize = 'small';
        } else if ($(sel).hasClass('medium')) {
          $customSelectSize = 'medium';
        } else if ($(sel).hasClass('large')) {
          $customSelectSize = 'large';
        } else if ($(sel).hasClass('expand')) {
          $customSelectSize = 'expand';
        }
        $customSelect = $('<div class="custom dropdown ' + $customSelectSize + '"><a href="#" class="selector"></a><ul></ul></div>"');
        $options.each(function () {
          $li = $('<li>' + $(this).html() + '</li>');
          $customSelect.find('ul').append($li);
        });
        $customSelect.prepend('<a href="#" class="current">' + $seloptions.html() + '</a>');

        $this.after($customSelect);
        $this.hide();

      } else {
        // refresh the ul with options from the select in case the supplied markup doesn't match
        $customSelect.find('ul').html('');
        $options.each(function () {
          $li = $('<li>' + $(this).html() + '</li>');
          $customSelect.find('ul').append($li);
        });
      }

      $customSelect.toggleClass('disabled', $this.is(':disabled'));

      $options.each(function (index) {
        if (this.selected) {
          $customSelect.find('li').eq(index).addClass('selected');
          $customSelect.find('.current').html($(this).html());
        }
      });

      $customSelect.css('width', 'inherit');
      $customSelect.find('ul').css('width', 'inherit');

      $customSelect.find('li').each(function () {
        $customSelect.addClass('open');
        if ($(this).outerWidth() > maxWidth) {
          maxWidth = $(this).outerWidth();
        }
        $customSelect.removeClass('open');
      });

      if (!$customSelect.is('.small, .medium, .large, .expand')) {
        $customSelect.css('width', maxWidth + 18 + 'px');
        $customSelect.find('ul').css('width', maxWidth + 16 + 'px');
      }

    }
    
    $('form.custom input:radio[data-customforms!=disabled]').each(appendCustomMarkup);
    $('form.custom input:checkbox[data-customforms!=disabled]').each(appendCustomMarkup);
    $('form.custom select[data-customforms!=disabled]').each(appendCustomSelect);
  };

});

(function ($) {
  
  function refreshCustomSelect($select) {
    var maxWidth = 0,
        $customSelect = $select.next();
    $options = $select.find('option');
    $customSelect.find('ul').html('');
    
    $options.each(function () {
      $li = $('<li>' + $(this).html() + '</li>');
      $customSelect.find('ul').append($li);
    });
    
    // re-populate
    $options.each(function (index) {
      if (this.selected) {
        $customSelect.find('li').eq(index).addClass('selected');
        $customSelect.find('.current').html($(this).html());
      }
    });
    
    // fix width
    $customSelect.removeAttr('style')
      .find('ul').removeAttr('style');
    $customSelect.find('li').each(function () {
      $customSelect.addClass('open');
      if ($(this).outerWidth() > maxWidth) {
        maxWidth = $(this).outerWidth();
      }
      $customSelect.removeClass('open');
    });
    $customSelect.css('width', maxWidth + 18 + 'px');
    $customSelect.find('ul').css('width', maxWidth + 16 + 'px');
    
  }
  
  function toggleCheckbox($element) {
    var $input = $element.prev(),
        input = $input[0];

    if (false == $input.is(':disabled')) {
        input.checked = ((input.checked) ? false : true);
        $element.toggleClass('checked');

        $input.trigger('change');
    }
  }
  
  function toggleRadio($element) {
    var $input = $element.prev(),
        input = $input[0];

    if (false == $input.is(':disabled')) {
      $('input:radio[name="' + $input.attr('name') + '"]').each(function () {
        $(this).next().removeClass('checked');
      });
      input.checked = ((input.checked) ? false : true);
      $element.toggleClass('checked');
    
      $input.trigger('change');
    }
  }
  
  $('form.custom span.custom.checkbox').live('click', function (event) {
    event.preventDefault();
    event.stopPropagation();
    
    toggleCheckbox($(this));
  });
  
  $('form.custom span.custom.radio').live('click', function (event) {
    event.preventDefault();
    event.stopPropagation();
    
    toggleRadio($(this));
  });
  
  $('form.custom select').live('change', function (event) {
    refreshCustomSelect($(this));
  });
  
  $('form.custom label').live('click', function (event) {
    var $associatedElement = $('#' + $(this).attr('for')),
        $customCheckbox,
        $customRadio;
    if ($associatedElement.length !== 0) {
      if ($associatedElement.attr('type') === 'checkbox') {
        event.preventDefault();
        $customCheckbox = $(this).find('span.custom.checkbox');
        toggleCheckbox($customCheckbox);
      } else if ($associatedElement.attr('type') === 'radio') {
        event.preventDefault();
        $customRadio = $(this).find('span.custom.radio');
        toggleRadio($customRadio);
      }
    }
  });

  $('form.custom div.custom.dropdown a.current, form.custom div.custom.dropdown a.selector').live('click', function (event) {
    var $this = $(this),
        $dropdown = $this.closest('div.custom.dropdown'),
        $select = $dropdown.prev();
    
    event.preventDefault();
    $('div.dropdown').removeClass('open');

    if (false == $select.is(':disabled')) {
        $dropdown.toggleClass('open');

        if ($dropdown.hasClass('open')) {
          $(document).bind('click.customdropdown', function (event) {
            $dropdown.removeClass('open');
            $(document).unbind('.customdropdown');
          });
        } else {
          $(document).unbind('.customdropdown');
        }
        return false;
    }
  });
  
  $('form.custom div.custom.dropdown li').live('click', function (event) {
    var $this = $(this),
        $customDropdown = $this.closest('div.custom.dropdown'),
        $select = $customDropdown.prev(),
        selectedIndex = 0;
        
    event.preventDefault();
    event.stopPropagation();
    $('div.dropdown').removeClass('open');
    
    $this
      .closest('ul')
      .find('li')
      .removeClass('selected');
    $this.addClass('selected');
    
    $customDropdown
      .removeClass('open')
      .find('a.current')
      .html($this.html());
    
    $this.closest('ul').find('li').each(function (index) {
      if ($this[0] == this) {
        selectedIndex = index;
      }
      
    });
    $select[0].selectedIndex = selectedIndex;
    
    $select.trigger('change');
  });
})(jQuery);



/**
 * Isotope v1.5.19
 * An exquisite jQuery plugin for magical layouts
 * http://isotope.metafizzy.co
 *
 * Commercial use requires one-time license fee
 * http://metafizzy.co/#licenses
 *
 * Copyright 2012 David DeSandro / Metafizzy
 */

/*jshint asi: true, browser: true, curly: true, eqeqeq: true, forin: false, immed: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: false */

(function( window, $, undefined ){

  'use strict';

  // get global vars
  var document = window.document;
  var Modernizr = window.Modernizr;

  // helper function
  var capitalize = function( str ) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // ========================= getStyleProperty by kangax ===============================
  // http://perfectionkills.com/feature-testing-css-properties/

  var prefixes = 'Moz Webkit O Ms'.split(' ');

  var getStyleProperty = function( propName ) {
    var style = document.documentElement.style,
        prefixed;

    // test standard property first
    if ( typeof style[propName] === 'string' ) {
      return propName;
    }

    // capitalize
    propName = capitalize( propName );

    // test vendor specific properties
    for ( var i=0, len = prefixes.length; i < len; i++ ) {
      prefixed = prefixes[i] + propName;
      if ( typeof style[ prefixed ] === 'string' ) {
        return prefixed;
      }
    }
  };

  var transformProp = getStyleProperty('transform'),
      transitionProp = getStyleProperty('transitionProperty');


  // ========================= miniModernizr ===============================
  // <3<3<3 and thanks to Faruk and Paul for doing the heavy lifting

  /*!
   * Modernizr v1.6ish: miniModernizr for Isotope
   * http://www.modernizr.com
   *
   * Developed by:
   * - Faruk Ates  http://farukat.es/
   * - Paul Irish  http://paulirish.com/
   *
   * Copyright (c) 2009-2010
   * Dual-licensed under the BSD or MIT licenses.
   * http://www.modernizr.com/license/
   */

  /*
   * This version whittles down the script just to check support for
   * CSS transitions, transforms, and 3D transforms.
  */

  var tests = {
    csstransforms: function() {
      return !!transformProp;
    },

    csstransforms3d: function() {
      var test = !!getStyleProperty('perspective');
      // double check for Chrome's false positive
      if ( test ) {
        var vendorCSSPrefixes = ' -o- -moz- -ms- -webkit- -khtml- '.split(' '),
            mediaQuery = '@media (' + vendorCSSPrefixes.join('transform-3d),(') + 'modernizr)',
            $style = $('<style>' + mediaQuery + '{#modernizr{height:3px}}' + '</style>')
                        .appendTo('head'),
            $div = $('<div id="modernizr" />').appendTo('html');

        test = $div.height() === 3;

        $div.remove();
        $style.remove();
      }
      return test;
    },

    csstransitions: function() {
      return !!transitionProp;
    }
  };

  var testName;

  if ( Modernizr ) {
    // if there's a previous Modernzir, check if there are necessary tests
    for ( testName in tests) {
      if ( !Modernizr.hasOwnProperty( testName ) ) {
        // if test hasn't been run, use addTest to run it
        Modernizr.addTest( testName, tests[ testName ] );
      }
    }
  } else {
    // or create new mini Modernizr that just has the 3 tests
    Modernizr = window.Modernizr = {
      _version : '1.6ish: miniModernizr for Isotope'
    };

    var classes = ' ';
    var result;

    // Run through tests
    for ( testName in tests) {
      result = tests[ testName ]();
      Modernizr[ testName ] = result;
      classes += ' ' + ( result ?  '' : 'no-' ) + testName;
    }

    // Add the new classes to the <html> element.
    $('html').addClass( classes );
  }


  // ========================= isoTransform ===============================

  /**
   *  provides hooks for .css({ scale: value, translate: [x, y] })
   *  Progressively enhanced CSS transforms
   *  Uses hardware accelerated 3D transforms for Safari
   *  or falls back to 2D transforms.
   */

  if ( Modernizr.csstransforms ) {

        // i.e. transformFnNotations.scale(0.5) >> 'scale3d( 0.5, 0.5, 1)'
    var transformFnNotations = Modernizr.csstransforms3d ?
      { // 3D transform functions
        translate : function ( position ) {
          return 'translate3d(' + position[0] + 'px, ' + position[1] + 'px, 0) ';
        },
        scale : function ( scale ) {
          return 'scale3d(' + scale + ', ' + scale + ', 1) ';
        }
      } :
      { // 2D transform functions
        translate : function ( position ) {
          return 'translate(' + position[0] + 'px, ' + position[1] + 'px) ';
        },
        scale : function ( scale ) {
          return 'scale(' + scale + ') ';
        }
      }
    ;

    var setIsoTransform = function ( elem, name, value ) {
          // unpack current transform data
      var data =  $.data( elem, 'isoTransform' ) || {},
          newData = {},
          fnName,
          transformObj = {},
          transformValue;

      // i.e. newData.scale = 0.5
      newData[ name ] = value;
      // extend new value over current data
      $.extend( data, newData );

      for ( fnName in data ) {
        transformValue = data[ fnName ];
        transformObj[ fnName ] = transformFnNotations[ fnName ]( transformValue );
      }

      // get proper order
      // ideally, we could loop through this give an array, but since we only have
      // a couple transforms we're keeping track of, we'll do it like so
      var translateFn = transformObj.translate || '',
          scaleFn = transformObj.scale || '',
          // sorting so translate always comes first
          valueFns = translateFn + scaleFn;

      // set data back in elem
      $.data( elem, 'isoTransform', data );

      // set name to vendor specific property
      elem.style[ transformProp ] = valueFns;
    };

    // ==================== scale ===================

    $.cssNumber.scale = true;

    $.cssHooks.scale = {
      set: function( elem, value ) {
        // uncomment this bit if you want to properly parse strings
        // if ( typeof value === 'string' ) {
        //   value = parseFloat( value );
        // }
        setIsoTransform( elem, 'scale', value );
      },
      get: function( elem, computed ) {
        var transform = $.data( elem, 'isoTransform' );
        return transform && transform.scale ? transform.scale : 1;
      }
    };

    $.fx.step.scale = function( fx ) {
      $.cssHooks.scale.set( fx.elem, fx.now+fx.unit );
    };


    // ==================== translate ===================

    $.cssNumber.translate = true;

    $.cssHooks.translate = {
      set: function( elem, value ) {

        // uncomment this bit if you want to properly parse strings
        // if ( typeof value === 'string' ) {
        //   value = value.split(' ');
        // }
        //
        // var i, val;
        // for ( i = 0; i < 2; i++ ) {
        //   val = value[i];
        //   if ( typeof val === 'string' ) {
        //     val = parseInt( val );
        //   }
        // }

        setIsoTransform( elem, 'translate', value );
      },

      get: function( elem, computed ) {
        var transform = $.data( elem, 'isoTransform' );
        return transform && transform.translate ? transform.translate : [ 0, 0 ];
      }
    };

  }

  // ========================= get transition-end event ===============================
  var transitionEndEvent, transitionDurProp;

  if ( Modernizr.csstransitions ) {
    transitionEndEvent = {
      WebkitTransitionProperty: 'webkitTransitionEnd',  // webkit
      MozTransitionProperty: 'transitionend',
      OTransitionProperty: 'oTransitionEnd',
      transitionProperty: 'transitionEnd'
    }[ transitionProp ];

    transitionDurProp = getStyleProperty('transitionDuration');
  }

  // ========================= smartresize ===============================

  /*
   * smartresize: debounced resize event for jQuery
   *
   * latest version and complete README available on Github:
   * https://github.com/louisremi/jquery.smartresize.js
   *
   * Copyright 2011 @louis_remi
   * Licensed under the MIT license.
   */

  var $event = $.event,
      resizeTimeout;

  $event.special.smartresize = {
    setup: function() {
      $(this).bind( "resize", $event.special.smartresize.handler );
    },
    teardown: function() {
      $(this).unbind( "resize", $event.special.smartresize.handler );
    },
    handler: function( event, execAsap ) {
      // Save the context
      var context = this,
          args = arguments;

      // set correct event type
      event.type = "smartresize";

      if ( resizeTimeout ) { clearTimeout( resizeTimeout ); }
      resizeTimeout = setTimeout(function() {
        jQuery.event.handle.apply( context, args );
      }, execAsap === "execAsap"? 0 : 100 );
    }
  };

  $.fn.smartresize = function( fn ) {
    return fn ? this.bind( "smartresize", fn ) : this.trigger( "smartresize", ["execAsap"] );
  };



// ========================= Isotope ===============================


  // our "Widget" object constructor
  $.Isotope = function( options, element, callback ){
    this.element = $( element );

    this._create( options );
    this._init( callback );
  };

  // styles of container element we want to keep track of
  var isoContainerStyles = [ 'width', 'height' ];

  var $window = $(window);

  $.Isotope.settings = {
    resizable: true,
    layoutMode : 'masonry',
    containerClass : 'isotope',
    itemClass : 'isotope-item',
    hiddenClass : 'isotope-hidden',
    hiddenStyle: { opacity: 0, scale: 0.001 },
    visibleStyle: { opacity: 1, scale: 1 },
    containerStyle: {
      position: 'relative',
      overflow: 'hidden'
    },
    animationEngine: 'best-available',
    animationOptions: {
      queue: false,
      duration: 800
    },
    sortBy : 'original-order',
    sortAscending : true,
    resizesContainer : true,
    transformsEnabled: !$.browser.opera, // disable transforms in Opera
    itemPositionDataEnabled: false
  };

  $.Isotope.prototype = {

    // sets up widget
    _create : function( options ) {

      this.options = $.extend( {}, $.Isotope.settings, options );

      this.styleQueue = [];
      this.elemCount = 0;

      // get original styles in case we re-apply them in .destroy()
      var elemStyle = this.element[0].style;
      this.originalStyle = {};
      // keep track of container styles
      var containerStyles = isoContainerStyles.slice(0);
      for ( var prop in this.options.containerStyle ) {
        containerStyles.push( prop );
      }
      for ( var i=0, len = containerStyles.length; i < len; i++ ) {
        prop = containerStyles[i];
        this.originalStyle[ prop ] = elemStyle[ prop ] || '';
      }
      // apply container style from options
      this.element.css( this.options.containerStyle );

      this._updateAnimationEngine();
      this._updateUsingTransforms();

      // sorting
      var originalOrderSorter = {
        'original-order' : function( $elem, instance ) {
          instance.elemCount ++;
          return instance.elemCount;
        },
        random : function() {
          return Math.random();
        }
      };

      this.options.getSortData = $.extend( this.options.getSortData, originalOrderSorter );

      // need to get atoms
      this.reloadItems();

      // get top left position of where the bricks should be
      this.offset = {
        left: parseInt( ( this.element.css('padding-left') || 0 ), 10 ),
        top: parseInt( ( this.element.css('padding-top') || 0 ), 10 )
      };

      // add isotope class first time around
      var instance = this;
      setTimeout( function() {
        instance.element.addClass( instance.options.containerClass );
      }, 0 );

      // bind resize method
      if ( this.options.resizable ) {
        $window.bind( 'smartresize.isotope', function() {
          instance.resize();
        });
      }

      // dismiss all click events from hidden events
      this.element.delegate( '.' + this.options.hiddenClass, 'click', function(){
        return false;
      });

    },

    _getAtoms : function( $elems ) {
      var selector = this.options.itemSelector,
          // filter & find
          $atoms = selector ? $elems.filter( selector ).add( $elems.find( selector ) ) : $elems,
          // base style for atoms
          atomStyle = { position: 'absolute' };

      if ( this.usingTransforms ) {
        atomStyle.left = 0;
        atomStyle.top = 0;
      }

      $atoms.css( atomStyle ).addClass( this.options.itemClass );

      this.updateSortData( $atoms, true );

      return $atoms;
    },

    // _init fires when your instance is first created
    // (from the constructor above), and when you
    // attempt to initialize the widget again (by the bridge)
    // after it has already been initialized.
    _init : function( callback ) {

      this.$filteredAtoms = this._filter( this.$allAtoms );
      this._sort();
      this.reLayout( callback );

    },

    option : function( opts ){
      // change options AFTER initialization:
      // signature: $('#foo').bar({ cool:false });
      if ( $.isPlainObject( opts ) ){
        this.options = $.extend( true, this.options, opts );

        // trigger _updateOptionName if it exists
        var updateOptionFn;
        for ( var optionName in opts ) {
          updateOptionFn = '_update' + capitalize( optionName );
          if ( this[ updateOptionFn ] ) {
            this[ updateOptionFn ]();
          }
        }
      }
    },

    // ====================== updaters ====================== //
    // kind of like setters

    _updateAnimationEngine : function() {
      var animationEngine = this.options.animationEngine.toLowerCase().replace( /[ _\-]/g, '');
      var isUsingJQueryAnimation;
      // set applyStyleFnName
      switch ( animationEngine ) {
        case 'css' :
        case 'none' :
          isUsingJQueryAnimation = false;
          break;
        case 'jquery' :
          isUsingJQueryAnimation = true;
          break;
        default : // best available
          isUsingJQueryAnimation = !Modernizr.csstransitions;
      }
      this.isUsingJQueryAnimation = isUsingJQueryAnimation;
      this._updateUsingTransforms();
    },

    _updateTransformsEnabled : function() {
      this._updateUsingTransforms();
    },

    _updateUsingTransforms : function() {
      var usingTransforms = this.usingTransforms = this.options.transformsEnabled &&
        Modernizr.csstransforms && Modernizr.csstransitions && !this.isUsingJQueryAnimation;

      // prevent scales when transforms are disabled
      if ( !usingTransforms ) {
        delete this.options.hiddenStyle.scale;
        delete this.options.visibleStyle.scale;
      }

      this.getPositionStyles = usingTransforms ? this._translate : this._positionAbs;
    },


    // ====================== Filtering ======================

    _filter : function( $atoms ) {
      var filter = this.options.filter === '' ? '*' : this.options.filter;

      if ( !filter ) {
        return $atoms;
      }

      var hiddenClass    = this.options.hiddenClass,
          hiddenSelector = '.' + hiddenClass,
          $hiddenAtoms   = $atoms.filter( hiddenSelector ),
          $atomsToShow   = $hiddenAtoms;

      if ( filter !== '*' ) {
        $atomsToShow = $hiddenAtoms.filter( filter );
        var $atomsToHide = $atoms.not( hiddenSelector ).not( filter ).addClass( hiddenClass );
        this.styleQueue.push({ $el: $atomsToHide, style: this.options.hiddenStyle });
      }

      this.styleQueue.push({ $el: $atomsToShow, style: this.options.visibleStyle });
      $atomsToShow.removeClass( hiddenClass );

      return $atoms.filter( filter );
    },

    // ====================== Sorting ======================

    updateSortData : function( $atoms, isIncrementingElemCount ) {
      var instance = this,
          getSortData = this.options.getSortData,
          $this, sortData;
      $atoms.each(function(){
        $this = $(this);
        sortData = {};
        // get value for sort data based on fn( $elem ) passed in
        for ( var key in getSortData ) {
          if ( !isIncrementingElemCount && key === 'original-order' ) {
            // keep original order original
            sortData[ key ] = $.data( this, 'isotope-sort-data' )[ key ];
          } else {
            sortData[ key ] = getSortData[ key ]( $this, instance );
          }
        }
        // apply sort data to element
        $.data( this, 'isotope-sort-data', sortData );
      });
    },

    // used on all the filtered atoms
    _sort : function() {

      var sortBy = this.options.sortBy,
          getSorter = this._getSorter,
          sortDir = this.options.sortAscending ? 1 : -1,
          sortFn = function( alpha, beta ) {
            var a = getSorter( alpha, sortBy ),
                b = getSorter( beta, sortBy );
            // fall back to original order if data matches
            if ( a === b && sortBy !== 'original-order') {
              a = getSorter( alpha, 'original-order' );
              b = getSorter( beta, 'original-order' );
            }
            return ( ( a > b ) ? 1 : ( a < b ) ? -1 : 0 ) * sortDir;
          };

      this.$filteredAtoms.sort( sortFn );
    },

    _getSorter : function( elem, sortBy ) {
      return $.data( elem, 'isotope-sort-data' )[ sortBy ];
    },

    // ====================== Layout Helpers ======================

    _translate : function( x, y ) {
      return { translate : [ x, y ] };
    },

    _positionAbs : function( x, y ) {
      return { left: x, top: y };
    },

    _pushPosition : function( $elem, x, y ) {
      x = Math.round( x + this.offset.left );
      y = Math.round( y + this.offset.top );
      var position = this.getPositionStyles( x, y );
      this.styleQueue.push({ $el: $elem, style: position });
      if ( this.options.itemPositionDataEnabled ) {
        $elem.data('isotope-item-position', {x: x, y: y} );
      }
    },


    // ====================== General Layout ======================

    // used on collection of atoms (should be filtered, and sorted before )
    // accepts atoms-to-be-laid-out to start with
    layout : function( $elems, callback ) {

      var layoutMode = this.options.layoutMode;

      // layout logic
      this[ '_' +  layoutMode + 'Layout' ]( $elems );

      // set the size of the container
      if ( this.options.resizesContainer ) {
        var containerStyle = this[ '_' +  layoutMode + 'GetContainerSize' ]();
        this.styleQueue.push({ $el: this.element, style: containerStyle });
      }

      this._processStyleQueue( $elems, callback );

      this.isLaidOut = true;
    },

    _processStyleQueue : function( $elems, callback ) {
      // are we animating the layout arrangement?
      // use plugin-ish syntax for css or animate
      var styleFn = !this.isLaidOut ? 'css' : (
            this.isUsingJQueryAnimation ? 'animate' : 'css'
          ),
          animOpts = this.options.animationOptions,
          onLayout = this.options.onLayout,
          objStyleFn, processor,
          triggerCallbackNow, callbackFn;

      // default styleQueue processor, may be overwritten down below
      processor = function( i, obj ) {
        obj.$el[ styleFn ]( obj.style, animOpts );
      };

      if ( this._isInserting && this.isUsingJQueryAnimation ) {
        // if using styleQueue to insert items
        processor = function( i, obj ) {
          // only animate if it not being inserted
          objStyleFn = obj.$el.hasClass('no-transition') ? 'css' : styleFn;
          obj.$el[ objStyleFn ]( obj.style, animOpts );
        };

      } else if ( callback || onLayout || animOpts.complete ) {
        // has callback
        var isCallbackTriggered = false,
            // array of possible callbacks to trigger
            callbacks = [ callback, onLayout, animOpts.complete ],
            instance = this;
        triggerCallbackNow = true;
        // trigger callback only once
        callbackFn = function() {
          if ( isCallbackTriggered ) {
            return;
          }
          var hollaback;
          for (var i=0, len = callbacks.length; i < len; i++) {
            hollaback = callbacks[i];
            if ( typeof hollaback === 'function' ) {
              hollaback.call( instance.element, $elems, instance );
            }
          }
          isCallbackTriggered = true;
        };

        if ( this.isUsingJQueryAnimation && styleFn === 'animate' ) {
          // add callback to animation options
          animOpts.complete = callbackFn;
          triggerCallbackNow = false;

        } else if ( Modernizr.csstransitions ) {
          // detect if first item has transition
          var i = 0,
              firstItem = this.styleQueue[0],
              testElem = firstItem && firstItem.$el,
              styleObj;
          // get first non-empty jQ object
          while ( !testElem || !testElem.length ) {
            styleObj = this.styleQueue[ i++ ];
            // HACK: sometimes styleQueue[i] is undefined
            if ( !styleObj ) {
              return;
            }
            testElem = styleObj.$el;
          }
          // get transition duration of the first element in that object
          // yeah, this is inexact
          var duration = parseFloat( getComputedStyle( testElem[0] )[ transitionDurProp ] );
          if ( duration > 0 ) {
            processor = function( i, obj ) {
              obj.$el[ styleFn ]( obj.style, animOpts )
                // trigger callback at transition end
                .one( transitionEndEvent, callbackFn );
            };
            triggerCallbackNow = false;
          }
        }
      }

      // process styleQueue
      $.each( this.styleQueue, processor );

      if ( triggerCallbackNow ) {
        callbackFn();
      }

      // clear out queue for next time
      this.styleQueue = [];
    },


    resize : function() {
      if ( this[ '_' + this.options.layoutMode + 'ResizeChanged' ]() ) {
        this.reLayout();
      }
    },


    reLayout : function( callback ) {

      this[ '_' +  this.options.layoutMode + 'Reset' ]();
      this.layout( this.$filteredAtoms, callback );

    },

    // ====================== Convenience methods ======================

    // ====================== Adding items ======================

    // adds a jQuery object of items to a isotope container
    addItems : function( $content, callback ) {
      var $newAtoms = this._getAtoms( $content );
      // add new atoms to atoms pools
      this.$allAtoms = this.$allAtoms.add( $newAtoms );

      if ( callback ) {
        callback( $newAtoms );
      }
    },

    // convienence method for adding elements properly to any layout
    // positions items, hides them, then animates them back in <--- very sezzy
    insert : function( $content, callback ) {
      // position items
      this.element.append( $content );

      var instance = this;
      this.addItems( $content, function( $newAtoms ) {
        var $newFilteredAtoms = instance._filter( $newAtoms );
        instance._addHideAppended( $newFilteredAtoms );
        instance._sort();
        instance.reLayout();
        instance._revealAppended( $newFilteredAtoms, callback );
      });

    },

    // convienence method for working with Infinite Scroll
    appended : function( $content, callback ) {
      var instance = this;
      this.addItems( $content, function( $newAtoms ) {
        instance._addHideAppended( $newAtoms );
        instance.layout( $newAtoms );
        instance._revealAppended( $newAtoms, callback );
      });
    },

    // adds new atoms, then hides them before positioning
    _addHideAppended : function( $newAtoms ) {
      this.$filteredAtoms = this.$filteredAtoms.add( $newAtoms );
      $newAtoms.addClass('no-transition');

      this._isInserting = true;

      // apply hidden styles
      this.styleQueue.push({ $el: $newAtoms, style: this.options.hiddenStyle });
    },

    // sets visible style on new atoms
    _revealAppended : function( $newAtoms, callback ) {
      var instance = this;
      // apply visible style after a sec
      setTimeout( function() {
        // enable animation
        $newAtoms.removeClass('no-transition');
        // reveal newly inserted filtered elements
        instance.styleQueue.push({ $el: $newAtoms, style: instance.options.visibleStyle });
        instance._isInserting = false;
        instance._processStyleQueue( $newAtoms, callback );
      }, 10 );
    },

    // gathers all atoms
    reloadItems : function() {
      this.$allAtoms = this._getAtoms( this.element.children() );
    },

    // removes elements from Isotope widget
    remove: function( $content, callback ) {
      // remove elements from Isotope instance in callback
      var instance = this;
      // remove() as a callback, for after transition / animation
      var removeContent = function() {
        instance.$allAtoms = instance.$allAtoms.not( $content );
        $content.remove();
        if ( callback ) {
          callback.call( instance.element );
        }
      };

      if ( $content.filter( ':not(.' + this.options.hiddenClass + ')' ).length ) {
        // if any non-hidden content needs to be removed
        this.styleQueue.push({ $el: $content, style: this.options.hiddenStyle });
        this.$filteredAtoms = this.$filteredAtoms.not( $content );
        this._sort();
        this.reLayout( removeContent );
      } else {
        // remove it now
        removeContent();
      }

    },

    shuffle : function( callback ) {
      this.updateSortData( this.$allAtoms );
      this.options.sortBy = 'random';
      this._sort();
      this.reLayout( callback );
    },

    // destroys widget, returns elements and container back (close) to original style
    destroy : function() {

      var usingTransforms = this.usingTransforms;
      var options = this.options;

      this.$allAtoms
        .removeClass( options.hiddenClass + ' ' + options.itemClass )
        .each(function(){
          var style = this.style;
          style.position = '';
          style.top = '';
          style.left = '';
          style.opacity = '';
          if ( usingTransforms ) {
            style[ transformProp ] = '';
          }
        });

      // re-apply saved container styles
      var elemStyle = this.element[0].style;
      for ( var prop in this.originalStyle ) {
        elemStyle[ prop ] = this.originalStyle[ prop ];
      }

      this.element
        .unbind('.isotope')
        .undelegate( '.' + options.hiddenClass, 'click' )
        .removeClass( options.containerClass )
        .removeData('isotope');

      $window.unbind('.isotope');

    },


    // ====================== LAYOUTS ======================

    // calculates number of rows or columns
    // requires columnWidth or rowHeight to be set on namespaced object
    // i.e. this.masonry.columnWidth = 200
    _getSegments : function( isRows ) {
      var namespace = this.options.layoutMode,
          measure  = isRows ? 'rowHeight' : 'columnWidth',
          size     = isRows ? 'height' : 'width',
          segmentsName = isRows ? 'rows' : 'cols',
          containerSize = this.element[ size ](),
          segments,
                    // i.e. options.masonry && options.masonry.columnWidth
          segmentSize = this.options[ namespace ] && this.options[ namespace ][ measure ] ||
                    // or use the size of the first item, i.e. outerWidth
                    this.$filteredAtoms[ 'outer' + capitalize(size) ](true) ||
                    // if there's no items, use size of container
                    containerSize;

      segments = Math.floor( containerSize / segmentSize );
      segments = Math.max( segments, 1 );

      // i.e. this.masonry.cols = ....
      this[ namespace ][ segmentsName ] = segments;
      // i.e. this.masonry.columnWidth = ...
      this[ namespace ][ measure ] = segmentSize;

    },

    _checkIfSegmentsChanged : function( isRows ) {
      var namespace = this.options.layoutMode,
          segmentsName = isRows ? 'rows' : 'cols',
          prevSegments = this[ namespace ][ segmentsName ];
      // update cols/rows
      this._getSegments( isRows );
      // return if updated cols/rows is not equal to previous
      return ( this[ namespace ][ segmentsName ] !== prevSegments );
    },

    // ====================== Masonry ======================

    _masonryReset : function() {
      // layout-specific props
      this.masonry = {};
      // FIXME shouldn't have to call this again
      this._getSegments();
      var i = this.masonry.cols;
      this.masonry.colYs = [];
      while (i--) {
        this.masonry.colYs.push( 0 );
      }
    },

    _masonryLayout : function( $elems ) {
      var instance = this,
          props = instance.masonry;
      $elems.each(function(){
        var $this  = $(this),
            //how many columns does this brick span
            colSpan = Math.ceil( $this.outerWidth(true) / props.columnWidth );
        colSpan = Math.min( colSpan, props.cols );

        if ( colSpan === 1 ) {
          // if brick spans only one column, just like singleMode
          instance._masonryPlaceBrick( $this, props.colYs );
        } else {
          // brick spans more than one column
          // how many different places could this brick fit horizontally
          var groupCount = props.cols + 1 - colSpan,
              groupY = [],
              groupColY,
              i;

          // for each group potential horizontal position
          for ( i=0; i < groupCount; i++ ) {
            // make an array of colY values for that one group
            groupColY = props.colYs.slice( i, i+colSpan );
            // and get the max value of the array
            groupY[i] = Math.max.apply( Math, groupColY );
          }

          instance._masonryPlaceBrick( $this, groupY );
        }
      });
    },

    // worker method that places brick in the columnSet
    //   with the the minY
    _masonryPlaceBrick : function( $brick, setY ) {
      // get the minimum Y value from the columns
      var minimumY = Math.min.apply( Math, setY ),
          shortCol = 0;

      // Find index of short column, the first from the left
      for (var i=0, len = setY.length; i < len; i++) {
        if ( setY[i] === minimumY ) {
          shortCol = i;
          break;
        }
      }

      // position the brick
      var x = this.masonry.columnWidth * shortCol,
          y = minimumY;
      this._pushPosition( $brick, x, y );

      // apply setHeight to necessary columns
      var setHeight = minimumY + $brick.outerHeight(true),
          setSpan = this.masonry.cols + 1 - len;
      for ( i=0; i < setSpan; i++ ) {
        this.masonry.colYs[ shortCol + i ] = setHeight;
      }

    },

    _masonryGetContainerSize : function() {
      var containerHeight = Math.max.apply( Math, this.masonry.colYs );
      return { height: containerHeight };
    },

    _masonryResizeChanged : function() {
      return this._checkIfSegmentsChanged();
    },

    // ====================== fitRows ======================

    _fitRowsReset : function() {
      this.fitRows = {
        x : 0,
        y : 0,
        height : 0
      };
    },

    _fitRowsLayout : function( $elems ) {
      var instance = this,
          containerWidth = this.element.width(),
          props = this.fitRows;

      $elems.each( function() {
        var $this = $(this),
            atomW = $this.outerWidth(true),
            atomH = $this.outerHeight(true);

        if ( props.x !== 0 && atomW + props.x > containerWidth ) {
          // if this element cannot fit in the current row
          props.x = 0;
          props.y = props.height;
        }

        // position the atom
        instance._pushPosition( $this, props.x, props.y );

        props.height = Math.max( props.y + atomH, props.height );
        props.x += atomW;

      });
    },

    _fitRowsGetContainerSize : function () {
      return { height : this.fitRows.height };
    },

    _fitRowsResizeChanged : function() {
      return true;
    },


    // ====================== cellsByRow ======================

    _cellsByRowReset : function() {
      this.cellsByRow = {
        index : 0
      };
      // get this.cellsByRow.columnWidth
      this._getSegments();
      // get this.cellsByRow.rowHeight
      this._getSegments(true);
    },

    _cellsByRowLayout : function( $elems ) {
      var instance = this,
          props = this.cellsByRow;
      $elems.each( function(){
        var $this = $(this),
            col = props.index % props.cols,
            row = Math.floor( props.index / props.cols ),
            x = ( col + 0.5 ) * props.columnWidth - $this.outerWidth(true) / 2,
            y = ( row + 0.5 ) * props.rowHeight - $this.outerHeight(true) / 2;
        instance._pushPosition( $this, x, y );
        props.index ++;
      });
    },

    _cellsByRowGetContainerSize : function() {
      return { height : Math.ceil( this.$filteredAtoms.length / this.cellsByRow.cols ) * this.cellsByRow.rowHeight + this.offset.top };
    },

    _cellsByRowResizeChanged : function() {
      return this._checkIfSegmentsChanged();
    },


    // ====================== straightDown ======================

    _straightDownReset : function() {
      this.straightDown = {
        y : 0
      };
    },

    _straightDownLayout : function( $elems ) {
      var instance = this;
      $elems.each( function( i ){
        var $this = $(this);
        instance._pushPosition( $this, 0, instance.straightDown.y );
        instance.straightDown.y += $this.outerHeight(true);
      });
    },

    _straightDownGetContainerSize : function() {
      return { height : this.straightDown.y };
    },

    _straightDownResizeChanged : function() {
      return true;
    },


    // ====================== masonryHorizontal ======================

    _masonryHorizontalReset : function() {
      // layout-specific props
      this.masonryHorizontal = {};
      // FIXME shouldn't have to call this again
      this._getSegments( true );
      var i = this.masonryHorizontal.rows;
      this.masonryHorizontal.rowXs = [];
      while (i--) {
        this.masonryHorizontal.rowXs.push( 0 );
      }
    },

    _masonryHorizontalLayout : function( $elems ) {
      var instance = this,
          props = instance.masonryHorizontal;
      $elems.each(function(){
        var $this  = $(this),
            //how many rows does this brick span
            rowSpan = Math.ceil( $this.outerHeight(true) / props.rowHeight );
        rowSpan = Math.min( rowSpan, props.rows );

        if ( rowSpan === 1 ) {
          // if brick spans only one column, just like singleMode
          instance._masonryHorizontalPlaceBrick( $this, props.rowXs );
        } else {
          // brick spans more than one row
          // how many different places could this brick fit horizontally
          var groupCount = props.rows + 1 - rowSpan,
              groupX = [],
              groupRowX, i;

          // for each group potential horizontal position
          for ( i=0; i < groupCount; i++ ) {
            // make an array of colY values for that one group
            groupRowX = props.rowXs.slice( i, i+rowSpan );
            // and get the max value of the array
            groupX[i] = Math.max.apply( Math, groupRowX );
          }

          instance._masonryHorizontalPlaceBrick( $this, groupX );
        }
      });
    },

    _masonryHorizontalPlaceBrick : function( $brick, setX ) {
      // get the minimum Y value from the columns
      var minimumX  = Math.min.apply( Math, setX ),
          smallRow  = 0;
      // Find index of smallest row, the first from the top
      for (var i=0, len = setX.length; i < len; i++) {
        if ( setX[i] === minimumX ) {
          smallRow = i;
          break;
        }
      }

      // position the brick
      var x = minimumX,
          y = this.masonryHorizontal.rowHeight * smallRow;
      this._pushPosition( $brick, x, y );

      // apply setHeight to necessary columns
      var setWidth = minimumX + $brick.outerWidth(true),
          setSpan = this.masonryHorizontal.rows + 1 - len;
      for ( i=0; i < setSpan; i++ ) {
        this.masonryHorizontal.rowXs[ smallRow + i ] = setWidth;
      }
    },

    _masonryHorizontalGetContainerSize : function() {
      var containerWidth = Math.max.apply( Math, this.masonryHorizontal.rowXs );
      return { width: containerWidth };
    },

    _masonryHorizontalResizeChanged : function() {
      return this._checkIfSegmentsChanged(true);
    },


    // ====================== fitColumns ======================

    _fitColumnsReset : function() {
      this.fitColumns = {
        x : 0,
        y : 0,
        width : 0
      };
    },

    _fitColumnsLayout : function( $elems ) {
      var instance = this,
          containerHeight = this.element.height(),
          props = this.fitColumns;
      $elems.each( function() {
        var $this = $(this),
            atomW = $this.outerWidth(true),
            atomH = $this.outerHeight(true);

        if ( props.y !== 0 && atomH + props.y > containerHeight ) {
          // if this element cannot fit in the current column
          props.x = props.width;
          props.y = 0;
        }

        // position the atom
        instance._pushPosition( $this, props.x, props.y );

        props.width = Math.max( props.x + atomW, props.width );
        props.y += atomH;

      });
    },

    _fitColumnsGetContainerSize : function () {
      return { width : this.fitColumns.width };
    },

    _fitColumnsResizeChanged : function() {
      return true;
    },



    // ====================== cellsByColumn ======================

    _cellsByColumnReset : function() {
      this.cellsByColumn = {
        index : 0
      };
      // get this.cellsByColumn.columnWidth
      this._getSegments();
      // get this.cellsByColumn.rowHeight
      this._getSegments(true);
    },

    _cellsByColumnLayout : function( $elems ) {
      var instance = this,
          props = this.cellsByColumn;
      $elems.each( function(){
        var $this = $(this),
            col = Math.floor( props.index / props.rows ),
            row = props.index % props.rows,
            x = ( col + 0.5 ) * props.columnWidth - $this.outerWidth(true) / 2,
            y = ( row + 0.5 ) * props.rowHeight - $this.outerHeight(true) / 2;
        instance._pushPosition( $this, x, y );
        props.index ++;
      });
    },

    _cellsByColumnGetContainerSize : function() {
      return { width : Math.ceil( this.$filteredAtoms.length / this.cellsByColumn.rows ) * this.cellsByColumn.columnWidth };
    },

    _cellsByColumnResizeChanged : function() {
      return this._checkIfSegmentsChanged(true);
    },

    // ====================== straightAcross ======================

    _straightAcrossReset : function() {
      this.straightAcross = {
        x : 0
      };
    },

    _straightAcrossLayout : function( $elems ) {
      var instance = this;
      $elems.each( function( i ){
        var $this = $(this);
        instance._pushPosition( $this, instance.straightAcross.x, 0 );
        instance.straightAcross.x += $this.outerWidth(true);
      });
    },

    _straightAcrossGetContainerSize : function() {
      return { width : this.straightAcross.x };
    },

    _straightAcrossResizeChanged : function() {
      return true;
    }

  };


  // ======================= imagesLoaded Plugin ===============================
  /*!
   * jQuery imagesLoaded plugin v1.1.0
   * http://github.com/desandro/imagesloaded
   *
   * MIT License. by Paul Irish et al.
   */


  // $('#my-container').imagesLoaded(myFunction)
  // or
  // $('img').imagesLoaded(myFunction)

  // execute a callback when all images have loaded.
  // needed because .load() doesn't work on cached images

  // callback function gets image collection as argument
  //  `this` is the container

  $.fn.imagesLoaded = function( callback ) {
    var $this = this,
        $images = $this.find('img').add( $this.filter('img') ),
        len = $images.length,
        blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
        loaded = [];

    function triggerCallback() {
      callback.call( $this, $images );
    }

    function imgLoaded( event ) {
      var img = event.target;
      if ( img.src !== blank && $.inArray( img, loaded ) === -1 ){
        loaded.push( img );
        if ( --len <= 0 ){
          setTimeout( triggerCallback );
          $images.unbind( '.imagesLoaded', imgLoaded );
        }
      }
    }

    // if no images, trigger immediately
    if ( !len ) {
      triggerCallback();
    }

    $images.bind( 'load.imagesLoaded error.imagesLoaded',  imgLoaded ).each( function() {
      // cached images don't fire load sometimes, so we reset src.
      var src = this.src;
      // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
      // data uri bypasses webkit log warning (thx doug jones)
      this.src = blank;
      this.src = src;
    });

    return $this;
  };


  // helper function for logging errors
  // $.error breaks jQuery chaining
  var logError = function( message ) {
    if ( window.console ) {
      window.console.error( message );
    }
  };

  // =======================  Plugin bridge  ===============================
  // leverages data method to either create or return $.Isotope constructor
  // A bit from jQuery UI
  //   https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js
  // A bit from jcarousel
  //   https://github.com/jsor/jcarousel/blob/master/lib/jquery.jcarousel.js

  $.fn.isotope = function( options, callback ) {
    if ( typeof options === 'string' ) {
      // call method
      var args = Array.prototype.slice.call( arguments, 1 );

      this.each(function(){
        var instance = $.data( this, 'isotope' );
        if ( !instance ) {
          logError( "cannot call methods on isotope prior to initialization; " +
              "attempted to call method '" + options + "'" );
          return;
        }
        if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
          logError( "no such method '" + options + "' for isotope instance" );
          return;
        }
        // apply method
        instance[ options ].apply( instance, args );
      });
    } else {
      this.each(function() {
        var instance = $.data( this, 'isotope' );
        if ( instance ) {
          // apply options & init
          instance.option( options );
          instance._init( callback );
        } else {
          // initialize new instance
          $.data( this, 'isotope', new $.Isotope( options, this, callback ) );
        }
      });
    }
    // return jQuery object
    // so plugin methods do not have to
    return this;
  };

})( window, jQuery );


/* 
    ===========================================================

    Note: SlidesJS version 2.0 beta 1 is not meant
    for production deployment. Please download the latest
    version at https://github.com/nathansearles/Slides.
    This version is stolen from https://github.com/nathansearles/Slides/issues/431

    ===========================================================
*/ 

/*

     .d8888b.  888 d8b      888                888888  .d8888b.  
    d88P  Y88b 888 Y8P      888                  "88b d88P  Y88b 
    Y88b.      888          888                   888 Y88b.      
     "Y888b.   888 888  .d88888  .d88b.  .d8888b  888  "Y888b.   
        "Y88b. 888 888 d88" 888 d8P  Y8b 88K      888     "Y88b. 
          "888 888 888 888  888 88888888 "Y8888b. 888       "888 
    Y88b  d88P 888 888 Y88b 888 Y8b.          X88 88P Y88b  d88P 
     "Y8888P"  888 888  "Y88888  "Y8888   88888P' 888  "Y8888P"  
                                                .d88P            
                                              .d88P"             
                                             888P"               

    Created by Nathan Searles <http://nathansearles.com>

    Documentation and examples <http://slidesjs.com>
    Support forum <http://groups.google.com/group/slidesjs>

    Version: 2.0 beta 1
    Updated: June 22nd, 2011

    SlidesJS is an open source project, contribute at GitHub:
    https://github.com/nathansearles/Slides

    (c) 2011 by Nathan Searles

    Thanks to:
    Thomas Reynolds <http://awardwinningfjords.com/>
    Adam j. Sontag <http://ajpiano.com/>

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

/*
    Documentaion
    ============================================================

    Basic Markup Structure
    ============================================================

    For just images you can simply use:

    <div id="slides">
            <img src="http://slidesjs.com/examples/standard/img/slide-1.jpg" width="570" height="270" alt="Slide 1">
            <img src="http://slidesjs.com/examples/standard/img/slide-2.jpg" width="570" height="270" alt="Slide 2">
            <img src="http://slidesjs.com/examples/standard/img/slide-3.jpg" width="570" height="270" alt="Slide 3">
            <img src="http://slidesjs.com/examples/standard/img/slide-4.jpg" width="570" height="270" alt="Slide 4">
    </div>

    Or you can use <div>s for your slides

    <div id="slides">
            <div>
                <img src="http://slidesjs.com/examples/standard/img/slide-1.jpg" width="570" height="270" alt="Slide 1">
            </div>
            <div>
                <img src="http://slidesjs.com/examples/standard/img/slide-2.jpg" width="570" height="270" alt="Slide 2">
            </div>
            <div>
                <img src="http://slidesjs.com/examples/standard/img/slide-3.jpg" width="570" height="270" alt="Slide 3">
            </div>
            <div>
                <img src="http://slidesjs.com/examples/standard/img/slide-4.jpg" width="570" height="270" alt="Slide 4">
            </div>
    </div>

    Simple as that. No extra <div>s, no navigation or pagination to define, it's all created for you. SlidesJS creates
    two <div>s for the slideshow, ".slidesContainer" and ".slidesControl", both are required and can not be changed.

    Navigation classes are ".slidesPrevious" and ".slidesNext" and are created as anchor tags. These cannot be changed.

    Pagination uses an unordered list markup structure. The <ul> has a class of ".slidesPagination". This cannot be changed.

    You may define your own navigation or pagination, but they must use the same class names,
    sorry it saves from including extraneous code.

    Basic CSS
    ============================================================

    No CSS required. Shit yeah!

    Initialize SlidesJS
    ============================================================

    <script>
        $(function(){
            $("#slides").slides();
        });
    </script>

    Tip: With SidesJS 2 you need to define the width and height if it's different from the default (780px x 300px). This resolves many issues having to do with loading and makes SlidesJS 2 self contained, not requiring any CSS.

    <pre><script>
     $(function(){
      $("#slides").slides({
        width: 640,
        height: 480
      });
     });
    </script></pre>

    Method Calls - The good stuff
    ============================================================

    Play:
        $("#slides").slides("play");

    Pause:
        $("#slides").slides("pause");

    Stop:
        $("#slides").slides("stop");

    Next:
        $("#slides").slides("next");
            - Uses default effect

        $("#slides").slides("next","fade");
            - Define effect, "slide" or "fade"

    Previous:
        $("#slides").slides("previous");
            - Uses default effect

        $("#slides").slides("previous","fade");
            - Define effect, "slide" or "fade"

    Goto a slide
        $("#slides").slides("slide",2);
            - Goto slide 2 using default effect

        $("#slides").slides("slide",4,"fade");
            - Define effect, "slide" or "fade"

    Update:
        $("#slides").slides("update");
            - Rebuilds pagination 

    Destroy:
        $("#slides").slides("destroy");
            - Removes SlidesJS, returns to predefined state

    Status:
        $("#slides").slides("status");
            - Returns JSON object:
                {
                    current: 4,
                    state: "playing",
                    total: 7
                }

        $("#slides").slides("status","current");
            - Returns current slide number

        $("#slides").slides("status","state");
            - Returns playing, paused, or stopped

        $("#slides").slides("status","total");
            - Returns total slides in slideshow

        Options
        ============================================================
        Check out the notes on the options below
*/

/*
    jQuery UI Widget, skip past this for SlidesJS
*/

/*!
 * jQuery UI Widget @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function ($, undefined) {
  var slice = Array.prototype.slice;
  var _cleanData = $.cleanData;
  $.cleanData = function (elems) {
    for (var i = 0, elem;
    (elem = elems[i]) != null; i++) {
      $(elem).triggerHandler("remove");
    }
    _cleanData(elems);
  };
  $.widget = function (name, base, prototype) {
    var namespace = name.split(".")[0],
        fullName;
    name = name.split(".")[1];
    fullName = namespace + "-" + name;
    if (!prototype) {
      prototype = base;
      base = $.Widget;
    }
    // create selector for plugin
    $.expr[":"][fullName] = function (elem) {
      return !!$.data(elem, name);
    };
    $[namespace] = $[namespace] || {};
    // create the constructor using $.extend() so we can carry over any
    // static properties stored on the existing constructor (if there is one)
    $[namespace][name] = $.extend(function (options, element) {
      // allow instantiation without "new" keyword
      if (!this._createWidget) {
        return new $[namespace][name](options, element);
      }
      // allow instantiation without initializing for simple inheritance
      // must use "new" keyword (the code above always passes args)
      if (arguments.length) {
        this._createWidget(options, element);
      }
    }, $[namespace][name]);
    var basePrototype = new base();
    // we need to make the options hash a property directly on the new instance
    // otherwise we'll modify the options hash on the prototype that we're
    // inheriting from
    basePrototype.options = $.widget.extend({}, basePrototype.options);
    $.each(prototype, function (prop, value) {
      if ($.isFunction(value)) {
        prototype[prop] = (function () {
          var _super = function (method) {
            return base.prototype[method].apply(this, slice.call(arguments, 1));
          };
          var _superApply = function (method, args) {
            return base.prototype[method].apply(this, args);
          };
          return function () {
            var __super = this._super,
                __superApply = this._superApply,
                returnValue;
            this._super = _super;
            this._superApply = _superApply;
            returnValue = value.apply(this, arguments);
            this._super = __super;
            this._superApply = __superApply;
            return returnValue;
          };
        }());
      }
    });
    $[namespace][name].prototype = $.widget.extend(basePrototype, {
      namespace: namespace,
      widgetName: name,
      widgetEventPrefix: name,
      widgetBaseClass: fullName
    }, prototype);
    $.widget.bridge(name, $[namespace][name]);
  };
  $.widget.extend = function (target) {
    var input = slice.call(arguments, 1),
        inputIndex = 0,
        inputLength = input.length,
        key, value;
    for (; inputIndex < inputLength; inputIndex++) {
      for (key in input[inputIndex]) {
        value = input[inputIndex][key];
        if (input[inputIndex].hasOwnProperty(key) && value !== undefined) {
          target[key] = $.isPlainObject(value) ? $.widget.extend({}, target[key], value) : value;
        }
      }
    }
    return target;
  };
  $.widget.bridge = function (name, object) {
    $.fn[name] = function (options) {
      var isMethodCall = typeof options === "string",
          args = slice.call(arguments, 1),
          returnValue = this;
      // allow multiple hashes to be passed on init
      options = !isMethodCall && args.length ? $.widget.extend.apply(null, [options].concat(args)) : options;
      if (isMethodCall) {
        this.each(function () {
          var instance = $.data(this, name);
          if (!instance) {
            return $.error("cannot call methods on " + name + " prior to initialization; " + "attempted to call method '" + options + "'");
          }
          if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
            return $.error("no such method '" + options + "' for " + name + " widget instance");
          }
          var methodValue = instance[options].apply(instance, args);
          if (methodValue !== instance && methodValue !== undefined) {
            returnValue = methodValue.jquery ? returnValue.pushStack(methodValue.get()) : methodValue;
            return false;
          }
        });
      } else {
        this.each(function () {
          var instance = $.data(this, name);
          if (instance) {
            instance.option(options || {})._init();
          } else {
            object(options, this);
          }
        });
      }
      return returnValue;
    };
  };
  $.Widget = function (options, element) {
    // allow instantiation without "new" keyword
    if (!this._createWidget) {
      return new $[namespace][name](options, element);
    }
    // allow instantiation without initializing for simple inheritance
    // must use "new" keyword (the code above always passes args)
    if (arguments.length) {
      this._createWidget(options, element);
    }
  };
  $.Widget.prototype = {
    widgetName: "widget",
    widgetEventPrefix: "",
    defaultElement: "<div>",
    options: {
      disabled: false,
      // callbacks
      create: null
    },
    _createWidget: function (options, element) {
      element = $(element || this.defaultElement || this)[0];
      this.element = $(element);
      this.options = $.widget.extend({}, this.options, this._getCreateOptions(), options);
      this.bindings = $();
      this.hoverable = $();
      this.focusable = $();
      if (element !== this) {
        $.data(element, this.widgetName, this);
        this._bind({
          remove: "destroy"
        });
      }
      this._create();
      this._trigger("create");
      this._init();
    },
    _getCreateOptions: $.noop,
    _create: $.noop,
    _init: $.noop,
    destroy: function () {
      this._destroy();
      // we can probably remove the unbind calls in version 2
      // all event bindings should go through this._bind()
      this.element.unbind("." + this.widgetName).removeData(this.widgetName);
      this.widget().unbind("." + this.widgetName).removeAttr("aria-disabled").removeClass(
      this.widgetBaseClass + "-disabled " + "ui-state-disabled");
      // clean up events and states
      this.bindings.unbind("." + this.widgetName);
      this.hoverable.removeClass("ui-state-hover");
      this.focusable.removeClass("ui-state-focus");
    },
    _destroy: $.noop,
    widget: function () {
      return this.element;
    },
    option: function (key, value) {
      var options = key,
          parts, curOption, i;
      if (arguments.length === 0) {
        // don't return a reference to the internal hash
        return $.widget.extend({}, this.options);
      }
      if (typeof key === "string") {
        if (value === undefined) {
          return this.options[key];
        }
        // handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
        options = {};
        parts = key.split(".");
        key = parts.shift();
        if (parts.length) {
          curOption = options[key] = $.widget.extend({}, this.options[key]);
          for (i = 0; i < parts.length - 1; i++) {
            curOption[parts[i]] = curOption[parts[i]] || {};
            curOption = curOption[parts[i]];
          }
          curOption[parts.pop()] = value;
        } else {
          options[key] = value;
        }
      }
      this._setOptions(options);
      return this;
    },
    _setOptions: function (options) {
      var self = this;
      $.each(options, function (key, value) {
        self._setOption(key, value);
      });
      return this;
    },
    _setOption: function (key, value) {
      this.options[key] = value;
      if (key === "disabled") {
        this.widget().toggleClass(this.widgetBaseClass + "-disabled ui-state-disabled", !! value).attr("aria-disabled", value);
        this.hoverable.removeClass("ui-state-hover");
        this.focusable.removeClass("ui-state-focus");
      }
      return this;
    },
    enable: function () {
      return this._setOption("disabled", false);
    },
    disable: function () {
      return this._setOption("disabled", true);
    },
    _bind: function (element, handlers) {
      // no element argument, shuffle and use this.element
      if (!handlers) {
        handlers = element;
        element = this.element;
      } else {
        // accept selectors, DOM elements
        element = $(element);
        this.bindings = this.bindings.add(element);
      }
      var instance = this;
      $.each(handlers, function (event, handler) {
        element.bind(event + "." + instance.widgetName, function () {
          // allow widgets to customize the disabled handling
          // - disabled as an array instead of boolean
          // - disabled class as method for disabling individual parts
          if (instance.options.disabled === true || $(this).hasClass("ui-state-disabled")) {
            return;
          }
          return (typeof handler === "string" ? instance[handler] : handler).apply(instance, arguments);
        });
      });
    },
    _hoverable: function (element) {
      this.hoverable = this.hoverable.add(element);
      this._bind(element, {
        mouseenter: function (event) {
          $(event.currentTarget).addClass("ui-state-hover");
        },
        mouseleave: function (event) {
          $(event.currentTarget).removeClass("ui-state-hover");
        }
      });
    },
    _focusable: function (element) {
      this.focusable = this.focusable.add(element);
      this._bind(element, {
        focusin: function (event) {
          $(event.currentTarget).addClass("ui-state-focus");
        },
        focusout: function (event) {
          $(event.currentTarget).removeClass("ui-state-focus");
        }
      });
    },
    _trigger: function (type, event, data) {
      var callback = this.options[type],
          args;
      event = $.Event(event);
      event.type = (type === this.widgetEventPrefix ? type : this.widgetEventPrefix + type).toLowerCase();
      data = data || {};
      // copy original event properties over to the new event
      // this would happen if we could call $.event.fix instead of $.Event
      // but we don't have a way to force an event to be fixed multiple times
      if (event.originalEvent) {
        for (var i = $.event.props.length, prop; i;) {
          prop = $.event.props[--i];
          event[prop] = event.originalEvent[prop];
        }
      }
      this.element.trigger(event, data);
      args = $.isArray(data) ? [event].concat(data) : [event, data];
      return !($.isFunction(callback) && callback.apply(this.element[0], args) === false || event.isDefaultPrevented());
    }
  };
  $.each({
    show: "fadeIn",
    hide: "fadeOut"
  }, function (method, defaultEffect) {
    $.Widget.prototype["_" + method] = function (element, options, callback) {
      options = options || {};
      var hasOptions = !$.isEmptyObject(options),
          effectName = options.effect || defaultEffect;
      options.complete = callback;
      if (options.delay) {
        element.delay(options.delay);
      }
      if (hasOptions && $.effects && ($.effects.effect[effectName] || $.uiBackCompat !== false && $.effects[effectName])) {
        element[method](options);
      } else if (effectName !== method && element[effectName]) {
        element[effectName](options.duration, options.easing, callback);
      } else {
        element.queue(function () {
          $(this)[method]();
          if (callback) {
            callback.call(element[0]);
          }
        });
      }
    };
  });
  // DEPRECATED
  if ($.uiBackCompat !== false) {
    $.Widget.prototype._getCreateOptions = function () {
      return $.metadata && $.metadata.get(this.element[0])[this.widgetName];
    };
  }
})(jQuery);

/*
    SlidesJS, let the good times roll
*/
(function($) {
  $.widget("js.slides", {
        options: {
            width: 780, // [Number] Define the slide width
            responsive: false, // [Boolean] slideshow will scale to its container
            height: 300, // [Number] Define the slide height
            navigation: true, // [Boolean] Auto generate the naviagation, next/previous buttons
            pagination: true, // [Boolean] Auto generate the pagination
            effects: {
                navigation: "slide",  // [String] Can be either "slide" or "fade"
                pagination: "slide" // [String] Can be either "slide" or "fade"
            },
            direction: "left", // [String] Define the slide direction: "Up", "Right", "Down", "left"
            fade: {
                interval: 1000, // [Number] Interval of fade in milliseconds
                crossfade: false, // [Boolean] TODO: add this feature. Crossfade the slides, great for images, bad for text
                easing: "" // [String] Dependency: jQuery Easing plug-in <http://gsgd.co.uk/sandbox/jquery/easing/>
            },
            slide: {
                interval: 1000, // [Number] Interval of fade in milliseconds
                browserWindow: false, // [Boolean] Slide in/out from browser window, bad ass
                easing: "" // [String] Dependency: jQuery Easing plug-in <http://gsgd.co.uk/sandbox/jquery/easing/>
            },
            preload: {
                active: false, // [Boolean] Preload the slides before showing them, this needs some work
                image: "../img/loading.gif" // [String] Define the path to a load .gif, yes I should do something cooler
            },
            startAtSlide: 1, // [Number] What should the first slide be?
            playInterval: 5000, // [Number] Time spent on each slide in milliseconds
            pauseInterval: 8000, // [Number] Time spent on pause, triggered on any navigation or pagination click
            autoHeight: false, // [Boolean] TODO: add this feature. Auto sets height based on each slide
            navigateStart: function( current ){
                // console.log( "navigateStart: ", current );
            },
            navigateEnd: function( current ){
                // console.log( "navigateEnd: ", current );
            },
            loaded: function() {
                // console.log( "loaded" );
            }
        },
    _create: function() {   

            // Error correction for only 1 slide
            if (this.element.children().length < 2) {
                return;
            }

            if ( this.options.slide.browserWindow ) {
                this.element.css({
                    width: window.innerWidth,
                    position: "relative",
                    left: - (window.innerWidth / 2) + (this.options.width / 2),
                    overflow: "hidden"
                });

                $(window).resize( $.proxy(function() {
                    this.element.css({
                        width: window.innerWidth,
                        left: - (window.innerWidth / 2) + (this.options.width / 2)
                    });

                    this.slidesContainer.css({
                        left: this.options.slide.browserWindow ?  (window.innerWidth - this.options.width) / 2 : ""
                    });
                },this));
            }

            this.slidesContainer = this.element.children().not(".slidesNavigation").wrapAll( "<div class='slidesContainer'>" ).parent().css({
                width: this.options.responsive ? "100%" : this.options.width,
                height: this.options.height,
                overflow: this.options.slide.browserWindow ? "visible" : "hidden",
                position: "relative",
                left: this.options.slide.browserWindow ?  (window.innerWidth - this.options.width) / 2 : ""
            });

            this.slidesControl = this.slidesContainer.wrapInner( "<div class='slidesControl'>" ).children().css({
                display: "none"
            });

            // Define the slides
            this.slides = this.slidesControl.children();

            // Set CSS for slidesControl
            this.slidesControl.css({
                position: "relative",
                width: this.options.responsive ? "100%" : this.options.width,
                height: this.options.height,
                left: 0
            });

            // Set CSS for each slide
            this.slides.css({
                position: "absolute",
                top: 0, 
                left: 0,
                zIndex: 0,
                display: "none"
            });

            // Show the starting slide with a fade in
            this.slides.eq( this.options.startAtSlide - 1 ).fadeIn( this.options.fade.interval );

            if ( this.options.preload.active ) {

/*              TODO: loading image, need to remove on load callback

                    this.slidesContainer.css({
                        backgroundImage: "url(" + this.options.preload.image + ")",
                        backgroundPosition: "50% 50%",
                        backgroundRepeat: "no-repeat"
                    });
*/                  
                var preloadImage;

                if (this.slides.eq( this.options.startAtSlide - 1 ).is("img")) {
                    preloadImage = this.slides.eq( this.options.startAtSlide - 1 ).attr("src");
                } else {
                    preloadImage = this.slides.eq( this.options.startAtSlide - 1 ).find("img").attr("src");
                }

                this._loadImage( preloadImage ).then( $.proxy(function( url ) {
                this.slidesControl.fadeIn( this.options.fade.interval );
                    this._trigger( "loaded", this.options.startAtSlide, this );
                },this));
            } else {
                 this.slidesControl.fadeIn( this.options.fade.interval );
            }

            if ( this.options.navigation ) {
                this.prevButton = $("<a>",{
                    "class": "slidesPrevious slidesNavigation",
                    href: "#",
                    title: "Previous",
                    text: "Previous"
                }).appendTo( this.element );

                this.nextButton = $("<a>",{
                    "class": "slidesNext slidesNavigation",
                    href: "#",
                    title: "Next",
                    text: "Next"
                }).appendTo( this.element );
            } else {
                this.nextButton = $(".slidesNext");
                this.prevButton = $(".slidesPrevious");
            }       

            if (this.options.pagination) {
                this._buildPagination();
                // add current class to first pagination
                this.pagination.children().eq( this.options.startAtSlide - 1 ).addClass("slidesCurrent");
            }

            this.current = this.options.startAtSlide - 1;

            this.element.delegate( ".slidesNavigation", "click", $.proxy(this, "_navigate") );

            this.total = this.slides.length;
    },
        _loaded: function() {
            if ( this.options.responsive ) {

                // TODO: cleanup and condense
                this.slidesContainer.css({
                    height: this.slides.height()
                });

                this.slidesControl.css({
                    height: this.slides.height()
                });

                $(window).resize( $.proxy(function() {
                    this.slidesContainer.css({
                        height: this.slides.height()
                    });
                    this.slidesControl.css({
                        height: this.slides.height()
                    });
                },this));
            }
        },
    _buildPagination: function() {

            if (this.pagination) {
                // Remove the current paginaiton
                this.pagination.remove();
                // Redefine slides with new children
                this.slides = this.slidesControl.children();
            }

            this.pagination = $("<ul>",{
                "class": "slidesPagination"
            }).appendTo(this.element);

            this.slides.each(
                $.proxy(function(index, element) {
                    $("<li><a href='#" + index + "' class='slidesNavigation slidesPaginationItem' data-slidesindex=" + index + "> " + ( index + 1 ) + "</a></li>").appendTo(this.pagination);
                },this)
            );

    },
        _loadImage: function(imageSrc) {
            var deferred, preloader;
            var loadImageCache = {};
          if (typeof loadImageCache[imageSrc] === "undefined") {
            deferred = $.Deferred();

            preloader = new Image();
            preloader.onload  = function() {
                    deferred.resolve(this.src);
                };
            preloader.onerror = function() {
                    deferred.reject(this.src);
                };
            preloader.src = imageSrc;

            loadImageCache[imageSrc] = deferred;
          }

          return loadImageCache[imageSrc];
        },
        next: function( effect ) {
            this._navigate("next", effect);
        },
        previous: function( effect ) {
            this._navigate("previous", effect);
        },
        slide: function( slide, effect ) {          
            this.element.data("goto", (slide - 1));
            this._navigate("pagination", effect);
        },
        _navigate: function( event, effect ) {
            var to, position, direction, next, prev, pagination, gopagination, $target = $(event.target), currentSlide = this.slides.eq( this.current );


            /*
                Slide to error correction
            */
            if ( this.element.data("goto") < 0 ) {
                // If goto is less then 0
                this.element.data("goto",0);
            } else  if ( this.element.data("goto") > this.total ) {
                // If goto is greater then total slides
                this.element.data("goto",(this.total - 1));
            }

            /*
                Check if slides is currently animating
            */
            if ( this.element.data("animated") || $target.data("slidesindex") === this.current || (this.element.data("goto") === this.current && event == 'pagination')) {
                return false;
            }

            /*
                Is this event coming from a click?
            */
            if (typeof(event) === "object") {
                event.preventDefault();

                // Pause on navigation item click
                if ( this.state === "playing" && this.options.pauseInterval ) {
                    this.pause();
                }
            } else {
                if (event === "next") {
                    next = true;
                    effect = effect ? effect : this.options.effects.navigation;
                } else {
                    prev = true;
                    effect = effect ? effect : this.options.effects.navigation;
                }
            }

            /*
                Set to animated
            */
            this.element.data("animated",true);

            if ( $target.hasClass( "slidesNext" ) ) {
                // Next button clicked
                next = true;
                effect = effect ? effect : this.options.effects.navigation;

            } else if ( $target.hasClass("slidesPrevious") ) {

                // Previous button clicked
                prev = true;
                effect = effect ? effect : this.options.effects.navigation;

            }   else if ( $target.hasClass("slidesPaginationItem") ||  event === "pagination") {

                // Paginaiton item clicked
                if ( this.current > $target.data("slidesindex") || this.current > this.element.data("goto") ) {
                    prev = true;                    
                } else {
                    next = true;
                }

                //pagination = true;

                gopagination = true;

                effect = effect ? effect : this.options.effects.pagination;
            }


            if (pagination || gopagination) {
                // Get next from data-slidesindex
                to = this.element.data("goto") > -1 ? this.element.data("goto") : $target.data("slidesindex");
            } else {
                // Get next based on curent
                to = next ? (this.current + 1) : (prev ? this.current - 1 : this.current);
            }

            // Pass slide from number
            this._trigger("navigateStart", ( this.current + 1 ), this);

            // creat the loop
            if ( to == this.slides.length && !pagination ) {
                // last slide, loop to first
                to = 0;
            } else if ( to == -1 && !pagination ) {
                // first slide, loop to last
                to = this.slides.length - 1;
            }

            if (this.options.pagination) {
                // Change the pagination
                this.pagination.children().removeClass("slidesCurrent");
                this.pagination.children().eq( to ).addClass("slidesCurrent");
            }

            // Effects methods
            if (effect === "fade") {
                this._fade({
                    next: next,
                    to: to,
                    currentSlide: currentSlide
                });
            } else {
                this._slide({
                    next: next,
                    to: to,
                    currentSlide: currentSlide
                });
            }
        },
        _slide: function (navigateData) {
            /*
                Thanks to Thomas Reynolds <http://awardwinningfjords.com/>
            */

            var isFlipped = navigateData.next ? 1 : -1;
            var isOpposite = this.options.direction.match(/right|down/) ? -1 : 1;
            var type = this.options.direction.match(/left|right/) ? "horizontal" : "vertical";
            var vector = (type == "horizontal") ? "width" : "height";

            vector = this.options.responsive ? this.slides.width() : this.options[vector] ;

            var position = vector * isOpposite * isFlipped;

            if (this.options.slide.browserWindow) {
                 if (navigateData.next) {
                    position = Math.abs( this.options.width - window.innerWidth - position);
                } else {
                    position = this.options.width - window.innerWidth + position;
                }                   
            }

            var direction = position * -1;

            // Setup the "to" slide
            this.slides.eq( navigateData.to ).css({
                left: type === "vertical" ? 0 : position,
                top:  type === "vertical" ? position : 0,
                zIndex: 5,
                display: "block"
            });

            // animate control
            this.slidesControl.animate({
                left: type === "vertical" ? 0 : direction,
                top:  type === "vertical" ? direction : 0
            },this.options.slide.interval, this.options.slide.easing, $.proxy(function(){
                // after animation reset control position
                this.slidesControl.css({
                    top: 0,
                    left:0
                });
                // reset and show next
                this.slides.eq( navigateData.to ).css({
                    top: 0,
                    left:0,
                    zIndex: 5
                });

                // reset previous slide
                navigateData.currentSlide.css({
                    top: 0,
                    left:0,
                    display: "none",
                    zIndex: 0
                });

                this.current = navigateData.to;

                this._trigger("navigateEnd", ( this.current + 1 ), this);
            }, this));
        },
        _fade: function (navigateData) {

                // put hidden to slide above current
                this.slides.eq( navigateData.to ).css({
                    zIndex: 10
                // fade in next
                }).fadeIn(this.options.fade.interval, this.options.fade.easing, $.proxy(function(){

                        // hide previous
                        navigateData.currentSlide.css({
                            display: "none",
                            zIndex: 0
                        });                             

                        // reset zindex
                        this.slides.eq( navigateData.to ).css({
                            zIndex: 0
                        });                 

                        this.current = navigateData.to;

                        this._trigger("navigateEnd", ( this.current + 1 ), this);

                }, this));
        },
        play: function( gotoNext ) {
            if (gotoNext !== false) {
                this._navigate("next");
            }

            var playInterval = setInterval( $.proxy(function() {
                this._navigate("next");
            }, this), this.options.playInterval);

            // Set status
            this.state = "playing";

            // Store the unique interval ID
            this.element.data("playIntervalId",playInterval);
        },
        pause: function() {
            clearTimeout( this.element.data("pauseTimeoutId") );

            clearInterval( this.element.data("playIntervalId") );

            var pauseTimeout = setTimeout($.proxy(function() {
                this.play();
             }, this), this.options.pauseInterval);

            // Set status
            this.state = "paused";

            // Store the unique pause timeout ID
            this.element.data("pauseTimeoutId",pauseTimeout);
        },
        stop: function() {
            clearInterval( this.element.data("playIntervalId") );

            // Set status
            this.state = "stopped";
        },
        update: function() {
            this._buildPagination();    
        },
        status: function( key ) {
            if (key) {
                return this[key] ? this[key] : false;
            } else {
                return {
                    "state": this.state,
                    "current": this.current,
                    "total": this.total
                };
            }

        },
        _setOption: function(key, value) {
      switch(key) {
                /*
                    TODO: This needs work, note status function use of this[key]
                    $("#slides").slides("option","pagination", false);

        case "pagination":
                    if (value !== this.options.pagination ) {
                        value ? this._buildPagination() : this.pagination.remove();
                    }
          break;
                */
      }
      $.Widget.prototype._setOption.apply(this,arguments);
    },
    destroy: function() {

            this.slidesContainer.contents().unwrap();

            this.slidesControl.contents().unwrap();

            this.element.unbind();

            this.pagination.remove();

            this.nextButton.remove();

            this.prevButton.remove();

            this.slides.attr( "style", "" );

      $.Widget.prototype.destroy.call(this);
    },
        _trigger: function( event, current ) {
            if (event != "create") {
                this.options[event]( current );
            }
            if (event === "navigateEnd") {
                this.element.data("animated",false);
            }
            if (event === "loaded") {
                this._loaded();
            }
        }
  });
})(jQuery);