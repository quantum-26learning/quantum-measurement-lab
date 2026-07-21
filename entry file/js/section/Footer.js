import gsap from "gsap";
import ScrollToPlugin from "gsap/src/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin);

export default class Footer{
    constructor(device){
        this.device = device
        this.element = document.createElement('div');
        if(this.device === 'mobile'){
            this.createMobile()
        }else{
            this.createDesktop()
        }
        this.eventListener();
    }

    createMobile(){
        this.element.innerHTML = `
        <footer class="border-t border-border bg-panel-alt text-text">
            <div class="max-w-7xl mx-auto px-8 py-16">
                <div class="grid md:grid-cols-3 gap-12">

                    <!-- Brand -->
                    <div>

                        <h3 id='backToTop' class="text-2xl font-google font-bold">
                         <span class="text-primary">QMCLab</span>
                        </h3>

                        <p class="mt-5 text-muted-foreground leading-7 max-w-sm">
                            An interactive 3D visualization of a superconducting quantum
                            measurement and control laboratory built for learning,
                            exploration, and scientific communication.
                        </p>

                    </div>

                    <!-- Navigation -->
                    <div>

                        <h4 class="text-lg font-semibold">
                            Navigation
                        </h4>

                        <ul id='Navigation' class="mt-5 space-y-3 text-muted-foreground">

                            <li data-target="#introduction" id="introduction" class="hover:text-primary transition-colors group-hover:translate-x-2">
                                Introduction    
                            </li>

                            <li data-target="#lab" id="lab" class="hover:text-primary transition-colors group-hover:translate-x-2">
                                Laboratory                                          
                            </li>
                            <li data-target="#team" id="team" class="hover:text-primary transition-colors group-hover:translate-x-2">
                                Team                                
                            </li>
                            <li data-target="#contact" id="contact" class="hover:text-primary transition-colors ">
                                Contact
                            </li>
                        </ul>
                    </div>

                    <!-- Connect -->
                    <div>

                        <h4 class="text-lg font-semibold">
                            Connect
                        </h4>

                        <div class="mt-5 flex flex-col gap-3 text-muted-foreground">

                            <a href="mailto:your@email.com" class="hover:text-primary transition-colors">
                                your@email.com
                            </a>

                            <a href="https://github.com/yourusername"    target="_blank" class="hover:text-primary transition-colors">
                                GitHub
                            </a>

                            <a href="https://linkedin.com/in/yourusername" target="_blank" class="hover:text-primary transition-colors">
                                LinkedIn
                            </a>

                        </div>

                    </div>

                </div>

                <!-- Divider -->

                <div class="mt-14 border-t border-border"></div>

                <!-- Bottom -->

                <div class="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">

                    <p class="text-sm text-muted-foreground">
                        © 2026 Quantum Measurement & Control Laboratory. All rights reserved.
                    </p>

                    <p class="text-sm text-muted-foreground">
                        Designed & Developed by
                        <span class="text-primary font-medium">
                            Rishabh Yadav
                        </span>
                    </p>
                </div>
            </div>

        </footer>
        `
        document.body.appendChild(this.element);
    };
    createDesktop(){
        this.element.innerHTML = `
        <footer class="border-t border-border bg-panel-alt text-text">
    <div class="max-w-7xl mx-auto px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">

            <!-- Brand Column -->
            <div>
                <h3 id="backToTop" class="text-2xl font-google font-bold cursor-pointer hover:opacity-80 transition-opacity">
                    <span class="text-primary">QMCLab</span>
                </h3>
                <p class="mt-5 text-muted-foreground leading-7 max-w-sm">
                    An interactive 3D visualization of a superconducting quantum
                    measurement and control laboratory built for learning,
                    exploration, and scientific communication.
                </p>
            </div>

            <!-- Navigation Column -->
            <div>
                <h4 class="text-lg font-semibold tracking-wide">
                    Navigation
                </h4>
                <ul id="footerNavigation" class="mt-5 space-y-3 text-muted-foreground">
                    <li data-target="#introduction" class="nav-item cursor-pointer hover:text-primary transition-colors duration-200">
                        Introduction    
                    </li>
                    <li data-target="#lab" class="nav-item cursor-pointer hover:text-primary transition-colors duration-200">
                        Laboratory                                          
                    </li>
                    <li data-target="#team" class="nav-item cursor-pointer hover:text-primary transition-colors duration-200">
                        Team                                
                    </li>
                    <li data-target="#contact" class="nav-item cursor-pointer hover:text-primary transition-colors duration-200">
                        Contact
                    </li>
                </ul>
            </div>

            <!-- Connect Column -->
            <div>
                <h4 class="text-lg font-semibold tracking-wide">
                    Connect
                </h4>
                <div class="mt-5 flex flex-col gap-3 text-muted-foreground">
                    <a href="mailto:your@email.com" class="hover:text-primary transition-colors duration-200 w-fit">
                        your@email.com
                    </a>
                    <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors duration-200 w-fit">
                        GitHub
                    </a>
                    <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors duration-200 w-fit">
                        LinkedIn
                    </a>
                </div>
            </div>

        </div>

        <!-- Horizontal Divider -->
        <div class="mt-14 border-t border-border/60"></div>

        <!-- Bottom Copyright Row -->
        <div class="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p class="text-sm text-muted-foreground tracking-wide">
                &copy; 2026 Quantum Measurement & Control Laboratory. All rights reserved.
            </p>
            <p class="text-sm text-muted-foreground tracking-wide">
                Designed & Developed by
                <span class="text-primary font-medium">
                    Rishabh Yadav
                </span>
            </p>
        </div>
        </div>
    </footer>
        `
        document.body.appendChild(this.element);
    };

    eventListener(){
        this.element.querySelector("h3").querySelector('span').addEventListener('click', ()=>{
            gsap.to(window, {
                duration: 2,
                scrollTo: '#introduction',
                ease: "power2.inOut"
            })
        })

        this.element.querySelectorAll('[data-target]').forEach((item) => {
            item.addEventListener("click", () => {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: item.dataset.target,
                    ease: "power2.inOut"
                });
            });
        });     
    };
};