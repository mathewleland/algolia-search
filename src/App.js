import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
    this.renderFacetList = this.renderFacetList.bind(this);
    // this.performSearch = this.performSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.adjustRating = this.adjustRating.bind(this);
    this.restrictPayment = this.restrictPayment.bind(this);
    this.renderPagination = this.renderPagination.bind(this);

    this.state = {
      latitude: '',
      longitude: '',
      hits: [],
      query: 'steak',
      facet: null,
      rating: 0,
      payment: null,
      page: 0
      
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
  };


  adjustRating(val) {
    this.setState({ rating: val});
  }

  restrictPayment(card) {
    this.setState({ payment: card});
  }

  handleChange(e) {
    this.setState({ 
      query: e.target.value,
      facet: null,
      rating: 0,
      payment: null

    });
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

  renderFacetList(facets) {
    facets = facets.slice(0,6);

    return (
      <div>
        <p> Cuisine / Food Type</p>
        <table className='descText food-table'>
          <tbody>
            {
              facets.map( (facet) => {
                return ( 
                  <tr onClick={ () => this.setState({ facet: `${facet.name}`})} key={facet.name}>
                    <td className='left'>{facet.name}</td>  
                    <td className='right'>{facet.count}</td> 
                  </tr> 
                )
              }
              )
            }
          </tbody>
          
        </table>
      </div>
      
      )

  }

  renderPagination() {
    return (
      <div>
        <button 
          className='pagination' 
          onClick={ ()=> { this.setState({ page: this.state.page +1 }) } } >
          Show More 
        </button>
        <button 
          className='pagination reset'
          onClick={ () => { this.setState({
            query: '',
            facet: null,
            payment: null,
            rating: 0,
            page: 0
          })}}>
          Reset Search
        </button>
      </div>
    )
  }

  render() {

    const appID = "UGLA0G5HHX";
    const apiKey = "6c2adc457b7eb83c342856daa6cc8bb6";
    const client = algoliasearch(appID, apiKey);
    
    const helper = algoliasearchHelper(client, "OpenTableSearch", {
      facets: ['food_type'],
      disjunctiveFacets: ['payment_options', 'stars_count']
    });

    // Add in the Filters on sidebar
    helper.addNumericRefinement('stars_count', '>=', this.state.rating);
    if (this.state.payment) helper.addDisjunctiveFacetRefinement('payment_options', this.state.payment);
    if (this.state.facet) helper.addFacetRefinement('food_type', this.state.facet);
  
    helper.setQuery(this.state.query);
    const location = `${this.state.latitude}, ${this.state.longitude}`;
    helper.setQueryParameter('aroundLatLng', location);
    helper.setPage(this.state.page);
    helper.search();

    helper.on('result', (content) => {

      //this helper method is creating a closure that is preventing me from assigning variables to render outside of the helper function
      //i normally don't use ReactDOM.render within a componen'ts render method, but it seemed like the only way right now

      const facets = content.getFacetValues('food_type');
      ReactDOM.render(
        this.renderFacetList(facets),
        document.getElementById('foodFacets')
      )

      const restaurants = content.hits.map(this.renderCard);
      ReactDOM.render(
        restaurants,
        document.getElementById('searchResults')
      );
      
    });

    
    return (
      <div className="App">
        <div className='search'>
          <input type="text" id="search-box" onChange={this.handleChange} placeholder='Search for Restaurants by Name, Cuisine, Location'/>
        </div>

        <div id='sidebar'>
          
          <div id='foodFacets'></div>

          <p>Rating</p>
          <li onClick={() => { this.adjustRating(1) }}><img src={onestar} alt='One star' /></li>
          <li onClick={() => { this.adjustRating(2) }}><img src={twostar} alt='Two star' /></li>
          <li onClick={() => { this.adjustRating(3) }}><img src={threestar} alt='Three star' /></li>
          <li onClick={() => { this.adjustRating(4) }}><img src={fourstar} alt='Four star' /></li>
          <li onClick={() => { this.adjustRating(5) }}><img src={fivestar} alt='Five star' /></li>

          <p>Payment Options</p>
          <li className='descText' onClick={() => {this.restrictPayment("Visa")}}>VISA</li>
          <li className='descText' onClick={() => {this.restrictPayment("MasterCard")}}>MasterCard</li>
          <li className='descText' onClick={() => {this.restrictPayment("AMEX")}}>AMEX</li>
          <li className='descText' onClick={() => {this.restrictPayment("Discover")}}>Discover</li>
        
        </div>

        <div id='searchResults'></div>
        
        {this.renderPagination()}

        
      </div>
    );
  }
}

export default App;
