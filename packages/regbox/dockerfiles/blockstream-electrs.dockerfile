FROM rust:1.75.0-slim-bullseye AS builder

WORKDIR /build

RUN apt-get update
RUN apt-get install -y git clang cmake libsnappy-dev

RUN git clone --branch new-index https://github.com/joundy/blockstream-electrs .

RUN cargo install --locked --path .

FROM debian:bullseye-slim

WORKDIR /data

RUN apt-get update
RUN apt-get install -y curl

COPY --from=builder /usr/local/cargo/bin/electrs /bin/electrs

# http server
# mainnet
EXPOSE 3000
# testnet
EXPOSE 3001
# regtest
EXPOSE 3002

# electrum server
# mainnet
EXPOSE 50001 
# testnet
EXPOSE 60001
# regtest
EXPOSE 60401

# prometheus monitoring
# mainnet
EXPOSE 4224
# testnet
EXPOSE 14224
# regtest
EXPOSE 24224

STOPSIGNAL SIGINT

ENTRYPOINT ["electrs"]
