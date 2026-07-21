export default class InteractiveLab{
    constructor(device){
        this.element = document.createElement('div');
        this.device = device;
        this.firstvideo = true;
        if(this.device === 'mobile'){
            this.createMobile();
            this.eventListenerMobile();
        }
           
    };

    createMobile(){
        this.element.className = ` w-screen h-screen bg-background mt-25 text-text`;
        this.element.id = 'lab';
        this.element.innerHTML = `
        <div class='flex items-center justify-center'>
            <span class="px-4 py-1 rounded-full border border-border text-xs uppercase tracking-[0.3em] text-text text-center mb-2 mt-2">
                Laboratory
            </span>
        </div>
        <div class='h-[82vh] w-screen '>
            
            <video class='webgl inset-0 flex ml-2 bg-panel h-[80vh] w-[96vw] items-center justify-center rounded-b-lg object-cover'  autoplay muted loop playsinline>
                <source src="../assets/video/background-video.mp4" type="video/mp4">
            </video>
        </div>
        <div class='flex items-center justify-center gap-3 '>
            <button id='first' class="flex flex-col px-7 py-3 rounded-md bg-panel text-lg text-primary font-extrabold hover:scale-105 hover:bg-panel-alt transition-transform duration-300">
                    <span class='text-xl'>Single - Tone</span>
                    <span>Spectroscopy</span>
            </button>
            <button id='second' class="flex flex-col px-7 py-3 rounded-md bg-panel text-lg text-primary font-extrabold hover:scale-105 hover:bg-panel-alt transition-transform duration-300 border-border">
                    <span class='text-xl'>Two - Tone</span>
                    <span >Spectroscopy</span>
            </button>
        </div>
        `
        document.body.appendChild(this.element);
    };

    createDesktop(){
        this.element.className = 'min-h-screen w-screen mt-4 flex flex-col justify-center items-center text-text'
        this.element.innerHTML = `
        <span class="px-4 py-1 rounded-full border border-border text-xs uppercase tracking-[0.3em] mt-4 mb-2">
            Laboratory
        </span>
        <div class='canvas_wrapper min-h-[90vh] w-[80vw]'>
            <canvas class='webgl max-h-[90vh] max-w-[80vw] rounded-lg border-border'></canvas>
        
        <div class='flex items-center justify-center gap-8 mt-2'>
            <button id='first' class="flex flex-col px-7 py-3 rounded-md bg-primary-light text-lg text-text font-extrabold hover:scale-105 hover:bg-primary transition-transform duration-300">
                    <span class='text-xl'>Single - Tone</span>
                    <span>Spectroscopy</span>
            </button>
            <button id='second' class="flex flex-col px-7 py-3 rounded-md bg-primary-light text-lg text-text font-extrabold hover:scale-105 hover:bg-primary transition-transform duration-300">
                    <span class='text-xl'>Two - Tone</span>
                    <span >Spectroscopy</span>
            </button>
        </div>
        </div>
        `
        document.body.appendChild(this.element);

        const canvasWrapper = document.querySelector('.canvas_wrapper');
        const canvas = document.querySelector('.webgl');

        return { canvasWrapper, canvas };
    };

    eventListenerMobile(){
        const firstTone = document.querySelector('button#first');
        const secondTone = document.querySelector('button#second');
        const video = document.querySelector('.webgl')
        const source = video.querySelector('source');

        firstTone.addEventListener('click', ()=>{
            if (!this.firstvideo){
                source.src = '../assets/video/background-video.mp4';
                video.load(); 
                video.play();
                this.firstvideo = true;
            }
        })

        secondTone.addEventListener('click', ()=>{
            if (this.firstvideo){
                source.src = '../assets/video/home-slide-1.mp4';
                video.load(); 
                video.play();

                this.firstvideo = false
            }
        })
        
    };

    eventListenerDesktop(){

    };
};