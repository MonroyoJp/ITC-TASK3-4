const top = 0;
const topNav = document.querySelector(".topNav-flex");
let topNavPos = topNav.getBoundingClientRect().top;
let currentYPos;
let topNavHeight = topNav.offsetHeight;
const fixedNavClass = "nav-fixed-bg";

const mainWrapper = document.querySelector(".mainWrapper");

window.addEventListener("scroll", ()=>{
    currentYPos = top + window.scrollY;
    console.log(currentYPos + " Hello " + topNavPos);
    currentYPos >= topNavPos +  topNavHeight ? topNav.classList.add(fixedNavClass):topNav.classList.remove(fixedNavClass)
});