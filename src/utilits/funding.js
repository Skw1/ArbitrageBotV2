
// Funding
function getTimeUntilNextFunding() {
    const now = new Date();
    const nextHours = [0, 8, 16].find(h => h > now.getUTCHours()) ?? 24;
    const nextFunding = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), nextHours));
    if (nextHours === 24) nextFunding.setUTCDate(nextFunding.getUTCDate() + 1);
    return (nextFunding - now) / 1000;
  }
