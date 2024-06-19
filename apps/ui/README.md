<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://gcdnb.pbrd.co/images/t81sgfn0MXD1.png?o=1)

This is a project designed to help developers to create their own PSBT without having to code. This project uses [https://github.com/EAST-Blue/east-bitcoin-lib/tree/master/packages/sdk](east-bitcoin-lib) at its core to act as wrapper around [https://github.com/bitcoinjs/bitcoinjs-lib](bitcoinjs-lib).

<!-- GETTING STARTED -->

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

Before you can start the project, make sure you already run local regtest for bitcoin. Here's how you can install the regtest using this link from [https://github.com/joundy/bitcoin-local-dev-setup]@joundy

Also make sure you already know the basics of bitcoin-cli commands to continue running the project locally.

### Installation

After the regtest is up in your local machine, now you can start running the project locally

1. Clone the repo

   ```sh

   git clone https://github.com/EAST-Blue/east-bitcoin-lib/tree/master/packages/sdk
   ```

2. Go to apps/ui
   ```sh
   cd apps/ui
   ```
3. Install dependencies
   ```sh
   yarn
   ```
4. Run the project
   ```sh
   yarn dev
   ```
5. Go to http://localhost:3001/psbt

<!-- USAGE EXAMPLES -->

## Usage

Make sure you already run project locally. This is the steps on how to create PSBT with the ui

1. On the <b>Choose Network</b> section, click the <b>Regtest</b> button and input your local regtest url
2. Then, input your

<!-- ROADMAP -->

## Roadmap

- [x] Add Changelog
- [x] Add back to top links
- [ ] Add Additional Templates w/ Examples
- [ ] Add "components" document to easily copy & paste sections of the readme
- [ ] Multi-language Support
  - [ ] Chinese
  - [ ] Spanish

See the [open issues](https://github.com/othneildrew/Best-README-Template/issues) for a full list of proposed features (and known issues).

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- REFERENCES -->

## References

This is the list of all references regarding to this project:

- [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib)
- [bitcoinjs-ui](https://bitcoincore.tech/apps/bitcoinjs-ui/index.html)
