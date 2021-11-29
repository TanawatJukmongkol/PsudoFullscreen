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

(function(){
    'use strict';
    let elements; // List of elements that needs to be loaded.
    // Bruh.
    function get_elements () {
        elements = {
            masthead_container: document.getElementById("masthead-container"),
            page_manager: document.getElementById("page-manager"),
            player_theater_container: document.getElementById("player-theater-container"),
            video: document.getElementsByClassName("html5-main-video")[0],
            theather_mode_btn: document.getElementsByClassName("ytp-size-button")[0],
            fullscreen_btn: document.getElementsByClassName("ytp-fullscreen-button")[0]
        };
    }
    main();
    document.addEventListener('yt-navigate-finish', main);
    document.addEventListener('DOMContentLoaded', main);
    function main () {
        if (!window.location.pathname.startsWith("/watch")) { return; }
        get_elements();
        let is_theather_mode = false;
        elements.masthead_container.style.overflow = "hidden"; // hide navigator when full screen
        elements.video.style.maxHeight = "100vh"; // make video adjust to the screen height
        let psudo_fullscreen = {
            speed: 0.25,
            vis: 1,
            render: function(){
                elements.masthead_container.style.opacity = psudo_fullscreen.vis;
                elements.masthead_container.style.maxHeight = (psudo_fullscreen.vis*100)+"%";
            },
            full: function (){
                elements.page_manager.style.marginTop = 0;
                elements.player_theater_container.style.minHeight = "100vh"; // make the black background adjust to the actual height
                elements.fullscreen_btn.style.display = "none";
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
                elements.page_manager.style.marginTop = null;
                elements.player_theater_container.style.minHeight = null;
                elements.fullscreen_btn.style.display = null;
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
        if(!!elements.player_theater_container.innerHTML){
            psudo_fullscreen.full();
            is_theather_mode = true;
        }
        elements.theather_mode_btn.addEventListener("click", function(){
            if(is_theather_mode){
                psudo_fullscreen.close();
                is_theather_mode = false;
            } else {
                psudo_fullscreen.full();
                is_theather_mode = true;
            }
        });
    };
})();
