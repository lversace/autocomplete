import React, { Component } from 'react'; 
import TextField from '@material-ui/core/TextField';  
import Autocomplete from '@material-ui/lab/Autocomplete';  
import AppBar from '@material-ui/core/AppBar';  
import Toolbar from '@material-ui/core/Toolbar';  
import './App.css';  
import axios from 'axios';  
import { PrefixValidator } from './PrefixValidator';

export class Autoc extends Component {  

        constructor(props) { 

                super(props)

                this.uri = 'https://localhost:44384/'
                this.endpointMatches = 'api/searchitems?prefix='
                this.endpointTop = 'api/instrumentstops?prefix='
                this.endpointContains = 'api/contains?prefix='
                this.endpointPostTop = 'api/instrumentstops'

               
                this.state = {  
                        ProductData: []  
                }  
                
        }  

           onSelected = (event, value) => {

                if (value == null) return;
               
                axios.post(this.uri + this.endpointPostTop,
                        {
                           Name: value.name
                      })
                      .then(function (response) {
                        console.log(response);
                      })
                      .catch(function (error) {
                        console.log(error);
                      });

           }


              onTagsChange = (event, value) => {
                let validator = new PrefixValidator();
              
                if (validator.isAcceptable(value)){
                        let matches = this.uri + this.endpointMatches + value;
                        let top = this.uri + this.endpointTop + value;
                        let contains = this.uri + this.endpointContains + value;
                        const requestItems = axios.get(matches);
                        const requestTops = axios.get(top);
                        const requestContains = axios.get(contains);
                        
                        axios
                                .all([requestItems, requestTops, requestContains])
                                .then(
                                axios.spread((...responses) => {
                                const responseItems = responses[0];
                                const responseTop = responses[1];
                                const responseContains = responses[2];

                                let combineResponse =  [].concat(responseItems.data, responseTop.data, responseContains.data);
                                this.setState({  
                                        ProductData: combineResponse
                                });
                                
                                })
                                )
                                .catch(errors => {
                                // react on errors.
                                console.error(errors);
                        });

                }
             
              }



        render() {
                return (  
                       
                        <div>
                                <AppBar className="mrg" position="static"> 
                                        <Toolbar >CS auto complete</Toolbar>  
                                </AppBar> 
                                <Autocomplete className="pding"  
                                        id="items"  
                                        options={this.state.ProductData} 
                                        getOptionLabel={option => option.name}  
                                        style={{ width: 300 }}  
                                        onInputChange={this.onTagsChange}
                                        onChange={this.onSelected}
                                        renderInput={params => (  
                                                <TextField {...params} label="Auto Complete" variant="outlined" fullWidth />  
                                        )}
                                />  

                        </div>  

                      



                )  
           

        }
}  

export default Autoc 