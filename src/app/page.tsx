import {
  getKrakenMarkets,
  getCoinGeckoCoinsList,
  getMarketData,
  getKrakenEURBalance,
} from "@/agents/crypto/methods";

export default async function Home() {
  // const krakenMarkets = await getKrakenMarkets();
  // const coinList = await getCoinGeckoCoinsList();
  // const marketData = await getMarketData({ krakenMarkets, coinList });
  const balance = await getKrakenEURBalance();

  console.log(balance);

  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white"></main>
    </div>
  );
}
