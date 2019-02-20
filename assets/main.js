// const tracksEl = document.querySelector('.tracks')

class TrackList {
  // Creating our Class
  constructor(domSelector, search) {
    // Getting a dom-element
    this.container = document.querySelector(domSelector)
    // Search
    this.search = search
    // Data source
    this.url = `https://dci-fbw12-search-itunes.now.sh/?term=`
    this.media = "music"
    // Search Tracks
    this.searchTracks()
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
    <div>${trackName}</div>
    <div>${artistName}</div><div><p>${collectionName}</p></div>
    <div><p>${new Date(releaseDate).toLocaleDateString()}</p></div>
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
  // Filter
  filterTracks(search) {
    const newData = this.data.filter(track => track.artistName.toLowerCase().includes(search.toLowerCase()) || track.trackName.toLowerCase().includes(search.toLowerCase()))
    this.modViewData(newData)
  }


  // Search
  searchTracks() {
    const searchUrl = `${this.url}${this.search}&media=${this.media}`
    fetch(searchUrl)
      .then(response => {
        return response.json()
      }).then((data) => {
        this.data = data.results
        this.modViewData(data.results)
      })
      .catch(function (err) {
        console.log("Something went wrong!", err)
      })
  }

  isSorted(array, prop) {
    //It will check if previous element is less than the next element.
    //If the condition is true for every element then it will return true else false
    if (prop === "trackPrice") {
      return array.slice(1).every((item, i) => {
        return array[i][prop] <= item[prop]
      })
    } else {
      //regex remove special chars -> /[^a-zA-Z ]/g, ""
      //.toLowerCase() to compare without case sensitivity.
      return array.slice(1).every((item, i) => {
        //console.log(array[i][prop].replace(/[^a-zA-Z ]/g, "") + " vs " + item[prop].replace(/[^a-zA-Z ]/g, ""))
        //console.log(array[i][prop].replace(/[^a-zA-Z ]/g, "") <= item[prop].replace(/[^a-zA-Z ]/g, ""))
        return array[i][prop].replace(/[^a-zA-Z ]/g, "").toLowerCase() <= item[prop].replace(/[^a-zA-Z ]/g, "").toLowerCase()
      })
    }


  }

  sortPricing() {
    // Sort by trackPrice
    const isAscending = this.isSorted(this.viewData, 'trackPrice')
    console.log(!isAscending ? "Not ASC -> sort ASC" : isAscending ? "It's ASC -> sort Desc" : '')
    const newData = (!isAscending ? this.viewData.sort((a, b) => a.trackPrice - b.trackPrice)
      : isAscending ? this.viewData.reverse()
        : "")
    this.modViewData(newData)
  }

  sortArtist() {
    // Sort by artistName
    const isAlphabetic = this.isSorted(this.viewData, "artistName")
    console.log(!isAlphabetic ? "Not Alphabetically -> sort Alphabetically" : isAlphabetic ? "It's Alphabetically -> reverse order" : '')
    const newData = (!isAlphabetic ? this.viewData.sort((a, b) => a.artistName.localeCompare(b.artistName)) : isAlphabetic ? this.viewData.reverse() : '')
    this.modViewData(newData)
  }

  sortTrack() {
    // Sort by artistName
    const isAlphabetic = this.isSorted(this.viewData, "trackName")
    console.log(!isAlphabetic ? "Not Alphabetically -> sort Alphabetically" : isAlphabetic ? "It's Alphabetically -> reverse order" : '')
    const newData = (!isAlphabetic ? this.viewData.sort((a, b) => a.trackName.localeCompare(b.trackName)) : isAlphabetic ? this.viewData.reverse() : '')
    this.modViewData(newData)
  }

  addEventListeners() {
    // All DOM on-event handlers
    // GlobalEventHandler to filter input
    document.querySelector("#filter-input").onkeyup =
      event => {
        console.log(`Filtering: ${event.target.value}`)
        this.filterTracks(event.target.value)
      }

    document.querySelector("#search-input").onkeyup =
      event => {
        console.log(`Searching: ${event.target.value}`)
        this.search = (event.target.value !== "" ? event.target.value : this.search)
        this.searchTracks()
      }

    // Event listener to sort price and artist
    document.querySelector("#price").addEventListener("click", () => this.sortPricing())
    document.querySelector("#track").addEventListener("click", () => this.sortTrack())
    document.querySelector("#artist").addEventListener("click", () => this.sortArtist())

    // Create event listeners for any play-button
    let playLinks = document.querySelectorAll(".fa-play")
    let data = this.data
    playLinks.forEach(
      function (link) {
        link.addEventListener("click", function (event) {
          console.log(`Playing ${event.target.id}`)
          // Retrieve the data for the selected track
          let myTrack = data.filter(track => track.trackId == event.target.id)
          // Create an audio player for the selected track
          document.querySelector("#play").innerHTML = `<audio id="player_${event.target.id}" src="${myTrack[0].previewUrl} "></audio>`
          document.querySelector(`#player_${event.target.id}`).play()
        })
      })


    // Create event listeners for any pause button   
    let pauseLinks = document.querySelectorAll(".fa-pause")
    pauseLinks.forEach(
      link => {
        link.addEventListener("click", () => {
          //Select and stop the running audio player
          let sounds = document.querySelector("audio")
          sounds.pause()
          console.log("Stop music!")
        })
      })
  }


  render() {
    // Out put will hold the complete view
    let output = ""
    // Setting up data for our view
    const header = `<h1>The Sound of ${this.search}</h1>`
    // template methode accepts data to view and returns html string
    const template = this.template(this.viewData)
    // Adding data in to our view !Order Matters!
    output += header
    output += `<p><i class="fas fa-music"></i> <span class="counter">${Object.keys(this.viewData).length} tracks</span> from iTunes</p>`
    output += "<div class=\"row th\"><div>Cover</div><div id='track'>Track</div><div id='artist' title='sort order'>Artist</div><div>Album</div><div>Release date</div><div id='price' title='Sort prices'>Price</div><div>Preview</div></div></div > "
    output += template
    // Assinging view in to innerHTML of our domElement form the constructor
    this.container.innerHTML = output
    // Add EventLiseners
    this.addEventListeners()
  }
}


const myTrackList = new TrackList("#tracks", "Nick Cave")



