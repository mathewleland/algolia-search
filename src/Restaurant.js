import React from 'react';
// import gold from './graphics/stars-plain.png';
// import gray from './graphics/star-empty.png';
import onestar from './graphics/onestar.svg';
import twostar from './graphics/twostar.svg';
import threestar from './graphics/threestar.svg';
import fourstar from './graphics/fourstar.svg';
import fivestar from './graphics/fivestar.svg';

class Restaurant extends React.Component {

renderStars() {
  // const goldStars = Math.floor(this.props.stars_count);
  // const grayStars = 5 - goldStars;

  // for (let i=0; i<goldStars; i++) {
  //   // stars += `<li className='star'> <img src={gold} alt='rating' /></li>`;
  // }

  // for (let j=0; j< grayStars; j++) {
  //   stars += `<li className='star'> <img src={gray} alt='rating' /></li>`;
  // }

  //very embarrassing here: couldn't get figure out how to use the gold and empty star imgaes and just wrap them in <li> tags, 
  // so just used SVG images for the ratings
  const goldStars = Math.round(this.props.stars_count);
  const src = [onestar, twostar, threestar, fourstar, fivestar];

  return <img src={src[goldStars-1]} alt='rating'/>;
}


render() {
  let stars = this.renderStars();
   return (
     <div className='restaurant'>
       
      <img src={this.props.image_url} className='image' alt={this.props.name}/>
       <div className='card-content'>
        <p className='title'> {this.props.name} </p>
       
        <div className='row'>
          <li className='ratingText'> {this.props.stars_count}</li>
          <li className='stars'> {stars} </li>
          <li className='descText'> ({this.props.reviews_count} reviews)</li>
        </div>
        
        <div className='row'>
          <li className='descText'> {this.props.food_type} | </li>
          <li className='descText'> {this.props.neighborhood} |</li>
          <li className='descText'> {this.props.price_range} </li>
        </div>
        
       </div>
       
     </div>
   )
 } 
}

export default Restaurant;