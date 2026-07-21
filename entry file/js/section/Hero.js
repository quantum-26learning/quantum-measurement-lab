import gsap from "gsap";
import ScrollToPlugin from "gsap/src/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin);

export default class Hero {
    constructor(device) {
        this.device = device;
        this.element = document.createElement('div');
        if (this.device === 'mobile') {
            this.createMobile();
        } else {
            this.createDesktop();
        }
        this.eventListener();
        document.body.appendChild(this.element);
    }

    createMobile() {
        this.element.innerHTML = `
        <section id="introduction" class="h-screen w-full flex justify-center items-center">
            <div class="text-center text-white">
                <h1 class="text-4xl font-bold">Quantum Measurement & Control</h1>
                <p class="text-xl mt-4">An interactive 3D lab experience</p>
                <button id="explore-btn" class="mt-8 px-6 py-3 bg-primary text-white rounded-lg">Explore the Lab</button>
            </div>
        </section>
        `;
    }

    createDesktop() {
        this.element.innerHTML = `
        <section id="introduction" class="h-screen w-full flex justify-center items-center">
            <div class="text-center text-white">
                <h1 class="text-6xl font-bold">Quantum Measurement & Control</h1>
                <p class="text-2xl mt-4">An interactive 3D lab experience</p>
                <button id="explore-btn" class="mt-8 px-8 py-4 bg-primary text-white rounded-lg text-lg">Explore the Lab</button>
            </div>
        </section>
        `;
    }

    eventListener() {
        this.element.querySelector("#explore-btn").addEventListener('click', () => {
            gsap.to(window, {
                duration: 1,
                scrollTo: '#lab',
                ease: "power2.inOut"
            });
        });
    }
}
