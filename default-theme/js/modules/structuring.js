var page = {

    data : {
        current : '#intro',
        sectionNav : false,
        openedSkill : false
    },
    init : function(){
        $(window).scrollTop(0);
        page.structuring(true);
        if($('.section-nav').length > 0){
            page.data.sectionNav = true;
        }

        // Section navigation
        $('body').on('click', '#prev-section', function(){
            if(!$(this).hasClass('false') && !$(this).hasClass('disabled') && !$('body').hasClass('menu-opened')){
                $('.section-nav').addClass('false');
                $(page.data.current).prev('.section').velocity("scroll", { duration: 700, easing: "easeOutCubic", complete: function(){$('.section-nav').removeClass('false');}});
            }
        });
        $('body').on('click', '#next-section', function(){
            if(!$(this).hasClass('false') && !$(this).hasClass('disabled') && !$('body').hasClass('menu-opened')){
                $('.section-nav').addClass('false');
                $(page.data.current).next('.section').velocity("scroll", { duration: 700, easing: "easeOutCubic", complete: function(){$('.section-nav').removeClass('false');}});
            }
        });

        // Menu Control
        $('#nav-open').click(function(){
            if($(this).hasClass('menu-opened')){
                page.menu.close();
            } else {
                page.menu.open();
            }
        });
        $('#nav-close').click(function(){
            page.menu.close();
        });
        $('#nav').on('click', 'li a', function(e){
            e.preventDefault();
            page.scrollTo($(this));
        });

        // Click listeners
        $('body').on('click', '#show-more-portfolio', function(){
            page.increasePortfolioHeight($(this));
        });

        $('body').on('click', '.skill-group h3', function(){
            page.openSkills($(this));
        });


    },


    menu : {
        open : function(){$('.fixed').each(function(){	var t = $(this);	t.css({position: 'absolute',top: t.offset().top});});$('body').addClass('menu-opened');$('#nav-close, #nav ul li').velocity('transition.slideRightIn', {duration:200, stagger:80});setTimeout(function(){$('#nav-open').addClass('menu-opened');}, 320);
        },
        close : function(complete){$('.fixed').each(function(){	var t = $(this);	$('body').removeClass('menu-opened'); 	setTimeout(function(){t.css({position: '',top: ''});if(complete){complete();}}, 320);});$('#nav-open').removeClass('menu-opened');
        }
    },
    scrollTo : function(t){
        page.menu.close(function(){
            $(t.attr('href')).velocity("scroll", { duration: 700, easing: "easeOutCubic" });
        });
    },

    distributePortfolio : function(w){
        if($('#portfolio-style').length > 0){$('#portfolio-style').remove();}
        $('body').append('<style id="portfolio-style">#portfolio .portfolio-element{height:'+Math.floor(w/page.data.portfolioNumber)+'px;}</style>');
        var e = $('#portfolio .portfolio-element .inner');
        e.each(function(){
            var t = $(this);
            var p = t.parent();
            var pd = (p.height() -t.height())/2;
            t.css({'padding': pd+'px 0 '+pd+'px'});
        });
    },

    increasePortfolioHeight : function(t){
        $('.section').waypoint('destroy');
        var p = t.parent();
        var n = t.siblings().length;
        if((n/page.data.portfolioNumber) > Math.floor(n/page.data.portfolioNumber)){
            n = Math.floor(n/page.data.portfolioNumber) + 1;
        } else {
            n = n/page.data.portfolioNumber;
        }
        var oh = t.siblings('.portfolio-element').first().height();
        var fh = oh*n;
        p.velocity({height:fh}, {complete:function(){
            t.remove();
            page.homeWaypoint();
        }});
    },

    setSkills :  function(){
        $('.skill-group .skills-container').each(function(){
            var t = $(this);
            var n = t.children().length;
            if((n/page.data.skillNumber) > Math.floor(n/page.data.skillNumber)){
                n = Math.floor(n/page.data.skillNumber) + 1;
            } else {
                n = n/page.data.skillNumber;
            }
            var oh = t.children().first().height();
            t.attr({'data-n' : n, 'data-oh' : oh});
        });
    },

    closeSkills : function(t, complete){
        $('.skill-group .skills-container').not(t).velocity({height:0}, {delay:0, complete: function(){complete();}});
        page.openedSkill.find('.skill').css({opacity:0});
    },


    openSkills : function(t){

        var c = t.siblings('.skills-container');
        page.openedSkill = c;
        var n = parseInt(c.data('n'));
        var oh = parseInt(c.data('oh'));
        var fh = oh*n;
        c.velocity({height:fh},{duration: 50, easing:"spring", complete:function(){
            c.find('.skill').velocity('transition.bounceIn', {delay:200,stagger:100});
        }});
        page.closeSkills(c, function(){
            setTimeout(function(){
                var vc = $('#skills').children();
                var m = (page.data.h - vc.height())/2;
                if(page.data.w > 767){vc.velocity({top:m},{duration:400});}
            },300);
        });

    },

    resize : function(){
        page.data.h = $(window).height();
        page.data.w = $(window).width();
        page.setSectionH(page.data.h);
        page.centerElements(page.data.h);
        page.distributePortfolio(page.data.w);
    },

    setSectionH : function(h){
        $('#section-height').remove();
        $('body').append('<style id="section-height">.section,.full-height {height:'+h+'px;min-height:'+h+'px;}</style>');
    },
    centerElements : function(h){
        $('.v-centered').each(function(){
            var t = $(this);
            var m = (h - t.height())/2;
            if(m>0){t.css({top:m});}
        });
    },
    sectionReached : function(_this){
        var t = _this.data('title');
        var c = _this.data('color');
        $('#nav-open').find('h3').remove();
        $('#nav-open').prepend('<h3 class="'+c+'">'+t+'</h3>');
        page.data.current = '#'+_this.attr('id');
        if(page.data.sectionNav){
            if(_this.hasClass('first')){$('#prev-section').addClass('disabled');}
            else if(_this.hasClass('last')){$('#next-section').addClass('disabled');}
            else {$('#prev-section,#next-section').removeClass('disabled');}
        }
    },
    homeWaypoint : function(){
        // Waypoint
        $('.section').waypoint(function(direction) {
            var _this = $(this.element);
            if(direction == 'down'){
                page.sectionReached(_this);
            }
            if(_this.hasClass('js-animated')){
                if(_this.attr('id') == 'portfolio'){$.Velocity.RunSequence(page.animations.portfolio); }
                if(_this.attr('id') == 'about'){$.Velocity.RunSequence(page.animations.about); }
                if(_this.attr('id') == 'skills'){$.Velocity.RunSequence(page.animations.skills); }
            }
        }, {offset:'15%'});
        $('.section').not('.fixed').waypoint(function(direction) {
            if(direction == 'up'){
                page.sectionReached($(this));

            }
        }, {offset:'-90%'});
    },
    animations : {
        intro : [
            { e: $('h1'), p: 'transition.shrinkIn', o: { delay:300, duration: 400 } },
            { e: $('.intro h2'), p: 'transition.slideUpIn', o: { duration: 300 } },
            { e: $('.nav-toggle--open, .nav-actions__item'), p: 'transition.slideRightIn', o: { duration: 200, stagger:60 } }
        ],
        portfolio : [
            { e: $('#portfolio').find('.portfolio__element'), p: 'transition.slideUpIn', o: { delay:0, duration: 100, stagger:70, drag: true, complete:function(){$('#portfolio').removeClass('js-animated');}}}
        ],
        about : [
            { e: $('#about').find('.u-animated'), p: 'transition.slideLeftIn', o: { delay:0, duration: 500, stagger:200, drag: true, complete:function(){$('#about').removeClass('js-animated');}}}
        ],
        skills : [
            { e: $('#skills').find('.skills-group'), p: 'transition.expandIn', o: { delay:0, duration: 300, stagger:150, drag: true, complete:function(){$('#skills').removeClass('js-animated');}}}
        ],
    }
};

$(window).load(function(){

    $('body').css({opacity:1});
    $.Velocity.RunSequence(page.animations.intro);
    if(window.outerWidth >= 768){
        page.homeWaypoint();
        $(' #portfolio > div ').hoverdir();
    }
});