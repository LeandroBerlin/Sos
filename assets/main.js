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

    </div>
    `

        return divElement

      }
    ).join("")

    return trackList
  }

  filterTracks(search) {
    this.filtered = this.data.filter(track => track.artistName.toLowerCase().includes(search.toLowerCase()))
    this.modViewData(this.filtered)
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
    output += "<div class=\"row th\"><div>Cover</div><div>Track</div><div>Artist</div><div id='price'>Price</div></div></div > "
    output += template
    // Assinging view in to innerHTML of our domElement form the constructor
    this.container.innerHTML = output

    // Add all eventLiseners
    //this.addEventListeners()
  }
}


const myTrackList = new TrackList("#tracks", music)
// Add event listener for filter input
document.querySelector("#filter-input").addEventListener('keyup',
  event => {
    console.log("Fired")
    myTrackList.filterTracks(event.target.value)

  }
)