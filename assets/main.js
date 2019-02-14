// const tracksEl = document.querySelector('.tracks')

class TrackList {
  // Creating our Class
  constructor(domSelector, data) {
    // Getting a dom-element
    this.container = document.querySelector(domSelector)
    // Store my data
    this.data = data
    // Represents the currently displayed data
    this.viewData = data

    // Show stuff
    this.render()
    // Add EventLiseners
    this.addEventListeners()

  }

  modViewData(newData) {
    this.viewData = newData
    this.render()
  }

  template(music) {
    // Mapping over data and returning HTML String
    // For now we just assume that all data is there and that it is
    // from datatype string
    // TODO: create a template function
    const trackList = music.map(

      track => {
        const { trackId, trackName, artistName, collectionName, releaseDate, artworkUrl100, trackPrice, currency, previewUrl } = track;

        const divElement = `
  <div class="row">
    <div>
    <img src="${artworkUrl100}"></div>
    <div>${trackName} <p>Released: ${new Date(releaseDate).toLocaleDateString()}</p></div>
    <div>${artistName}<p>${collectionName}</p></div>
    <div>${trackPrice == -1 ? "Only album" : trackPrice} ${currency == "USD" ? trackPrice == -1 ? "" : "$" : "€"}</div>
    <div>
    <i class="fas fa-play" id="${trackId}"></i>
    <i class="fas fa-pause" id="${trackId}"></i>
    </div>
  </div>
  `

        return divElement

      }
    ).join("")

    return trackList
  }

  filterTracks(search) {
    const newData = this.data.filter(track => track.artistName.toLowerCase().includes(search.toLowerCase()))
    this.modViewData(newData)
  }

  sortPricing() {

    const order = this.viewData[0].trackPrice
      < this.viewData[this.viewData.length - 1].trackPrice

    const newData = this.viewData.sort(
      (a, b) =>
        (order ? b.trackPrice - a.trackPrice : a.trackPrice - b.trackPrice)
    )

    this.modViewData(newData)
  }

  addEventListeners() {

    // Add event listener for filter input
    document.querySelector("#filter-input").addEventListener('keyup',
      event => {
        console.log(event.target.value)
        myTrackList.filterTracks(event.target.value)
      }
    )

    // Add event listener for sort price
    document.querySelector("#price").addEventListener("click", () => this.sortPricing())

    // Add eventlisteners for all play button
    let playLinks = document.querySelectorAll(".fa-play")
    let data = this.data

    playLinks.forEach(
      function (link) {
        link.addEventListener("click", function (event) {
          console.log(`play ${event.target.id}`)

          let myTrack = data.filter(track => track.trackId == event.target.id)
          document.querySelector("#play").innerHTML = `<audio id="player_${event.target.id}" src="${myTrack[0].previewUrl} "></audio>`
          document.querySelector(`#player_${event.target.id}`).play()
        })
      })


    // Add eventlisteners for all pause button  
    // The pause will stop any track not only it's own - not a bug but a feuture  
    let pauseLinks = document.querySelectorAll(".fa-pause")
    pauseLinks.forEach(
      link => {
        link.addEventListener("click", () => {
          let sounds = document.querySelectorAll("audio")
          sounds.forEach(sound => sound.pause())
          console.log("Stop it!")
        })
      })
  }


  render() {
    // Out put will hold the complete view
    let output = ""

    // Setting up data for our view
    const header = "<h1>My Tracks</h1>"
    // template methode accepts data to view and returns html string
    const template = this.template(this.viewData)
    // Adding data in to our view !Order Matters!
    output += header
    output += "<p>Data from iTunes</p>"
    output += "<div class=\"row th\"><div>Cover</div><div>Track</div><div>Artist</div><div id='price'>Price</div><div>Preview</div></div></div > "
    output += template
    // Assinging view in to innerHTML of our domElement form the constructor
    this.container.innerHTML = output
  }
}

const myTrackList = new TrackList("#tracks", music)

