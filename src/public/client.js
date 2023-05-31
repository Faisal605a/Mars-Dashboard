// const Immutable = require('immutable');
// require('dotenv').config()
// const { Map } = require('immutable');
let store = Immutable.Map({
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    
});

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (oldstore, newState) => {
    store = store.set(oldstore,newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    console.log("App")
    console.log(state)
    // rovers.
    return `
        <header></header>
        <main>
        
            ${Greeting(state.get("user").name)}
            <section>
                <h3>Here are Photos from diffrent mars's rovers!</h3>
                
                <button onclick='Curiosity(ImageOfTheDay)'> ${state.get("rovers")[0]} </button>
                <button onclick='Opportunity(ImageOfTheDay)'> ${state.get("rovers")[1]} </button>
                <button onclick='Spirit(ImageOfTheDay)'> ${state.get("rovers")[2]} </button>
                <br>
                ${getInfromation()}
                
            </section>
        </main>
        <footer></footer>
    `

}

const Curiosity = (c) =>{
    c(store.get("apod"),store.get("rovers")[0] )
}
const Opportunity = (o) =>{
    o(store.get("apod"),store.get("rovers")[1] )
}
const Spirit = (s) =>{
    s(store.get("apod"),store.get("rovers")[2] )
}


// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})
function getInfromation(){
    apod = store.get("apod");
    return apod!=""?   `
            <img src='${apod.photpObject.photos[0].img_src}' height="350px" width="100%" >
            <p>Name: ${apod.photpObject.photos[0].rover.name}</p>
            <p>Landing Date: ${apod.photpObject.photos[0].rover.landing_date}</p>
            <p>Launch Date: ${apod.photpObject.photos[0].rover.launch_date}</p>
            <p>Status of Rover: ${apod.photpObject.photos[0].rover.status}</p>
            <p>Date of Photo: ${apod.photpObject.photos[0].earth_date}</p>
        ` : ""
}
// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod, rover) => {
    console.log("ImageOfTheDay")
    console.log(store)
    console.log(apod)
    console.log(rover)
    
    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    if(apod!=""){
        const photodate = new Date(apod.date)
        console.log(photodate.getDate(), today.getDate());
        photodate.getDate() === today.getDate()? console.log("") : getImageOfTheDay(rover)

    }else{
         getImageOfTheDay(rover)
    }
    // if (!apod || apod.date === today.getDate() ) {
    //     console.log("status changed")
    // }
 
   
    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        console.log(apod)
        // console.log(apod.photpObject.photos[0].rover.name)
         
    }
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state
    console.log("getImageOfTheDay")
    console.log(state)
    fetch(`http://localhost:3000/rover/${state}`)
        .then(res => res.json())
        .then(apod => updateStore("apod",  apod ))


}
