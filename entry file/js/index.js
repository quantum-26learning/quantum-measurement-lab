
import "../css/style.css";
import Experience from "./webgl/sceneSetup/Experience.js";
import Navbar from "./components/Navbar.js";
import Hero from "./section/Hero.js";
import InteractiveLab from "./section/InteractiveLab.js";
import Team from "./section/Team.js";
import Contact from "./section/Contact.js";
import Footer from "./section/Footer.js";

 
// if (window.matchMedia('(max-width: 768px)').matches){
//     console.log('mobile')
//     new Navbar('mobile')
//     new Hero('mobile')
//     new InteractiveLab('mobile')
//     new Team('mobile')
//     new Contact('mobile')
//     new Footer('mobile')
     
// }
// else if (window.matchMedia("(min-width: 768px) and (max-width: 1023px)").matches){
//     console.log('tablets')
//     new Navbar('mobile')
//     new Hero('mobile')
//     new InteractiveLab('mobile')
//     new Team('mobile')
//     new Contact('mobile')
//     new Footer('mobile')
// }
// else{
    // new Navbar('desktop');
    // new Hero('desktop');
    const interactiveLab = new InteractiveLab('desktop');
    const { canvasWrapper, canvas } = interactiveLab.createDesktop();
    interactiveLab.eventListenerDesktop();
    // new Team('desktop');
    // new Contact('desktop');
    // new Footer('desktop');
    new Experience(canvasWrapper, canvas);
// }



