export default class Contact{
    constructor(device){
        this.device = device;
        this.element = document.createElement('div');
        if(this.device === 'mobile'){
            this.createMobile();
            this.eventListenerMobile();
        }else{
            this.createDesktop();
            this.eventListenerDesktop();
        };
    };

    createMobile(){
        this.element.innerHTML = `
        <div id="contact" class="min-h-screen flex flex-col justify-center items-center px-8 bg-background text-text pt-4 pb-2">

            <span class="px-4 py-1 rounded-full border border-border text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Contact
            </span>

            <h2 class="mt-8 text-center text-5xl font-google font-bold tracking-tight">
                Let's Build
                <span class="text-primary">Something</span>
                Together
            </h2>

            <p class="mt-6 max-w-2xl text-center text-lg text-muted-foreground leading-8">
                Interested in collaborating, discussing quantum computing, or contributing
                to this visualization? Feel free to reach out.
            </p>

            <div class="mt-14 w-full max-w-5xl grid md:grid-cols-2 gap-8">

                <div class="bg-panel border border-border rounded-3xl p-8">
                    <div class="space-y-8">
                        <div>
                            <p class="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                                Email
                            </p>

                            <a href="mailto:rishabh@example.com" class="mt-2 text-xl">
                                your@email.com
                            </a>
                        </div>

                        <div>
                            <p class="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                                GitHub
                            </p>

                            <a href='github.com/username' target="_blank" class="mt-2 text-xl">
                                github.com/username
                            </a>
                        </div>

                        <div>
                            <p class="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                                LinkedIn
                            </p>

                            <a href='linkedin.com/in/username' target="_blank" class="mt-2 text-xl">
                                linkedin.com/in/username
                            </a>
                        </div>

                    </div>

                </div>

                <div class="bg-panel border border-border rounded-3xl p-8 flex flex-col justify-center">

                    <h3 class="text-3xl font-semibold">
                        Ready to explore?
                    </h3>

                    <p class="mt-5 text-muted-foreground leading-8">
                        Whether you're a student, researcher, or simply curious about
                        superconducting quantum computers, I'd be happy to connect and hear
                        your thoughts.
                    </p>

                    <button id='getInTouch' class="mt-10 w-fit px-7 py-3 rounded-full bg-primary-light text-white font-medium hover:bg-primary hover:scale-105 transition-transform duration-300">
                        Get In Touch
                    </button>
                </div>
            </div>   
        </div>
        `
        document.body.appendChild(this.element)
    };
    createDesktop(){
        this.element.innerHTML = `
        <div id="contact" class="min-h-screen flex flex-col justify-center items-center px-8 bg-background text-text pt-4 pb-2">

    <span class="px-4 py-1 rounded-full border border-border text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Contact
    </span>

    <h2 class="mt-8 text-center text-5xl font-google font-bold tracking-tight">
        Let's Build
        <span class="text-primary">Something</span>
        Together
    </h2>

    <p class="mt-6 max-w-2xl text-center text-lg text-muted-foreground leading-8">
        Interested in collaborating, discussing quantum computing, or contributing
        to this visualization? Feel free to reach out.
    </p>

    <div class="mt-14 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">

        <!-- Left Column: Interactive Contact Links -->
        <div class="bg-panel border border-border rounded-3xl p-8 flex flex-col justify-between gap-8">
            
            <a href="mailto:your@email.com" class="group block border-b border-border/50 pb-6 last:border-0 last:pb-0">
                <p class="text-sm uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors duration-300">
                    Email
                </p>
                <p class="mt-2 text-xl font-medium tracking-wide transition-all duration-300 group-hover:translate-x-2">
                    your@email.com
                </p>
            </a>

            <a href="https://github.com/username" target="_blank" rel="noopener noreferrer" class="group block border-b border-border/50 pb-6 last:border-0 last:pb-0">
                <p class="text-sm uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors duration-300">
                    GitHub
                </p>
                <p class="mt-2 text-xl font-medium tracking-wide transition-all duration-300 group-hover:translate-x-2">
                    github.com/username
                </p>
            </a>

            <a href="https://linkedin.com/in/username" target="_blank" rel="noopener noreferrer" class="group block">
                <p class="text-sm uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors duration-300">
                    LinkedIn
                </p>
                <p class="mt-2 text-xl font-medium tracking-wide transition-all duration-300 group-hover:translate-x-2">
                    linkedin.com/in/username
                </p>
            </a>

        </div>

        <!-- Right Column: Call to Action Card -->
        <div class="bg-panel border border-border rounded-3xl p-8 flex flex-col justify-center items-start">

            <h3 class="text-3xl font-semibold">
                Ready to explore?
            </h3>

            <p class="mt-5 text-muted-foreground leading-8">
                Whether you're a student, researcher, or simply curious about
                superconducting quantum computers, I'd be happy to connect and hear
                your thoughts.
            </p>

            <button id="getInTouch" class="mt-10 w-fit px-8 py-3.5 rounded-full bg-primary text-text font-semibold hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-md">
                Get In Touch
            </button>
        </div>
        
    </div>   
</div>
        `
        document.body.appendChild(this.element);
    };

    eventListenerMobile(){
        const getInTouch = document.querySelector('button#getInTouch');
        getInTouch.addEventListener('click', ()=>{
            window.location.href = "mailto:rishabh@example.com";
        })
    };
    eventListenerDesktop(){

    };
};