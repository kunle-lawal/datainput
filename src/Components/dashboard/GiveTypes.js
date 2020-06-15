import React, { Component } from "react";

class GiveTypes extends Component {
    state = {
        
    }

    onChange = (e) => {
        this.setState({
            [this.props.type]: {
                value: Math.abs(e.target.value)
            }
        })
    }

    componentWillMount () {
        this.setState({
            [this.props.type]: {
                value: this.props.giverData[this.props.type].totalAmount > 0 ? this.props.giverData[this.props.type].totalAmount : ''
            }
        })
    }

    render() {
        let {index} = this.props;
        let {type} = this.props;
        return (
            <div className="give_type" id={index} key={index}>
                <h4>{type}</h4>
                <input type="number" id={type} value={this.state[type].value} onChange={this.onChange} onKeyPress={this.props.handleKeyPress} onBlur={this.props.onBlur} placeholder={this.props.giverData[type] ? this.props.giverData[type].totalAmount : 0} />
            </div>
        )
    }
}

export default GiveTypes