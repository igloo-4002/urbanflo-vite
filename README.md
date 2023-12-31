# Urban Flo

![CI Status](https://img.shields.io/github/actions/workflow/status/igloo-4002/urbanflo-vite/ci.yml?style=flat-square) 
![Licence badge](https://img.shields.io/github/license/igloo-4002/urbanflo-vite?style=flat-square)

![UrbanFlo Logo](docs/images/urbanflo-logo.png)

Urban Flo allows users to model traffic networks, run simulations and
collect information on the networks efficiency.

## Features

- Backed by [SUMO](https://sumo.dlr.de) simulation engine
- 100% web based - no need for complicated installation
- Simulation statistics
- Save and load your network to your device at any time
- Free and open source (MIT licensed)

## Screenshots

Simulation UI:

![Simulation UI](docs/images/simulation.png)

Simulation statistics:

![Simulation statistics](docs/images/statistics.png)

## User guide

Refer to the [user guide document](docs/user-guide.md).

## Development

To start development on Urban Flo

### Install Dependencies

```bash
pnpm install
```

### To run the application

```bash
pnpm dev
```

### Connecting to the SUMO server

A developer has two options, either to connect and run simulations on the cloud server running on `sumo-server.urbanflo.app` or run the server locally.

To run the server locally, follow the instructions in the [server's repository](https://github.com/igloo-4002/urbanflo-sumo-server) and change the following variables in [`src/simulation-urls.ts`](src/simulation-urls.ts)

```typescript
export const DOMAIN_NAME = 'localhost:8080';
export const BASE_URL = `http://${DOMAIN_NAME}`;
export const SIMULATION_SOCKET_URL = `ws://${DOMAIN_NAME}/simulation-socket`;
```

## Contributors

<a href = "https://github.com/igloo-4002/urbanflo-vite/graphs/contributors">
  <img alt="UrbanFlo contributors" src = "https://contrib.rocks/image?repo=igloo-4002/urbanflo-vite"/>
</a>

## Licence

Licensed under [MIT License](LICENSE.txt).