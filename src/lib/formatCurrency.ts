export const formatRupee = (amount: number): string => {
  return '₹' + amount.toLocaleString('en-IN');
};
