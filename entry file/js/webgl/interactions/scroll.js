// Animates camera or models based on page scroll using GSAP ScrollTrigger.

import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger);

export default class Scroll{
    constructor(experience){
        this.experience = experience;
        this.camera = experience.camera.camera;
        this.wrapper = experience.wrapper;
        this.init()
    }

    init(){
        gsap.timeline({
            scrollTrigger: {
                trigger: this.wrapper,
                start: "-10% top",
                end: "+=5000",
                scrub: true,
                // markers: true,
                pin: true,
                pinSpacing: true,
                invalidateOnRefresh: true
            }
        }).to(this.camera.position,{
            x: 0,
            y: 15,
            z: 60
        }).to(this.camera.position,{
            x: 60,
            y: 15,
            z: 0
        }).to(this.camera.position, {
            x: 0,
            y: 15,
            z: -60
        }).to(this.camera.position, {
            x: -60,
            y: 15,
            z: 0
        }).to(this.camera.position, {
            x: 0,
            y: 15,
            z: 60
        })

    }
}