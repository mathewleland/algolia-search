import React, { Component } from 'react';
import './App.css';
import algoliasearch from 'algoliasearch';
import axios from 'axios';
import algoliasearchHelper from 'algoliasearch-helper';
import Restaurant from './Restaurant';
import onestar from './graphics/onestar.svg';
import twostar from './graphics/twostar.svg';
import threestar from './graphics/threestar.svg';
import fourstar from './graphics/fourstar.svg';
import fivestar from './graphics/fivestar.svg';



class App extends Component {

  constructor() {
    super()

    this.getLocation = this.getLocation.bind(this);
    // this.renderHits = this.renderHits.bind(this);
    this.renderFacetList = this.renderFacetList.bind(this);
    this.performSearch = this.performSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.adjustRating = this.adjustRating.bind(this);
    this.restrictPayment = this.restrictPayment.bind(this);

    this.state = {
      latitude: '',
      longitude: '',
      hits: [],
      query: 'steak',
      facets: []
      
    }
  }

  success = (pos) => {
    const latitude = pos.coords.latitude;
    const longitude = pos.coords.longitude;
    this.setState({ latitude, longitude });
  }

  fallback = () => {
    axios.get('http://ipinfo.io')
    .then( res => {
      console.log('location is ' + res.data.loc);
      const latitude = res.data.loc.split(',')[0];
      const longitude = res.data.loc.split(',')[1];
      this.setState({ latitude, longitude});
      return;
    })
    .catch( err => console.log(err));
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition(this.success, this.fallback);
  }
  
  componentDidMount() {
    this.getLocation();
    // this.performSearch('steak');
  };

  performSearch(query) {
    var client = algoliasearch("UGLA0G5HHX", "6c2adc457b7eb83c342856daa6cc8bb6");
    // var index = client.initIndex('OpenTableSearch');

    // index.search(query, (err, content) => {
    //   this.setState({ hits: content.hits });
    //   console.log(content);
    // })

    var helper = algoliasearchHelper(client, 'OpenTableSearch', {
      facets: ['food_type', 'payment_options', 'stars_count']
    });
    
    helper.on('result', function(data){
      console.log('this');
      // this.setState({ hits: data.hits })
      // console.log(data.hits);
    });
    

  }


  adjustRating(val) {
    this.setState({ rating: val});
  }

  restrictPayment(card) {
    this.setState({ payment: card});
  }

  handleChange(e) {
    this.setState({ query: e.target.value });
    this.performSearch(this.state.query);
  }

  renderCard(r) {
    const props = {
      key: r.objectID,
      id: r.objectID,
      name: r.name,
      image_url: r.image_url,
      stars_count: r.stars_count,
      reviews_count: r.reviews_count,
      food_type: r.food_type,
      neighborhood: r.neighborhood,
      price_range: r.price_range
    };

    return ( <Restaurant {...props} />)
  }


  renderFacetList(content) {
    console.log(content.getFacetValues('food_type'));
  }


  render() {

    

    // var index = client.initIndex('OpenTableSearch');
    const appID = "UGLA0G5HHX";
    const apiKey = "6c2adc457b7eb83c342856daa6cc8bb6";
    var client = algoliasearch(appID, apiKey);
    var helper = algoliasearchHelper(client, "OpenTableSearch", {
      facets: ['food_type'],
      disjunctiveFacets: ['payment_options', 'stars_count']
    });
    const component = this;

    //take clicks from state and add as refinements:
    // helper.addDisjunctiveFacetRefinement('payment_options', 'AMEX');
    // helper.addNumericRefinement('stars_count', '<', 3);
  
    helper.setQuery(this.state.query);
    helper.search();
    let restaurants;

    helper.on('result', (content) => {
      console.log(this);
      // console.log(content);
      restaurants = content.hits.map(this.renderCard);
      // console.log(restaurants);
      // console.log(restaurantResults);
      // console.log(component);
    });
    // console.log('now it is');
    // console.log(restaurants);

    // let restaurantResults = restaurants.map(this.renderCard);

    
    
    // console.log(client);
    // console.log(index);
    
    return (
      <div className="App">
        <div className='search'>
          <input type="text" id="search-box" onChange={this.handleChange} placeholder='Search for Restaurants by Name, Cuisine, Location'/>
        </div>

        <div id='sidebar'>

          <p>Rating</p>
          <li onClick={() => { this.adjustRating(1) }}><img src={onestar} alt='One star' /></li>
          <li onClick={() => { this.adjustRating(2) }}><img src={twostar} alt='Two star' /></li>
          <li onClick={() => { this.adjustRating(3) }}><img src={threestar} alt='Three star' /></li>
          <li onClick={() => { this.adjustRating(4) }}><img src={fourstar} alt='Four star' /></li>
          <li onClick={() => { this.adjustRating(5) }}><img src={fivestar} alt='Five star' /></li>
        </div>

        <div id='searchResults'> {restaurants}</div>
      </div>
    );
  }
}

export default App;
