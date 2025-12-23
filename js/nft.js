export function summarizeNFTs(nfts){
  let total=0;
  nfts.forEach(n=>total+=Number(n.value||0));
  return{count:nfts.length,totalValue:total};
}
