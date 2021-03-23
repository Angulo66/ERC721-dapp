import React, { Component } from "react";
import UniqueAsset from "./build/UniqueAsset.json";
import getWeb3 from "./utils/web3";
import ipfs from './ipfs';
import Navbar from './components/Navbar'

import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '0x0',
            uniqueAsset: {},
            buffer: {},
            loading: true,
            ipfsHash: []
        };
    }

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0]
            const networkId = await web3.eth.net.getId();

            const UniqueAssetData = UniqueAsset.networks[networkId]
            if (UniqueAssetData) {
                const instance = new web3.eth.Contract(UniqueAsset.abi, UniqueAssetData.address);
                this.setState({ loading: false, account, uniqueAsset: instance }, this.retrieveFile);
            } else {
                window.alert('UniqueAsset contract not deployed to detected network!')
            }

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    retrieveFile = async () => {
        const { account, uniqueAsset, ipfsHash } = this.state;
        let tokensOwned = await uniqueAsset.methods.balanceOf(account).call();
        console.log(account)
        //console.log(tokensOwned)
        if (tokensOwned > 0) {
            //console.log(tokensOwned)
            const totalSupply = 4;
            let i = 1;
            do {
                let owner = await uniqueAsset.methods.ownerOf(i).call();
                if (owner === account) {
                    let hash = await uniqueAsset.methods.tokenURI(i).call();
                    console.log(hash)
                    ipfsHash.push(hash);
                }
                i = i + 1;
            } while (i < totalSupply);
        }
        console.log(ipfsHash)
        //const { accounts, contract } = this.state;
        // Get the value from the contract to prove it worked.
        //const ipfsHash = await contract.methods.get().call();
        // Update state with the result.
        //this.setState({ ipfsHash: ipfsHash });
    };

    createJSON = (ipfsHash) => {
        let obj = { token: [] }
        obj.token.push({ name: 'test1', description: 'test11', uri: 'ipfs://' + ipfsHash })
        let ipfsJson = JSON.stringify(obj)
        return ipfsJson;
    }

    getJSON = (ipfsHash) => {
        ipfs.files.get(ipfsHash, function (err, files) {
            files.forEach((file) => {
                console.log(file.path)
                console.log("File content >> ", file.content.toString('utf8'))
            })
        })
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const { account, buffer, uniqueAsset } = this.state;
        this.tokenName = React.createRef()
        console.log(this.tokenName)
        try {
            this.setState({ loading: true })
            let imageUri = await ipfs.add(buffer);
            let ipfsHash = imageUri.path;
            let jsonHash = this.createJSON(ipfsHash);
            let uri = await ipfs.add(jsonHash);
            console.log('minting token..... for:', account)

            uniqueAsset.methods.awardItem(account, uri.path).send({ from: account })
                .on('transactionHash', (hash) => {
                    this.setState({ loading: false })
                    console.log(uri.path)
                })
        } catch (error) {
            console.error(error);
        }
    }

    // this method is called whenever a file is uploaded
    // gets uploaded file and converts it to appropriate format for IPFS
    // stores the file in this component's state
    captureFile = (event) => {
        event.preventDefault();

        const file = event.target.files[0]; // access file from user input
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file); // convert file to array for buffer
        // after reader finishes, initialise buffer and store in component state
        reader.onloadend = () => {
            this.setState({ buffer: Buffer(reader.result) });

            console.log('buffer', this.state.buffer); // console should log uint8array...
        }
    }

    render() {
        return (
            <div className="App">
                <Navbar account={this.state.account} />
                <h1>Your Image</h1>
                <p>This image is stored on IPFS & Ethereum blockchain!</p>
                <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt='' />
                <h2>Upload Image</h2>
                <form onSubmit={this.onSubmit}>
                    <input type='file' onChange={this.captureFile} />
                    <input type='text'
                        ref={(this.tokenName)}
                        className='form-control form-control-lg'
                        placeholder='Name'
                        required
                    />
                    <input type='text' placeholder='Description' />
                    <input type='submit' />
                </form>
            </div>
        );
    }
}

export default App;