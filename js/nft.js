// ===== NFT LOGIC =====

export function summarizeNFTs(nfts) {
  let total = 0;
  for (const nft of nfts) {
    total += Number(nft.value || 0);
  }
  return {
    count: nfts.length,
    totalValue: total
  };
}
