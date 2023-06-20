// ==UserScript==
// @name         Psuedo Fullscreen
// @version      3.0
// @description  Removes navigator bar, and fix YouTube resizing problems.
// @author       Tanawat J.
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// ==/UserScript==

function YT_element (name, el) {
	if (el === undefined)
		return window[`YT_${name}`];
	window[`YT_${name}`] = {};
	window[`YT_${name}`].el = el;
}

function maximize_theater () {
  YT_element("page_manager").el.style.marginTop=0;
	YT_element("masthead_container").el.style.display='none';
	YT_element("player_theater_container").el.style.minHeight='100vh';
}

function minimize_theater () {
	YT_element("masthead_container").el.style.display='unset';
  YT_element("page_manager").el.style.marginTop=YT_element("masthead_container").el.offsetHeight+'px';
	YT_element("player_theater_container").el.style.minHeight='unset';
}

document.addEventListener('yt-navigate-finish', async () => {
	"use-strict";

	YT_element("theater_btn", document.getElementsByClassName('ytp-size-button').item(0));
	YT_element("flexy_collection", document.getElementsByTagName('ytd-watch-flexy').item(0));
	YT_element("page_manager", document.getElementById("page-manager"));
	YT_element("masthead_container", document.getElementById("masthead-container"));
	YT_element("player_theater_container", document.getElementById("player-theater-container"));

	if (!location.pathname.match("/watch"))
	{
		minimize_theater();
		return ;
	}

	if (YT_element("flexy_collection").el.theater)　maximize_theater();
	YT_element("theater_btn").el.addEventListener("click", function () {
		if(!YT_element("flexy_collection").el.theater) maximize_theater();
		else minimize_theater();
	});
});
