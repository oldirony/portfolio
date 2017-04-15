import React, {Component} from 'react';
import scrollTo from '../lib/scroll';

class PageNav extends Component {

	componentWillUpdate(newProps){
		if(newProps.isActive)	{
			scrollTo(this.elem.offsetTop, 300)
		}
	}

    render(){
    	const {children, name, isActive} = this.props;

        return (
			<section ref={elem => this.elem = elem} className="c-homepage-section o-full-height-section">
				{children}
			</section>
		)
    }
}

export default PageNav