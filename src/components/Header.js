import React, {Component} from 'react';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comingSoon: false,
            nowShowing: false,
        };
    }

    renderActionBtn(){
        return (
            <div style={{display: 'flex'}}>
                <div style={{marginLeft: 10}}>
                    <button
                        className={this.state.comingSoon ? 'btn active' : 'btn'}
                        onClick={() => this.setState({comingSoon: !this.state.comingSoon})}>
                        Coming Soon
                    </button>
                </div>
                <div style={{marginLeft: 10}}>
                    <button
                        className={this.state.nowShowing ? 'btn active' : 'btn'}
                        onClick={() => this.setState({nowShowing: !this.state.nowShowing})}>
                        Now Showing
                    </button>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="header">
                <div className='logo'>
                    <img alt='Logo' src='http://spotforum.in/wp-content/uploads/2017/10/Bookmyshow-logo.png' />
                </div>
                <div>{this.renderActionBtn()}</div>
            </div>
        );
    }
}
export default Header;