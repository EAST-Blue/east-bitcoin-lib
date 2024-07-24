import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import prisma from "../db";
import { isValidHttpUrl } from "../app/utils/isValidHttpUrl";

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.raw());
app.use(express.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Account API
app.get("/account", async (req: any, res: any) => {
  try {
    const accounts = prisma.account.findMany({ skip: 0, take: 100 });

    return res.status(200).json(accounts);
  } catch (error: any) {
    return res.status(500).json({ message: error?.message });
  }
});
app.post("/account", async (req: any, res: any) => {
  try {
    const { secret, p2wpkh, p2tr, path } = await req.body;
    await prisma.account.create({
      data: { secret, p2wpkh, p2tr, path: parseInt(path) },
    });

    return res.status(200).json(req.body);
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({ message: error?.message });
  }
});
app.delete("/account", async (req: any, res: any) => {
  try {
    const { path, secret } = await req.body;
    await prisma.account.deleteMany({
      where: { path: parseInt(path), secret },
    });

    return res.status(200).json(req.body);
  } catch (error: any) {
    return res.status(500).json({ message: error?.message });
  }
});

// Broadcast API
app.post("/broadcast", async (req: any, res: any) => {
  try {
    const { uri, hex } = await req.body;

    const response = await fetch(`${uri}/tx`, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: hex,
    });
    const data = await response.text();

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ message: error?.message });
  }
});

// Config API
app.get("/route", async (req: any, res: any) => {
  try {
    const network = await prisma.network.findFirst();

    return res.status(200).json(network);
  } catch (error: any) {
    return res.status(500).json({ message: error?.message });
  }
});
app.put("/route", async (req: any, res: any) => {
  try {
    const { network, uri, explorer, regbox } = await req.body;
    if (!isValidHttpUrl(uri)) {
      return res.status(501).json({ error: "URI INVALID" });
    }
    if (!isValidHttpUrl(explorer)) {
      return res.status(501).json({ error: "EXPLORER INVALID" });
    }

    await prisma.network.upsert({
      where: { id: 1 },
      update: { network, uri, explorer, regbox },
      create: { network, uri, explorer, regbox },
    });

    return res.status(200).json(req.body);
  } catch (error: any) {
    return res.status(500).json({ message: error?.message });
  }
});

// Transaction API
app.get("/transaction", async (req: any, res: any) => {
  try {
    const data = await prisma.transaction.findMany({
      skip: 0,
      take: 100,
      orderBy: { id: "desc" },
    });

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ message: error?.message });
  }
});
app.post("/transaction", async (req: any, res: any) => {
  try {
    const { address, network, hex, txid, amount } = await req.body;

    const result = await prisma.transaction.create({
      data: {
        address,
        network,
        hex,
        txid,
        amount,
        createdAt: new Date().getTime(),
      },
    });

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error?.message });
  }
});

app.listen(9090, () => {
  console.log(`Satsforge running in 9090`);
});
