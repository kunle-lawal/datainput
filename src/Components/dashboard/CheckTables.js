import React, {Component} from 'react'

class ChecksTable extends Component {
    state = {
        filename: 'csvData',
    }

    convertToCSV = () => {
        let csv = [];
        let rows = document.querySelectorAll("table tr");

        for (let i = 0; i < rows.length; i++) {
            let row = [];
            let cols = rows[i].querySelectorAll("td, th");

            for (let j = 0; j < cols.length; j++) {
                //skip the header
                if (j < 1 || i < 1) {
                    row.push(cols[j].innerText)
                } else {
                    row.push(cols[j].children[0].value)
                }
            }
            csv.push(row.join(","))
        }
        return csv;
        // this.downloadCSV(csv)
    }

    downloadCSV = () => {
        let csv = this.convertToCSV().join("\n");
        let csvFile;
        let downloadLink;

        //create csv file
        csvFile = new Blob([csv], { type: "text/csv" });

        //create download link
        downloadLink = document.createElement('a');

        //file name
        downloadLink.download = this.state.filename + '.csv';

        //create a link to the file
        downloadLink.href = window.URL.createObjectURL(csvFile);

        //do not display link 
        downloadLink.style.display = "none";

        //add the link to the DOM
        document.getElementById('root').appendChild(downloadLink);

        downloadLink.click();
    }

    render() {
        let giversObj = this.props.giversObj ? this.props.giversObj : [];
        let giveTypes = this.props.giveTypes ? this.props.giveTypes : [];
        let data = [];
        for (var give in giversObj) {
            data.push(giversObj[give])
        }
        return (
            <>
                <button onClick={this.downloadCSV}>Download CSV File</button>
                <table>
                    <thead>
                        <tr>
                            <th className="column1">Givers Name Or Number #</th>
                            {
                                giveTypes.map((giveType, index) => {
                                    return (
                                        <th className={`column${index+2}`} key={index} id={index}>{giveType}</th>
                                    )
                                })
                            }
                        </tr>
                    </thead>

                    <tbody>
                        {
                            data.map((item, index) => {
                                return (
                                    <tr key={index} id={index}>
                                        <td className={`column1`} id={index}>{item.name}</td>
                                        {
                                            Object.keys(item.givePool).map((givePoolItem, index) => {
                                                return (
                                                    <td className={`${givePoolItem} column${index + 2} inputs`} id={index} key={index}><input type="number" id={givePoolItem} value={item.givePool[givePoolItem].total} /></td>
                                                )
                                            })
                                        }
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </>
        )
    }
}

export default ChecksTable