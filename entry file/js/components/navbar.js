import gsap from "gsap";
import ScrollToPlugin from "gsap/src/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin)

export default class Navbar{
    constructor(device){
        this.device = device;
        this.element = document.createElement('nav');
        this.isOpen = false;
        if (this.device === 'mobile'){
            this.createMobile()
            this.eventListenerMobile();
        }else{
            this.createDesktop()
            this.eventListenerDesktop();
        }   
    };

    createMobile(){
        this.element.className = 'fixed top-0 left-0 w-screen h-[10vh] bg-panel-alt z-2 text-text'
        this.element.innerHTML = `
            <div class='flex items-center justify-between h-full px-4'>

                <button  class='w-10 h-10 flex items-center justify-center font-google text-xl font-extrabold'>☰</button>

                <h1 class='text-xl font-extrabold font-google text-primary'>QMCLab</h1>
            </div>

            <div id='drop_down_menu' class='flex transition-all duration-300 ease-in-out -translate-y-5 opacity-0 pointer-events-none w-screen bg-panel-alt flex-col justify-center items-center pb-2 rounded-b-lg '>

                <li data-target="#introduction" class='list-none font-google font-bold'>INRODUCTION</li>
                <li data-target="#lab" class='list-none font-google font-bold '>LAB</li>
                <li data-target="#team" class='list-none font-google font-bold '>TEAM</li>
                <li data-target="#contact" class='list-none font-google font-bold '>CONTACT</li>
            </div>
        `
        document.body.appendChild(this.element)
    };

    createDesktop(){
        this.element.className = 'fixed top-0 left-0 z-50 w-full h-[10vh] bg-panel-alt border-b border-border text-text';
        this.element.innerHTML = `   
        <div class="max-w-7xl mx-auto h-full px-8 flex items-center justify-between">

            <ul class="flex items-center gap-10">
                <li
                    data-target="#introduction"
                    class="relative cursor-pointer font-google font-semibold text-foreground transition-colors duration-300 hover:text-primary after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
                    INTRODUCTION
                </li>

                <li
                    data-target="#lab"
                    class="relative cursor-pointer font-google font-semibold text-foreground transition-colors duration-300 hover:text-primary after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
                    LAB
                </li>

                <li
                    data-target="#team"
                    class="relative cursor-pointer font-google font-semibold text-foreground transition-colors duration-300 hover:text-primary after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
                    TEAM
                </li>

                <li
                    data-target="#contact"
                   class="relative cursor-pointer font-google font-semibold text-foreground transition-colors duration-300 hover:text-primary after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
                CONTACT
                </li>
            </ul>

            <div class="flex items-center gap-3 cursor-pointer">
                <h1 class="text-2xl font-google font-extrabold text-primary tracking-wide">
                 QMCLab
                </h1>
            </div>
        </div>
        `
        document.body.appendChild(this.element);
    };

    eventListenerMobile(){
        const menu = this.element.querySelector('#drop_down_menu');
        const button = this.element.querySelector('button');
        
        this.element.querySelectorAll("[data-target]").forEach((item) => {
            item.addEventListener("click", () => {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: item.dataset.target,
                    ease: "power2.inOut"
                });
            });
        });

        button.addEventListener("click", () => {
            if (!this.isOpen) {
                button.innerText = "X";
                menu.classList.toggle("-translate-y-5");
                menu.classList.toggle("opacity-0");
                menu.classList.toggle("pointer-events-none");
                this.isOpen = true;
            } else {
                button.innerText = "☰";
                menu.classList.toggle("-translate-y-5");
                menu.classList.toggle("opacity-0");
                menu.classList.toggle("pointer-events-none");
                this.isOpen = false;
            }
        });

    };
    eventListenerDesktop(){
        this.element.querySelectorAll("[data-target]").forEach((item) => {
            item.addEventListener("click", () => {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: item.dataset.target,
                    ease: "power2.inOut"
                });
            });
        });
    }
};