const dotenv = require("dotenv")
const ether = require("ethers")
const fs = require("fs")

dotenv.config({
    path: "./env/.env"
})

const main = async () => {

    const provider = new ether.JsonRpcProvider(process.env.RPC_URL)
    const wallet = new ether.Wallet(process.env.WALLET_KEY, provider)
    const abiFile = fs.readFileSync("./contracts_SimpleStorage_sol_SimpleStorage.abi", { encoding: "utf-8" })
    const binFile = fs.readFileSync("./contracts_SimpleStorage_sol_SimpleStorage.bin", { encoding: "utf-8" })
    const contractFactory = new ether.ContractFactory(
        abiFile,
        binFile,
        wallet
    )
    console.log("Deploying please wait")
    const contract = await contractFactory.deploy()
    const currentFavoriteNumber = await contract.retreive()
    console.log(parseInt(currentFavoriteNumber))

    let nonce = await wallet.getNonce()
    console.log(nonce)
    const storedNumber = await contract.store("12", { nonce: nonce })
    const receipt = await storedNumber.wait(1)
    console.log(receipt)


    const updateNumber = await contract.retreive()
    console.log(parseInt(updateNumber))
}

main().then(() => {
    process.exit(0)
}).catch((e) => {
    console.log(e)
    process.exit(1)
})