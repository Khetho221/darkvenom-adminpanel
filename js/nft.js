export function summarizeNFTs(nfts) {
  const totalValue = nfts.reduce((sum, n) => sum + n.value, 0);
  return {
    count: nfts.length,
    totalValue
  };
}
