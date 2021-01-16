import React from 'react';
import axios from 'axios';
import DatetimeRangePicker from 'react-datetime-range-picker';
import {Line} from 'react-chartjs-2';

let chart = {
  labels: ['January', 'February', 'March',
           'April', 'May'],
  datasets: [
    {
      label: 'Value',
      fill: false,
      lineTension: 0.2,
      backgroundColor: 'rgba(75,192,192,1)',
      borderColor: 'rgba(0,0,0,1)',
      borderWidth: 2,
      data: [12, 59, 80, 81, 56]
    }
  ]
}

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        buildings:[],
        objects:[],
        datafields:[],
        values:[],
        timestamps:[],
        startDate:null,
        endDate:null,
        buildingId: "",
        objectId: "",
        datafieldId: ""
    };

    this.LoadData();
}

DateTimeHandler = (event) =>{
  this.setState({
    startDate: event.start,
    endDate: event.end
  });
};

DropdownChangeHandler = (event) =>{
  
  this.setState({
    [event.target.id]: event.target.value
  });
  this.forceUpdate();
};

LoadData = () => {
  
    let apiUrl = '/Home/DropdownEntries';

    fetch(apiUrl)
        .then(res => res.json())
        .then(
              (result) => {
                  if(result != null)
                  {
                    this.setState({
                          buildings: result.BuildingList,
                          objects: result.ObjectList,
                          datafields: result.DataFieldList,
                          values: result.ValueList,
                          timestamps: result.TimeStampList,
                          startDate: result.TimeStampList[0],
                          endDate: result.TimeStampList[result.TimeStampList.length - 1]
                        });
                    chart.labels = this.state.timestamps;
                    chart.datasets[0].data = this.state.values;
                    this.forceUpdate();
                  }
                 // console.log(result);
              },
              (error) => {
                  this.setState({error})
              }
              )
    }

  Search = (event) => {
    event.preventDefault();
    
    axios.post('/Home/Search', this.state)
        .then(response => {
            if(response.data != null)
            {
                this.setState({
                  values: response.data.ValueList,
                  timestamps: response.data.TimeStampList
                });

              chart.labels = this.state.timestamps;
              chart.datasets[0].data = this.state.values;
              this.forceUpdate();
              console.log(response.data);
            }
            })
        .catch(error =>{
            console.log(error);
        });

}

  componentWillMount() {
    document.title = 'Timeseires Data Chart'
  };

  render() {
    return (
      <div>
        <br/>
        <form class="form-inline col-md-8 offset-1" onSubmit={this.Search}>
          <div class="form-group">
            <label for="buildingId">Building : &nbsp;</label>
            <select id="buildingId" onChange={this.DropdownChangeHandler} value={this.state.buildingId} class="form-control">
              <option key="" value="">Choose...</option>
              {this.state.buildings.map((item, key) => 
                <option key={item.Id} value={item.Id}>{item.Name}
                </option>
              )}
            </select>&nbsp;&nbsp;&nbsp;

            <label for="objectId"> Object : &nbsp;</label>
            <select id="objectId" onChange={this.DropdownChangeHandler} value={this.state.objectId} class="form-control">
            <option key="" value="">Choose...</option>
              {this.state.objects.map((item, key) => 
                <option key={item.Id} value={item.Id}>{item.Name}
                </option>
              )}
            </select>&nbsp;&nbsp;&nbsp;

            <label for="datafieldId"> Datafield : &nbsp;</label>
            <select id="datafieldId" onChange={this.DropdownChangeHandler} value={this.state.datafieldId} class="form-control">
            <option key="" value="">Choose...</option>
              {this.state.datafields.map((item, key) => 
                  <option key={item.Id} value={item.Id}>{item.Name}
                  </option>
              )}
            </select>&nbsp;&nbsp;&nbsp;

            <label> Datarange : &nbsp;</label>
            <DatetimeRangePicker
              //startDate={this.state.startDate}
              //endDate={this.state.endDate}
              onChange={this.DateTimeHandler}
            />
            
            &nbsp;&nbsp;&nbsp;

            <button type="submit" class="btn btn-primary">Search</button>
          </div>
        </form>

        <Line
          data={chart}
          options={{
            title:{
              display:true,
              text:'Timeseries Data',
              fontSize:20
            },
            legend:{
              display:true,
              position:'right'
            }
          }}
        />
      </div>
    );
  }
}

export default App;