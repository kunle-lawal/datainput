import React, {Component} from "react";
import {giversNames} from '../../Data';
import GiveTypes from './GiveTypes';
import ChecksTable from './CheckTables'
import '../../css/main.css'
class Dashboard extends Component {
    state = {
        currentGiverData: {
            
        },
        currentGiver: 'empty',
        giversObj: {},
        suggestions: [],
        giveTypes: ['Tithe', 'Offering', 'Transportation', 'Bishop-David-Oyedepo', 'Welfare', 'Project', 'Thanksgiving', 'Shiloh', 'Outreach'],
        givePool: [],
        typedName: '',
        pickedName: false
    }

    findName = (e) => {
        let name = e.target.value
        let suggestions = []
        for (let i = 0; i < giversNames.length; i++) {
            let giver = giversNames[i];
            let str =  giver.substring(0, name.length);
            if (((str.toUpperCase()) === (name.toUpperCase())) && name !== "" && suggestions.length < 50) {
                suggestions.push(giver);
            }
        }
        this.setState({
            suggestions,
            typedName: name,
            pickedName: false
        })
    }

    pickName = (e) => {
        // console.log(e.target.value)
        // console.log(input.value);
        // console.log(this.state.givePool);
        let givePool = {};
        for (let i = 0; i < Object.keys(this.state.givePool).length; i++) {
            let give_type = (this.state.giveTypes[i]);
            givePool[give_type] = ({
                total: this.state.giversObj[e.target.id][give_type].totalAmount,
            })
        }
        this.setState({
            typedName: e.target.id,
            currentGiver: e.target.id,
            suggestions: [],
            currentGiverData: this.state.giversObj[e.target.id],
            givePool: givePool,
            pickedName: true,
        })
    }

    handleKeyPress = (e) => {
        let giveAmount = Number(e.target.value);
        let giveType = e.target.id;
        if(e.key === "Enter" && giveAmount > 0 && this.state.typedName !== '') {
            let givePool = this.state.givePool;
            let currentGiver = this.state.currentGiver
            let currentGiverData = this.state.giversObj[currentGiver];
            givePool[giveType].total = giveAmount;
            let totalGive = 0;
            for (let giveType in givePool) {
                totalGive += givePool[giveType].total;
            }
            // currentGiverData.totalChecks += 1;
            currentGiverData.totalAmount = totalGive;
            currentGiverData[giveType].allGivings.push(giveAmount - currentGiverData[giveType].totalAmount);
            currentGiverData[giveType].totalAmount = giveAmount;
            e.target.value = '';
            this.setState({
                currentGiverData: currentGiverData,
                givePool
            });
        }
        //send data about who gave and how much here.
    }

    handleBlur = (e) => {
        if (this.state.typedName === '') {return 0}
        let giveAmount = Number(e.target.value);
        let giveType = e.target.id;
        let givePool = this.state.givePool;
        let currentGiver = this.state.currentGiver;
        let currentGiverData = this.state.giversObj[currentGiver];
        givePool[giveType].total = giveAmount;
        let totalGive = 0;
        for (let giveType in givePool) {
            totalGive += givePool[giveType].total;
        }
        currentGiverData.totalAmount = totalGive;
        currentGiverData[giveType].allGivings.push(giveAmount - currentGiverData[giveType].totalAmount);
        currentGiverData[giveType].totalAmount = giveAmount;
        currentGiverData.givePool = givePool;
        // e.target.value = 'p';
        this.setState({
            currentGiverData: currentGiverData,
            givePool
        })
    }

    componentDidMount () {
        let giversObj = {};
        let givePool = {};
        for (let j = 0; j < this.state.giveTypes.length; j++) {
            let give_type = (this.state.giveTypes[j]);
            givePool[give_type] = ({
                total: 0,
            })
        }
        for(let i = 0; i < giversNames.length; i++) {
            let name = giversNames[i];
            giversObj[name] = ({
                name: name,
                totalChecks: 0,
                totalAmount: 0,
                givePool: givePool
            })
            for(let j = 0; j < this.state.giveTypes.length; j++) {
                let give_type = (this.state.giveTypes[j]);
                giversObj[name][give_type] = ({
                    allGivings: [],
                    totalAmount: 0,
                })
            }
        }
        this.setState({
            giversObj: giversObj,
            currentGiverData: giversObj[Object.keys(giversObj)[0]],
            givePool: givePool
        })
    }

    render() {
        // const giverTotal = this.state.giversObj[this.state.currentGiverData.name] ? this.state.giversObj[this.state.currentGiverData.name].totalAmount : 0;
        // console.log(this.state);
        return (
            <div className="main_page">
                <div className="data_tracker">
                    <div className="giver_input">
                        <input type="text" className="giver" value={this.state.typedName} placeholder="Name" onChange={this.findName}/>
                        <Total 
                            giverTotal={this.state.currentGiverData.totalAmount}
                        />
                        <GiverSuggestions
                            suggestions={this.state.suggestions}
                            giversObj={this.state.giversObj}
                            pickName={this.pickName}
                        />
                    </div>
                    <div className="give_types">
                        {
                            this.state.giveTypes.map((type, index) => {
                                if (this.state.pickedName === false) { return ''; }
                                return (
                                    <GiveTypes
                                        giveTypes={this.state.giveTypes}
                                        handleKeyPress={this.handleKeyPress}
                                        onBlur={this.handleBlur}
                                        giveTypeValues={this.state.giveTypeValues}
                                        giverData={this.state.currentGiverData}
                                        type={type}
                                        index={index}
                                        key={index}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
                <div className="check_tables">
                    <ChecksTable
                        giversObj={this.state.giversObj}
                        giveTypes={this.state.giveTypes}
                    />
                </div>
            </div>
        )
    }
}

let Total = (props) => {
    return (
        <h4 className="giver_total">${props.giverTotal || 0}</h4>
    )
}

let GiverSuggestions = (props) => {
    let suggestions = props.suggestions
    return (
        <div className="get_suggestions">
            <div className="suggestions">
                {
                    suggestions.map((name, index) => {
                        return (
                            <button className="suggestion" id={name} key={index} onClick={props.pickName}>{name}
                                <Total
                                    giverTotal={props.giversObj[name].totalAmount}
                                />
                            </button>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Dashboard
