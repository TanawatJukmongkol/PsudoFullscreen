// ==UserScript==
// @name         Psudo Fullscreen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes navigator bar, and fix YouTube resizing problems.
// @author       Tanawat J.
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// ==/UserScript==

(function() { window.setTimeout(() => {
    'use strict';
    const masthead_container = document.getElementById("masthead-container");
    const page_manager = document.getElementById("page-manager");
    const player_theater_container = document.getElementById("player-theater-container");
    const video = document.getElementsByClassName("html5-main-video")[0];
    const theather_mode_btn = document.getElementsByClassName("ytp-size-button")[0];
    let is_theather_mode = false;
    masthead_container.style.overflow = "hidden"; // hide navigator when full screen
    video.style.maxHeight = "100vh"; // make video adjust to the screen height
    let psudo_fullscreen = {
        speed: 0.25,
        vis: 1,
        render: function(){
            masthead_container.style.opacity = psudo_fullscreen.vis;
            masthead_container.style.maxHeight = (psudo_fullscreen.vis*100)+"%";
        },
        full: function (){
            page_manager.style.marginTop = 0;
            player_theater_container.style.minHeight = "100vh"; // make the black background adjust to the actual height
            function draw (){
                psudo_fullscreen.render();
                psudo_fullscreen.vis -= psudo_fullscreen.speed;
                if(psudo_fullscreen.vis > 0){
                    window.requestAnimationFrame(draw);
                } else {
                    psudo_fullscreen.vis = 0;
                    psudo_fullscreen.render();
                }
            };
            window.requestAnimationFrame(draw);
        },
        close: function (){
            page_manager.style.marginTop = null;
            player_theater_container.style.minHeight = null;
            function draw (){
                psudo_fullscreen.render();
                psudo_fullscreen.vis += psudo_fullscreen.speed;
                if(psudo_fullscreen.vis < 1){
                    window.requestAnimationFrame(draw);
                } else {
                    psudo_fullscreen.vis = 1;
                    psudo_fullscreen.render();
                }
            };
            window.requestAnimationFrame(draw);
        }
    };
    if(!!player_theater_container.innerHTML){
        psudo_fullscreen.full();
        is_theather_mode = true;
    }
    theather_mode_btn.addEventListener("click", function(){
        if(is_theather_mode){
            psudo_fullscreen.close();
            is_theather_mode = false;
        } else {
            psudo_fullscreen.full();
            is_theather_mode = true;
        }
    });
}, 100) })();
