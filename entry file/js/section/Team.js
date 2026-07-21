export default class Team{
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
        <div id="team" class="min-h-screen flex flex-col justify-center items-center px-8 bg-background text-text pt-2">

            <span class="px-4 py-1 rounded-full border border-border text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Research Team
            </span>

            <h2 class="mt-8 max-w-4xl text-center text-5xl font-google font-bold tracking-tight">
                Meet the
                <span class="text-primary">Team</span>
            </h2>

            <p class="mt-6 max-w-2xl text-center text-lg text-muted-foreground leading-8">
                A multidisciplinary team bringing together quantum physics, electronics,
                embedded systems, 3D visualization, and modern web technologies to build
                an interactive quantum measurement laboratory.
            </p>

            <div class="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">

                <!-- Member 1 -->
                <div class="bg-panel border border-border rounded-3xl p-8 hover:bg-panel-alt hover:-translate-y-2 transition-all duration-300">

                    <div class="h-20 w-20 rounded-full bg-primary/15 flex items-center justify-center text-3xl font-bold text-primary">
                        RY
                    </div>

                    <h3 class="mt-6 text-2xl font-semibold">
                        Rishabh Yadav
                    </h3>

                    <p class="mt-2 text-sm uppercase tracking-[0.2em] text-primary">
                        Project Lead
                    </p>

                    <p class="mt-5 text-muted-foreground leading-7">
                        Full-stack developer focused on interactive scientific
                        visualization, Three.js, and quantum computing education.
                    </p>

                </div>

                <!-- Member 2 -->
                <div class="bg-panel border border-border rounded-3xl p-8 hover:bg-panel-alt hover:-translate-y-2 transition-all duration-300">

                    <div class="h-20 w-20 rounded-full bg-primary/15 flex items-center justify-center text-3xl font-bold text-primary">
                        RY
                    </div>

                    <h3 class="mt-6 text-2xl font-semibold">
                        Rishabh Yadav
                    </h3>

                    <p class="mt-2 text-sm uppercase tracking-[0.2em] text-primary">
                        Quantum Research
                    </p>

                    <p class="mt-5 text-muted-foreground leading-7">
                        Works on superconducting qubits, microwave control systems,
                        and cryogenic measurement techniques.
                    </p>

                </div>

                <!-- Member 3 -->
                <div class="bg-panel border border-border rounded-3xl p-8 hover:bg-panel-alt hover:-translate-y-2 transition-all duration-300">

                    <div class="h-20 w-20 rounded-full bg-primary/15 flex items-center justify-center text-3xl font-bold text-primary">
                        RY
                    </div>

                    <h3 class="mt-6 text-2xl font-semibold">
                        Rishabh Yadav
                    </h3>

                    <p class="mt-2 text-sm uppercase tracking-[0.2em] text-primary">
                        Electronics
                    </p>

                    <p class="mt-5 text-muted-foreground leading-7">
                        Designs RF control chains, signal routing,
                        and laboratory instrumentation for quantum experiments.
                    </p>

                </div>

                <!-- Member 4 -->
                <div class="bg-panel border border-border rounded-3xl p-8       hover:bg-panel-alt hover:-translate-y-2 transition-all duration-300">

                    <div class="h-20 w-20 rounded-full bg-primary/15 flex items-center justify-center text-3xl font-bold text-primary">
                        RY
                    </div>

                    <h3 class="mt-6 text-2xl font-semibold">
                        Rishabh Yadav
                    </h3>

                    <p class="mt-2 text-sm uppercase tracking-[0.2em] text-primary">
                        Software Engineer
                    </p>

                    <p class="mt-5 text-muted-foreground leading-7">
                        Develops visualization tools, simulations,
                        and frontend architecture for scientific applications.
                    </p>

                </div>

                <!-- Member 5 -->
                <div class="bg-panel border border-border rounded-3xl p-8 hover:bg-panel-alt hover:-translate-y-2 transition-all duration-300">

                    <div class="h-20 w-20 rounded-full bg-primary/15 flex items-center justify-center text-3xl font-bold text-primary">
                        RY
                    </div>

                    <h3 class="mt-6 text-2xl font-semibold">
                        Rishabh Yadav
                    </h3>

                    <p class="mt-2 text-sm uppercase tracking-[0.2em] text-primary">
                        UX Designer
                    </p>

                    <p class="mt-5 text-muted-foreground leading-7">
                        Creates intuitive interfaces and educational experiences
                        that simplify complex quantum concepts.
                    </p>

                </div>

                <!-- Member 6 -->
                <div class="bg-panel border border-border rounded-3xl p-8 hover:bg-panel-alt hover:-translate-y-2 transition-all duration-300">

                    <div class="h-20 w-20 rounded-full bg-primary/15 flex items-center justify-center text-3xl font-bold text-primary">
                        RY
                    </div>

                    <h3 class="mt-6 text-2xl font-semibold">
                        Rishabh Yadav
                    </h3>

                    <p class="mt-2 text-sm uppercase tracking-[0.2em] text-primary">
                        Embedded Systems
                    </p>

                    <p class="mt-5 text-muted-foreground leading-7">
                        Specializes in FPGA programming, embedded control,
                        and real-time quantum hardware interfaces.
                    </p>

                </div>

            </div>

        </div>
        `
        document.body.appendChild(this.element);
    };
    createDesktop(){
        this.element.innerHTML = `
        <div id="team" class="min-h-screen flex flex-col justify-center items-center px-8 bg-background text-text pt-2">

    <span class="px-4 py-1 rounded-full border border-border text-xs uppercase tracking-[0.3em] text-muted-foreground mt-4 mb-2">
        Research Team
    </span>

    <h2 class="mt-8 max-w-4xl text-center text-5xl font-google font-bold tracking-tight">
        Meet the
        <span class="text-primary">Team</span>
    </h2>

    <p class="mt-6 max-w-2xl text-center text-lg text-muted-foreground leading-8">
        A multidisciplinary team bringing together quantum physics, electronics,
        embedded systems, 3D visualization, and modern web technologies to build
        an interactive quantum measurement laboratory.
    </p>

    <div class="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">

        <!-- Member 1: Project Lead -->
        <div class="bg-panel border border-border rounded-3xl p-8 hover:bg-panel-alt  transition-all duration-300">
            <div class="h-20 w-20 rounded-full bg-primary/15 flex items-center justify-center text-3xl font-bold text-primary">
                RY
            </div>
            <h3 class="mt-6 text-2xl font-semibold">
                Rishabh Yadav
            </h3>
            <p class="mt-2 text-sm uppercase tracking-[0.2em] text-primary">
                Project Lead
            </p>
            <p class="mt-5 text-muted-foreground leading-7">
                Full-stack developer focused on interactive scientific
                visualization, Three.js, and quantum computing education.
            </p>
        </div>

        <!-- Member 2: Quantum Research -->
        <div class="bg-panel border border-border rounded-3xl p-8 hover:bg-panel-alt  transition-all duration-300">
            <div class="h-20 w-20 rounded-full bg-primary/15 flex items-center justify-center text-3xl font-bold text-primary">
                RY
            </div>
            <h3 class="mt-6 text-2xl font-semibold">
                Rishabh Yadav
            </h3>
            <p class="mt-2 text-sm uppercase tracking-[0.2em] text-primary">
                Quantum Research
            </p>
            <p class="mt-5 text-muted-foreground leading-7">
                Works on superconducting qubits, microwave control systems,
                and cryogenic measurement techniques.
            </p>
        </div>

        <!-- Member 3: Electronics -->
        <div class="bg-panel border border-border rounded-3xl p-8 hover:bg-panel-alt  transition-all duration-300">
            <div class="h-20 w-20 rounded-full bg-primary/15 flex items-center justify-center text-3xl font-bold text-primary">
                RY
            </div>
            <h3 class="mt-6 text-2xl font-semibold">
                Rishabh Yadav
            </h3>
            <p class="mt-2 text-sm uppercase tracking-[0.2em] text-primary">
                Electronics
            </p>
            <p class="mt-5 text-muted-foreground leading-7">
                Designs RF control chains, signal routing,
                and laboratory instrumentation for quantum experiments.
            </p>
        </div>

        <!-- Member 4: Software Engineer -->
        <div class="bg-panel border border-border rounded-3xl p-8 hover:bg-panel-alt  transition-all duration-300">
            <div class="h-20 w-20 rounded-full bg-primary/15 flex items-center justify-center text-3xl font-bold text-primary">
                RY
            </div>
            <h3 class="mt-6 text-2xl font-semibold">
                Rishabh Yadav
            </h3>
            <p class="mt-2 text-sm uppercase tracking-[0.2em] text-primary">
                Software Engineer
            </p>
            <p class="mt-5 text-muted-foreground leading-7">
                Develops visualization tools, simulations,
                and frontend architecture for scientific applications.
            </p>
        </div>

        <!-- Member 5: UX Designer -->
        <div class="bg-panel border border-border rounded-3xl p-8 hover:bg-panel-alt  transition-all duration-300">
            <div class="h-20 w-20 rounded-full bg-primary/15 flex items-center justify-center text-3xl font-bold text-primary">
                RY
            </div>
            <h3 class="mt-6 text-2xl font-semibold">
                Rishabh Yadav
            </h3>
            <p class="mt-2 text-sm uppercase tracking-[0.2em] text-primary">
                UX Designer
            </p>
            <p class="mt-5 text-muted-foreground leading-7">
                Creates intuitive interfaces and educational experiences
                that simplify complex quantum concepts.
            </p>
        </div>

        <!-- Member 6: Embedded Systems -->
        <div class="bg-panel border border-border rounded-3xl p-8 hover:bg-panel-alt  transition-all duration-300">
            <div class="h-20 w-20 rounded-full bg-primary/15 flex items-center justify-center text-3xl font-bold text-primary">
                RY
            </div>
            <h3 class="mt-6 text-2xl font-semibold">
                Rishabh Yadav
            </h3>
            <p class="mt-2 text-sm uppercase tracking-[0.2em] text-primary">
                Embedded Systems
            </p>
            <p class="mt-5 text-muted-foreground leading-7">
                Specializes in FPGA programming, embedded control,
                and real-time quantum hardware interfaces.
            </p>
        </div>

        </div>
    </div>
        `
        document.body.appendChild(this.element);
    };

    eventListenerMobile(){

    };
    eventListenerDesktop(){

    };
}